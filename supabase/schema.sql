-- ============================================================================
-- FRONTERAS JURÍDICAS · Esquema de base de datos (Supabase / PostgreSQL)
-- Orden de ejecución: 1) schema.sql  2) policies.sql  3) seed_preguntas.sql
-- ============================================================================

-- ───────── Tablas ─────────
create table if not exists public.players (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 2 and 16),
  created_at timestamptz not null default now()
);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique,
  host_id uuid not null references public.players(id) on delete cascade,
  status text not null default 'waiting' check (status in ('waiting','playing','finished')),
  current_level int not null default 1 check (current_level between 1 and 4),
  current_question_index int not null default 0,                -- posición global de la pregunta actual (0, 1, 2…)
  question_phase text not null default 'question' check (question_phase in ('question','reveal')),
  question_started_at timestamptz,                               -- hora del servidor en que empieza (o empezó) la pregunta
  created_at timestamptz not null default now()
);

create table if not exists public.room_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  score int not null default 0,
  answered_count int not null default 0,                         -- progreso: preguntas respondidas
  current_rank int not null default 1 check (current_rank between 1 and 5),
  connection_status text not null default 'connected' check (connection_status in ('connected','disconnected')),
  joined_at timestamptz not null default now(),
  unique (room_id, player_id)
);
create index if not exists room_players_room_idx on public.room_players(room_id);

create table if not exists public.questions (
  id text primary key,
  level_id int not null check (level_id between 1 and 4),
  position int not null,
  question_text text not null,
  options jsonb not null,
  correct_answer int not null,
  explanation text not null,
  time_limit int not null default 20 check (time_limit between 5 and 120),
  unique (level_id, position)
);

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  question_id text not null references public.questions(id) on delete cascade,
  selected_answer int not null,
  is_correct boolean not null,
  response_time numeric(8,3) not null,                           -- segundos, medidos por el SERVIDOR
  points_earned int not null,
  created_at timestamptz not null default now(),
  unique (room_id, player_id, question_id)                       -- impide responder dos veces
);

create table if not exists public.game_results (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  room_id uuid not null references public.rooms(id) on delete cascade,
  total_score int not null,
  completed_at timestamptz not null default now(),
  unique (room_id, player_id)
);
create index if not exists game_results_score_idx on public.game_results(total_score desc);

-- ───────── Funciones auxiliares ─────────
-- Rangos según puntaje acumulado (mantener sincronizado con src/data/ranks.js)
create or replace function public.rango_para(p_score int) returns int
language sql immutable as $$
  select case when p_score >= 19000 then 5 when p_score >= 15000 then 4
              when p_score >= 10000 then 3 when p_score >= 5000 then 2 else 1 end
$$;

create or replace function public.es_miembro_sala(p_room uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from room_players where room_id = p_room and player_id = auth.uid())
$$;

create or replace function public.hora_servidor() returns timestamptz
language sql stable as $$ select clock_timestamp() $$;

-- ───────── Crear sala ─────────
create or replace function public.crear_sala(p_nickname text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_nick text := btrim(coalesce(p_nickname, ''));
  v_code text; v_room uuid; v_intentos int := 0;
  v_alfabeto constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
begin
  if v_uid is null then raise exception 'no_autenticado'; end if;
  if char_length(v_nick) not between 2 and 16 then raise exception 'apodo_invalido'; end if;
  insert into players (id, nickname) values (v_uid, v_nick)
    on conflict (id) do update set nickname = excluded.nickname;
  loop
    v_code := '';
    for i in 1..5 loop
      v_code := v_code || substr(v_alfabeto, 1 + floor(random() * length(v_alfabeto))::int, 1);
    end loop;
    begin
      insert into rooms (room_code, host_id) values (v_code, v_uid) returning id into v_room;
      exit;
    exception when unique_violation then
      v_intentos := v_intentos + 1;
      if v_intentos > 10 then raise exception 'no_codigo'; end if;
    end;
  end loop;
  insert into room_players (room_id, player_id) values (v_room, v_uid);
  return jsonb_build_object('room_id', v_room, 'room_code', v_code);
end $$;

-- ───────── Unirse a una sala ─────────
create or replace function public.unirse_sala(p_code text, p_nickname text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_nick text := btrim(coalesce(p_nickname, ''));
  v_room rooms%rowtype; v_n int;
begin
  if v_uid is null then raise exception 'no_autenticado'; end if;
  if char_length(v_nick) not between 2 and 16 then raise exception 'apodo_invalido'; end if;
  select * into v_room from rooms where room_code = upper(btrim(coalesce(p_code, '')));
  if not found then raise exception 'sala_no_existe'; end if;

  -- Reingreso (reconexión): quien ya pertenece a la sala puede volver en cualquier estado.
  if exists (select 1 from room_players where room_id = v_room.id and player_id = v_uid) then
    update room_players set connection_status = 'connected' where room_id = v_room.id and player_id = v_uid;
    return jsonb_build_object('room_id', v_room.id, 'room_code', v_room.room_code);
  end if;

  if v_room.status <> 'waiting' then raise exception 'partida_iniciada'; end if;
  select count(*) into v_n from room_players where room_id = v_room.id;
  if v_n >= 10 then raise exception 'sala_llena'; end if;
  if exists (select 1 from room_players rp join players p on p.id = rp.player_id
             where rp.room_id = v_room.id and lower(p.nickname) = lower(v_nick)) then
    raise exception 'apodo_en_uso';
  end if;

  insert into players (id, nickname) values (v_uid, v_nick)
    on conflict (id) do update set nickname = excluded.nickname;
  insert into room_players (room_id, player_id) values (v_room.id, v_uid);
  return jsonb_build_object('room_id', v_room.id, 'room_code', v_room.room_code);
end $$;

-- ───────── Salir de la sala ─────────
create or replace function public.salir_sala(p_room uuid) returns void
language plpgsql security definer set search_path = public as $$
declare r rooms%rowtype;
begin
  select * into r from rooms where id = p_room;
  if not found then return; end if;
  if r.status = 'waiting' and r.host_id <> auth.uid() then
    delete from room_players where room_id = p_room and player_id = auth.uid();
  else
    update room_players set connection_status = 'disconnected' where room_id = p_room and player_id = auth.uid();
  end if;
end $$;

create or replace function public.marcar_conexion(p_room uuid, p_estado text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_estado not in ('connected','disconnected') then raise exception 'estado_invalido'; end if;
  update room_players set connection_status = p_estado where room_id = p_room and player_id = auth.uid();
end $$;

-- ───────── Avanzar la partida (solo anfitrión) ─────────
-- Estados: waiting → playing(question ⇄ reveal) → finished.
-- p_indice y p_fase evitan avances duplicados (doble clic, temporizador + botón).
create or replace function public.avanzar_sala(p_room uuid, p_indice int, p_fase text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  r rooms%rowtype; v_total int; v_nivel_actual int; v_nivel_sig int;
begin
  select * into r from rooms where id = p_room for update;
  if not found then raise exception 'sala_no_existe'; end if;
  if r.host_id <> auth.uid() then raise exception 'solo_anfitrion'; end if;
  select count(*) into v_total from questions;
  if v_total = 0 then raise exception 'sin_preguntas'; end if;

  if r.status = 'waiting' then
    if (select count(*) from room_players where room_id = p_room) < 2 then raise exception 'faltan_jugadores'; end if;
    update rooms set status = 'playing', current_question_index = 0, question_phase = 'question',
      question_started_at = clock_timestamp() + interval '6 seconds',
      current_level = (select level_id from questions order by level_id, position limit 1)
    where id = p_room;

  elsif r.status = 'playing' then
    if r.current_question_index <> p_indice or r.question_phase <> p_fase then
      return jsonb_build_object('aplicado', false);
    end if;
    if r.question_phase = 'question' then
      if clock_timestamp() < r.question_started_at then raise exception 'pregunta_no_iniciada'; end if;
      update rooms set question_phase = 'reveal' where id = p_room;
    elsif r.current_question_index + 1 < v_total then
      select level_id into v_nivel_actual from questions order by level_id, position offset r.current_question_index limit 1;
      select level_id into v_nivel_sig from questions order by level_id, position offset r.current_question_index + 1 limit 1;
      update rooms set
        current_question_index = r.current_question_index + 1,
        question_phase = 'question',
        question_started_at = clock_timestamp() + case when v_nivel_sig <> v_nivel_actual then interval '6 seconds' else interval '3 seconds' end,
        current_level = v_nivel_sig
      where id = p_room;
    else
      update rooms set status = 'finished' where id = p_room;
      insert into game_results (player_id, room_id, total_score)
        select player_id, room_id, score from room_players where room_id = p_room
        on conflict (room_id, player_id) do nothing;
    end if;
  end if;
  return jsonb_build_object('aplicado', true);
end $$;

-- ───────── Enviar respuesta (validación y puntaje en el servidor) ─────────
create or replace function public.enviar_respuesta(p_room uuid, p_question_id text, p_opcion int) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  r rooms%rowtype; q questions%rowtype; v_actual text;
  v_t numeric; v_ok boolean; v_pts int; v_score int;
begin
  if v_uid is null then raise exception 'no_autenticado'; end if;
  if not exists (select 1 from room_players where room_id = p_room and player_id = v_uid) then raise exception 'no_miembro'; end if;
  select * into r from rooms where id = p_room;
  if not found or r.status <> 'playing' or r.question_phase <> 'question' then raise exception 'pregunta_cerrada'; end if;

  select id into v_actual from questions order by level_id, position offset r.current_question_index limit 1;
  if v_actual is distinct from p_question_id then raise exception 'pregunta_cerrada'; end if;
  select * into q from questions where id = p_question_id;

  -- El tiempo lo mide el servidor: el navegador no puede falsearlo.
  v_t := extract(epoch from (clock_timestamp() - r.question_started_at));
  if v_t < 0 then raise exception 'pregunta_no_iniciada'; end if;
  if v_t > q.time_limit + 2 then raise exception 'tiempo_agotado'; end if;   -- 2 s de tolerancia por latencia
  if p_opcion is null or p_opcion < 0 or p_opcion >= jsonb_array_length(q.options) then raise exception 'opcion_invalida'; end if;

  v_ok := (p_opcion = q.correct_answer);
  -- 1000 puntos al instante, 700 a mitad de tiempo, 400 al límite (lineal). Incorrecta = 0.
  v_pts := case when v_ok then round(1000 - 600 * least(greatest(v_t / q.time_limit, 0), 1))::int else 0 end;

  begin
    insert into answers (room_id, player_id, question_id, selected_answer, is_correct, response_time, points_earned)
    values (p_room, v_uid, p_question_id, p_opcion, v_ok, round(v_t, 3), v_pts);
  exception when unique_violation then
    raise exception 'ya_respondida';
  end;

  update room_players
     set score = score + v_pts, answered_count = answered_count + 1, current_rank = rango_para(score + v_pts)
   where room_id = p_room and player_id = v_uid
   returning score into v_score;

  return jsonb_build_object('es_correcta', v_ok, 'puntos', v_pts, 'puntaje_total', v_score);
end $$;

-- ───────── Revelación (solo disponible cuando la fase es "reveal") ─────────
create or replace function public.obtener_revelacion(p_room uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare r rooms%rowtype; q questions%rowtype;
begin
  if not es_miembro_sala(p_room) then raise exception 'no_miembro'; end if;
  select * into r from rooms where id = p_room;
  if r.status = 'waiting' or (r.status = 'playing' and r.question_phase <> 'reveal') then
    raise exception 'aun_no_disponible';
  end if;
  select * into q from questions order by level_id, position offset r.current_question_index limit 1;
  return jsonb_build_object('id', q.id, 'correcta', q.correct_answer, 'explicacion', q.explanation);
end $$;

-- ───────── Clasificación general ─────────
create or replace function public.ranking_general(p_limite int default 20)
returns table (posicion bigint, nickname text, mejor_puntaje int, partidas bigint)
language sql stable security definer set search_path = public as $$
  select row_number() over (order by max(g.total_score) desc, p.nickname) as posicion,
         p.nickname, max(g.total_score)::int as mejor_puntaje, count(*) as partidas
    from game_results g join players p on p.id = g.player_id
   group by p.id, p.nickname
   order by mejor_puntaje desc, p.nickname
   limit least(greatest(coalesce(p_limite, 20), 1), 100)
$$;
