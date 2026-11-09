// Persistencia local: alias, resultados del modo individual y sala activa (para reconectar).
const K_APODO = 'fj_apodo';
const K_RESULTADOS = 'fj_resultados_locales';
const K_SALA = 'fj_sala_activa';

const leer = (almacen, clave) => { try { return almacen.getItem(clave); } catch { return null; } };
const escribir = (almacen, clave, valor) => { try { almacen.setItem(clave, valor); } catch { /* ignorar */ } };

export const leerApodo = () => leer(localStorage, K_APODO) || '';
export const guardarApodo = (a) => escribir(localStorage, K_APODO, a);

export function leerResultadosLocales() {
  try { return JSON.parse(leer(localStorage, K_RESULTADOS) || '[]'); } catch { return []; }
}
export function guardarResultadoLocal({ nombre, puntos, aciertos, total }) {
  const lista = leerResultadosLocales();
  lista.push({ nombre, puntos, aciertos, total, fecha: new Date().toISOString() });
  lista.sort((a, b) => b.puntos - a.puntos);
  escribir(localStorage, K_RESULTADOS, JSON.stringify(lista.slice(0, 20)));
}

// La sala activa se guarda por pestaña (sessionStorage), igual que la sesión anónima de Supabase.
export const leerSalaActiva = () => leer(sessionStorage, K_SALA);
export const guardarSalaActiva = (id) => escribir(sessionStorage, K_SALA, id);
export const limpiarSalaActiva = () => { try { sessionStorage.removeItem(K_SALA); } catch { /* ignorar */ } };
