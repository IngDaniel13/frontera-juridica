import './styles/main.css';
import './styles/niveles.css';
import './styles/pantalla-fija.css';
import { registrar, ir } from './ui/router.js';
import { pantallaInicio } from './ui/screens/inicio.js';
import { pantallaComoJugar } from './ui/screens/comoJugar.js';
import { pantallaInfo } from './ui/screens/info.js';
import { pantallaClasificacion } from './ui/screens/clasificacion.js';
import { pantallaSolo } from './ui/screens/solo.js';
import { pantallaResultadoSolo } from './ui/screens/resultadoSolo.js';
import { pantallaMulti } from './ui/screens/multi.js';
import { pantallaSala } from './ui/screens/sala.js';
import { supabaseConfigurado } from './services/supabase.js';
import { leerSalaActiva } from './utils/almacenamiento.js';

registrar('inicio', pantallaInicio);
registrar('comoJugar', pantallaComoJugar);
registrar('info', pantallaInfo);
registrar('clasificacion', pantallaClasificacion);
registrar('solo', pantallaSolo);
registrar('resultadoSolo', pantallaResultadoSolo);
registrar('multi', pantallaMulti);
registrar('sala', pantallaSala);

// Arranque: reconecta con la sala activa tras recargar, o abre la invitación (?sala=CODIGO), o el menú.
const codigoInvitacion = new URLSearchParams(location.search).get('sala');
const salaActiva = supabaseConfigurado ? leerSalaActiva() : null;

if (salaActiva) ir('sala', { salaId: salaActiva });
else if (codigoInvitacion) ir('multi', { codigo: codigoInvitacion.toUpperCase().slice(0, 5) });
else ir('inicio');
