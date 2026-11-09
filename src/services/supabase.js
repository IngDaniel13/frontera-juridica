// Conexión con Supabase. Si no hay credenciales válidas, el juego funciona en MODO LOCAL (solo individual).
const url = import.meta.env.VITE_SUPABASE_URL;
const clave = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigurado = Boolean(
  url && clave && /^https:\/\/.+\..+/.test(url) && !url.includes('TU-PROYECTO') && !clave.includes('TU-CLAVE')
);

let cliente = null;

// Se carga la biblioteca solo cuando se necesita (el modo local no la descarga).
export async function getSupabase() {
  if (!supabaseConfigurado) throw new Error('Supabase no está configurado.');
  if (!cliente) {
    const { createClient } = await import('@supabase/supabase-js');
    cliente = createClient(url, clave, {
      auth: {
        // sessionStorage: cada pestaña es un jugador distinto (útil para probar con varias pestañas).
        storage: window.sessionStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
      },
      realtime: { params: { eventsPerSecond: 10 } }
    });
  }
  return cliente;
}

// Sesión anónima: identifica al jugador sin pedirle correo ni contraseña.
export async function asegurarSesion() {
  const sb = await getSupabase();
  const { data } = await sb.auth.getSession();
  if (data.session) return data.session.user;
  const { data: nuevo, error } = await sb.auth.signInAnonymously();
  if (error || !nuevo?.user) {
    throw new Error('No se pudo iniciar la sesión. En Supabase activa «Allow anonymous sign-ins» (Authentication → Sign In / Providers).');
  }
  return nuevo.user;
}
