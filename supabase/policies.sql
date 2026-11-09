-- ============================================================================
-- FRONTERAS JURÍDICAS · Seguridad (RLS, permisos y Realtime)
-- Ejecutar DESPUÉS de schema.sql. Todas las escrituras pasan por funciones RPC.
-- ============================================================================

alter table public.players       enable row level security;
alter table public.rooms         enable row level security;
alter table public.room_players  enable row level security;
alter table public.questions     enable row level security;
alter table public.answers       enable row level security;
alter table public.game_results  enable row level security;

-- Nadie escribe directamente en las tablas desde el navegador.
revoke all on all tables in schema public from anon;
revoke insert, update, delete, truncate on all tables in schema public from authenticated;
grant select on public.players, public.rooms, public.room_players, public.answers, public.game_results to authenticated;

-- Lecturas
drop policy if exists players_select on public.players;
create policy players_select on public.players for select to authenticated using (true);          -- solo alias

drop policy if exists rooms_select on public.rooms;
create policy rooms_select on public.rooms for select to authenticated
  using (host_id = auth.uid() or public.es_miembro_sala(id));

drop policy if exists room_players_select on public.room_players;
create policy room_players_select on public.room_players for select to authenticated
  using (public.es_miembro_sala(room_id));

drop policy if exists answers_select on public.answers;
create policy answers_select on public.answers for select to authenticated
  using (player_id = auth.uid());                                                                 -- solo las propias

drop policy if exists game_results_select on public.game_results;
create policy game_results_select on public.game_results for select to authenticated
  using (player_id = auth.uid());

-- Preguntas: la tabla NO es legible desde el navegador (contiene la respuesta correcta).
-- Se expone una vista sin "correct_answer" ni "explanation".
revoke all on public.questions from authenticated;
create or replace view public.questions_public as
  select id, level_id, position, question_text, options, time_limit from public.questions;
revoke all on public.questions_public from anon;
grant select on public.questions_public to authenticated;

-- Funciones: solo usuarios autenticados (sesión anónima incluida) pueden ejecutarlas.
revoke execute on all functions in schema public from public, anon;
grant execute on function
  public.crear_sala(text), public.unirse_sala(text, text), public.salir_sala(uuid),
  public.marcar_conexion(uuid, text), public.avanzar_sala(uuid, int, text),
  public.enviar_respuesta(uuid, text, int), public.obtener_revelacion(uuid),
  public.ranking_general(int), public.hora_servidor(), public.es_miembro_sala(uuid)
  to authenticated;   -- es_miembro_sala la usan las políticas RLS

-- Realtime: cambios de salas y jugadores (las políticas RLS también filtran lo que recibe cada cliente).
alter table public.rooms        replica identity full;
alter table public.room_players replica identity full;
do $$ begin
  alter publication supabase_realtime add table public.rooms;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.room_players;
exception when duplicate_object then null; end $$;
