// Reloj sincronizado con el servidor (diferencia entre la hora del dispositivo y la de Supabase).
let desfase = 0;
export const fijarDesfase = (ms) => { desfase = ms; };
export const ahoraServidor = () => Date.now() + desfase;
