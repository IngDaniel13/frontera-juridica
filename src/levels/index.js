import nivel1 from './level1.js';
import nivel2 from './level2.js';
import nivel3 from './level3.js';
import nivel4 from './level4.js';

export const NIVELES = [nivel1, nivel2, nivel3, nivel4];
export const nivelPorId = (id) => NIVELES.find((n) => n.id === id);
