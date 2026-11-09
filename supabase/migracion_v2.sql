-- ============================================================================
-- FRONTERAS JURÍDICAS · MIGRACIÓN v2 (juego por retos con mecánicas diferenciadas)
-- Ejecutar UNA VEZ en Supabase → SQL Editor, sobre la base ya creada con schema.sql y policies.sql.
-- Es repetible (idempotente). Después ejecuta supabase/seed_retos.sql.
-- ATENCIÓN: elimina las tablas antiguas de preguntas/respuestas (questions, answers).
-- ============================================================================

-- ───────── 1. Limpiar la versión anterior ─────────
drop function if exists public.avanzar_sala(uuid, int, text);
drop function if exists public.enviar_respuesta(uuid, text, int);
drop function if exists public.obtener_revelacion(uuid);
drop view if exists public.questions_public;
drop table if exists public.answers;
drop table if exists public.questions;

-- ───────── 2. Columnas nuevas ─────────
alter table public.rooms        add column if not exists started_at timestamptz;
alter table public.room_players add column if not exists levels_done int not null default 0;
alter table public.room_players add column if not exists finished_at timestamptz;
-- room_players.answered_count ahora cuenta RETOS completados (progreso).

-- ───────── 3. Tablas nuevas ─────────
-- Retos: la solución y la retroalimentación solo viven aquí; el navegador no puede leer esta tabla.
create table if not exists public.challenges (
  id text primary key,
  level_id int not null check (level_id between 1 and 4),
  position int not null,
  points int not null check (points > 0),
  solution jsonb not null,      -- { clave: { valor: crédito 0..1 } }
  feedback jsonb not null,
  summary text not null default '',
  unique (level_id, position)
);

create table if not exists public.challenge_results (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  challenge_id text not null references public.challenges(id) on delete cascade,
  answer jsonb not null,
  credit numeric(5,4) not null,
  points_earned int not null,
  created_at timestamptz not null default now(),
  unique (room_id, player_id, challenge_id)          -- un solo intento puntuado por reto
);

create table if not exists public.level_runs (
  room_id uuid not null references public.rooms(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  level_id int not null check (level_id between 1 and 4),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  bonus int not null default 0,
  primary key (room_id, player_id, level_id)
);

-- ───────── 4. Rangos (máximo posible 9.200) ─────────
create or replace function public.rango_para(p_score int) returns int
language sql immutable as $$
  select case when p_score >= 7500 then 5 when p_score >= 6000 then 4
              when p_score >= 4000 then 3 when p_score >= 2000 then 2 else 1 end
$$;

-- ───────── 5. Evaluación: crédito = promedio del crédito de cada clave ─────────
create or replace function public.evaluar_credito(p_solution jsonb, p_answer jsonb) returns numeric
language sql immutable as $$
  select coalesce(avg(coalesce((p_solution -> k.key ->> (p_answer ->> k.key))::numeric, 0)), 0)
    from jsonb_object_keys(p_solution) as k(key)
$$;

create or replace function public.cerrar_sala(p_room uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  update rooms set status = 'finished' where id = p_room and status <> 'finished';
  insert into game_results (player_id, room_id, total_score)
    select player_id, room_id, score from room_players where room_id = p_room
    on conflict (room_id, player_id) do nothing;
end $$;

-- ───────── 6. Flujo de la partida ─────────
create or replace function public.iniciar_partida(p_room uuid) returns void
language plpgsql security definer set search_path = public as $$
declare r rooms%rowtype;
begin
  select * into r from rooms where id = p_room for update;
  if not found then raise exception 'sala_no_existe'; end if;
  if r.host_id <> auth.uid() then raise exception 'solo_anfitrion'; end if;
  if r.status <> 'waiting' then return; end if;
  if (select count(*) from room_players where room_id = p_room) < 2 then raise exception 'faltan_jugadores'; end if;
  if (select count(*) from challenges) = 0 then raise exception 'sin_retos'; end if;
  update rooms set status = 'playing', started_at = clock_timestamp() where id = p_room;
end $$;

create or replace function public.finalizar_partida(p_room uuid) returns void
language plpgsql security definer set search_path = public as $$
declare r rooms%rowtype;
begin
  select * into r from rooms where id = p_room;
  if not found then raise exception 'sala_no_existe'; end if;
  if r.host_id <> auth.uid() then raise exception 'solo_anfitrion'; end if;
  if r.status = 'playing' then perform cerrar_sala(p_room); end if;
end $$;

create or replace function public.entrar_nivel(p_room uuid, p_level int) returns void
language plpgsql security definer set search_path = public as $$
declare v_done int;
begin
  if auth.uid() is null then raise exception 'no_autenticado'; end if;
  if not exists (select 1 from rooms where id = p_room and status = 'playing') then raise exception 'partida_no_iniciada'; end if;
  select levels_done into v_done from room_players where room_id = p_room and player_id = auth.uid();
  if not found then raise exception 'no_miembro'; end if;
  if p_level < 1 or p_level > 4 or p_level > v_done + 1 then raise exception 'nivel_no_disponible'; end if;
  insert into level_runs (room_id, player_id, level_id) values (p_room, auth.uid(), p_level) on conflict do nothing;
end $$;

-- Evalúa un reto en el servidor. Un solo intento puntuado por reto.
create or replace function public.enviar_reto(p_room uuid, p_challenge text, p_answer jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  c challenges%rowtype; v_cred numeric; v_pts int; v_total int;
begin
  if v_uid is null then raise exception 'no_autenticado'; end if;
  if not exists (select 1 from room_players where room_id = p_room and player_id = v_uid) then raise exception 'no_miembro'; end if;
  if not exists (select 1 from rooms where id = p_room and status = 'playing') then raise exception 'partida_no_iniciada'; end if;
  select * into c from challenges where id = p_challenge;
  if not found then raise exception 'reto_desconocido'; end if;
  if not exists (select 1 from level_runs where room_id = p_room and player_id = v_uid and level_id = c.level_id and finished_at is null) then
    raise exception 'nivel_no_iniciado';
  end if;
  if coalesce(jsonb_typeof(p_answer), '') <> 'object' then raise exception 'respuesta_invalida'; end if;

  v_cred := round(evaluar_credito(c.solution, p_answer), 4);
  v_pts := round(c.points * v_cred)::int;
  begin
    insert into challenge_results (room_id, player_id, challenge_id, answer, credit, points_earned)
    values (p_room, v_uid, p_challenge, p_answer, v_cred, v_pts);
  exception when unique_violation then
    raise exception 'ya_respondida';
  end;
  update room_players
     set score = score + v_pts, answered_count = answered_count + 1, current_rank = rango_para(score + v_pts)
   where room_id = p_room and player_id = v_uid
   returning score into v_total;
  return jsonb_build_object('credito', v_cred, 'puntos', v_pts, 'puntaje_total', v_total,
                            'solucion', c.solution, 'feedback', c.feedback, 'resumen', c.summary);
end $$;

-- Cierra el nivel: exige todos los retos resueltos y suma el bono (15 % de lo ganado × rapidez).
create or replace function public.terminar_nivel(p_room uuid, p_level int) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_run level_runs%rowtype; v_n int; v_have int; v_earned int; v_par int;
  v_elapsed numeric; v_bono int; v_total int;
begin
  if v_uid is null then raise exception 'no_autenticado'; end if;
  if not exists (select 1 from rooms where id = p_room and status = 'playing') then raise exception 'partida_no_iniciada'; end if;
  select * into v_run from level_runs where room_id = p_room and player_id = v_uid and level_id = p_level for update;
  if not found then raise exception 'nivel_no_iniciado'; end if;
  if v_run.finished_at is not null then      -- repetible: devuelve lo ya calculado
    select score into v_total from room_players where room_id = p_room and player_id = v_uid;
    return jsonb_build_object('bono', v_run.bonus, 'puntaje_total', v_total);
  end if;

  select count(*) into v_n from challenges where level_id = p_level;
  select count(*), coalesce(sum(cr.points_earned), 0) into v_have, v_earned
    from challenge_results cr join challenges ch on ch.id = cr.challenge_id
   where cr.room_id = p_room and cr.player_id = v_uid and ch.level_id = p_level;
  if v_have < v_n then raise exception 'nivel_incompleto'; end if;

  v_par := case p_level when 1 then 360 when 2 then 300 when 3 then 300 else 480 end;
  v_elapsed := extract(epoch from (clock_timestamp() - v_run.started_at));
  v_bono := round(0.15 * v_earned * least(greatest((2 * v_par - v_elapsed) / v_par, 0), 1))::int;

  update level_runs set finished_at = clock_timestamp(), bonus = v_bono
   where room_id = p_room and player_id = v_uid and level_id = p_level;
  update room_players
     set score = score + v_bono, current_rank = rango_para(score + v_bono),
         levels_done = greatest(levels_done, p_level),
         finished_at = case when p_level = 4 then clock_timestamp() else finished_at end
   where room_id = p_room and player_id = v_uid
   returning score into v_total;

  -- Si todos terminaron el nivel 4, la partida se cierra sola y se guardan los resultados.
  if p_level = 4 and not exists (select 1 from room_players where room_id = p_room and finished_at is null) then
    perform cerrar_sala(p_room);
  end if;
  return jsonb_build_object('bono', v_bono, 'puntaje_total', v_total);
end $$;

-- ───────── 7. Seguridad (RLS y permisos) ─────────
alter table public.challenges        enable row level security;
alter table public.challenge_results enable row level security;
alter table public.level_runs        enable row level security;

revoke all on public.challenges, public.challenge_results, public.level_runs from anon, authenticated;
grant select on public.challenge_results, public.level_runs to authenticated;

drop policy if exists challenge_results_select on public.challenge_results;
create policy challenge_results_select on public.challenge_results for select to authenticated using (player_id = auth.uid());
drop policy if exists level_runs_select on public.level_runs;
create policy level_runs_select on public.level_runs for select to authenticated using (player_id = auth.uid());

revoke execute on all functions in schema public from public, anon;
revoke execute on function public.cerrar_sala(uuid), public.evaluar_credito(jsonb, jsonb) from authenticated;
grant execute on function
  public.crear_sala(text), public.unirse_sala(text, text), public.salir_sala(uuid),
  public.marcar_conexion(uuid, text), public.iniciar_partida(uuid), public.finalizar_partida(uuid),
  public.entrar_nivel(uuid, int), public.enviar_reto(uuid, text, jsonb), public.terminar_nivel(uuid, int),
  public.ranking_general(int), public.hora_servidor(), public.es_miembro_sala(uuid)
  to authenticated;
