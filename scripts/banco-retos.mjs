// FUENTE ÚNICA del contenido jugable (retos). Después de editarlo ejecuta: npm run generar-datos
// Cada reto tiene una parte PÚBLICA (lo que se dibuja) y una SECRETA (solucion, feedback, resumen) que solo
// llega al navegador DESPUÉS de resolver el reto (en multijugador la entrega Supabase).
// solucion: { clave: { valor: crédito 0..1 } }  ·  feedback: { clave: "texto" | { valor: "texto" } }
// Tipos: «clasificar» (asignar cada tarjeta a una categoría) y «negociar» (mesa de negociación).

const KELLER = { nombre: 'Herr Keller', rol: 'Compras · Alemania', emoji: '🧑‍💼' };
const YO = { nombre: 'Tú', rol: 'Café del Huila · Colombia', emoji: '👩‍⚖️' };

export const BANCO = [
  // ═════════ NIVEL 1 · EXPLORACIÓN, DESCUBRIMIENTO Y CLASIFICACIÓN ═════════
  {
    id: 'n1c1', nivel: 1, orden: 1, tipo: 'clasificar', puntos: 600,
    titulo: 'Mesa de clasificación',
    corto: 'Asigna cada situación a su herramienta.',
    instruccion: 'Con lo que descubriste en la Cámara, coloca cada situación en la herramienta de la CCI que la resuelve.',
    categorias: [
      { id: 'incoterms', texto: 'Incoterms (reglas de entrega)' },
      { id: 'arbitraje', texto: 'Arbitraje' },
      { id: 'representacion', texto: 'Representación empresarial' },
      { id: 'promocion', texto: 'Promoción' },
      { id: 'capacitacion', texto: 'Capacitación' }
    ],
    items: [
      { id: 'i1', texto: 'Una empresa colombiana y una alemana quieren dejar claro quién contrata el transporte y quién asume el riesgo durante el viaje.' },
      { id: 'i2', texto: 'Dos empresas pactaron que sus disputas las resolverán árbitros y no jueces estatales.' },
      { id: 'i3', texto: 'Un gremio de exportadores quiere que su posición llegue a gobiernos y organismos internacionales.' },
      { id: 'i4', texto: 'Una empresa busca contactos y espacios para darse a conocer ante socios de otros países.' },
      { id: 'i5', texto: 'Un equipo de comercio exterior necesita formarse para aplicar bien las reglas del comercio internacional.' }
    ],
    consecuencia: 'La empresa acudiría a una herramienta que no resuelve su necesidad y perdería tiempo y dinero.',
    solucion: { i1: { incoterms: 1 }, i2: { arbitraje: 1 }, i3: { representacion: 1 }, i4: { promocion: 1 }, i5: { capacitacion: 1 } },
    feedback: {
      i1: 'Los Incoterms reparten tareas, costos y riesgos de la entrega. No fijan la ley aplicable ni el juez competente.',
      i2: 'El arbitraje nace de un convenio de las partes: árbitros privados deciden con un laudo obligatorio. La CCI administra estos procesos.',
      i3: 'La representación empresarial lleva la voz del sector privado ante gobiernos y organismos internacionales.',
      i4: 'La promoción acerca empresas de distintos países y fomenta el comercio y la inversión.',
      i5: 'La capacitación forma a las empresas para aplicar bien las reglas y prácticas del comercio internacional.'
    },
    resumen: 'La CCI reúne en un mismo entorno reglas (Incoterms), arbitraje, representación, promoción y capacitación. No es un tribunal estatal ni una autoridad aduanera.'
  },
  {
    id: 'n1c2', nivel: 1, orden: 2, tipo: 'clasificar', puntos: 400,
    titulo: 'El baúl del exportador',
    corto: 'Decide qué ofrece la CCI y qué no.',
    instruccion: 'Arma el baúl: pon en «Lo ofrece la CCI» lo que sí es suyo y en «No es función de la CCI» lo que no.',
    categorias: [{ id: 'si', texto: 'Lo ofrece la CCI' }, { id: 'no', texto: 'No es función de la CCI' }],
    items: [
      { id: 'k1', texto: 'Reglas Incoterms' },
      { id: 'k2', texto: 'Administración de procesos de arbitraje' },
      { id: 'k3', texto: 'Cursos y seminarios para empresas' },
      { id: 'k4', texto: 'Sentencias obligatorias de un juez estatal' },
      { id: 'k5', texto: 'Cobro de aranceles en la aduana' },
      { id: 'k6', texto: 'Representación de los intereses empresariales ante gobiernos' }
    ],
    consecuencia: 'Esperarías de la CCI algo que no le corresponde, o ignorarías un servicio que sí podrías usar.',
    solucion: { k1: { si: 1 }, k2: { si: 1 }, k3: { si: 1 }, k4: { no: 1 }, k5: { no: 1 }, k6: { si: 1 } },
    feedback: {
      k1: 'Los Incoterms son reglas elaboradas por la CCI.',
      k2: 'La Corte Internacional de Arbitraje de la CCI administra procesos arbitrales; quienes deciden son los árbitros.',
      k3: 'La CCI ofrece formación para las empresas.',
      k4: 'La CCI no es un tribunal estatal: no dicta sentencias de jueces.',
      k5: 'Los aranceles los cobran las autoridades aduaneras de cada Estado, no la CCI.',
      k6: 'La CCI representa los intereses empresariales ante gobiernos y organismos internacionales.'
    },
    resumen: 'Distinguir lo que la CCI hace (reglas, arbitraje, formación, representación) de lo que hacen los Estados (sentencias, aranceles) evita confundir instituciones.'
  },

  // ═════════ NIVEL 2 · INSTRUMENTOS DE LA CCI (estaciones: descubrir, asociar y clasificar) ═════════
  {
    id: 'n2c1', nivel: 2, orden: 1, tipo: 'clasificar', puntos: 250,
    titulo: 'Asocia cada Incoterm',
    corto: 'Cada tarjeta describe un reparto de la entrega.',
    instruccion: 'Cada tarjeta describe cómo se reparten la entrega, los costos y el riesgo. Asígnala al Incoterm 2020 que le corresponde.',
    categorias: [{ id: 'exw', texto: 'EXW' }, { id: 'fca', texto: 'FCA' }, { id: 'cif', texto: 'CIF' }, { id: 'dap', texto: 'DAP' }],
    items: [
      { id: 'a1', texto: 'El vendedor solo pone la mercancía a disposición del comprador en su establecimiento.' },
      { id: 'a2', texto: 'El vendedor entrega al transportista que designa el comprador y despacha la exportación.' },
      { id: 'a3', texto: 'El vendedor paga flete y seguro hasta el puerto de destino, pero el riesgo pasa al comprador al embarcar.' },
      { id: 'a4', texto: 'El vendedor entrega en el destino acordado, lista para descargar; el comprador se encarga de la importación.' }
    ],
    consecuencia: 'Pactarías un término que reparte costos y riesgos de forma distinta a la que esperabas.',
    solucion: { a1: { exw: 1 }, a2: { fca: 1 }, a3: { cif: 1 }, a4: { dap: 1 } },
    feedback: {
      a1: 'EXW es la menor obligación para el vendedor: el comprador asume transporte, exportación y riesgos desde el establecimiento del vendedor.',
      a2: 'En FCA el vendedor cumple al entregar al transportista designado por el comprador y despacha la exportación; el riesgo pasa en ese momento.',
      a3: 'En CIF el vendedor contrata y paga flete y seguro hasta el puerto de destino, pero el riesgo pasa al comprador cuando la mercancía está a bordo. Solo se usa en transporte marítimo y fluvial.',
      a4: 'En DAP el vendedor asume costos y riesgo hasta el destino convenido, listo para descargar; la importación corresponde al comprador.'
    },
    resumen: 'Los Incoterms 2020 reparten obligaciones de entrega, costos y riesgos; cada término mueve esa «frontera» a un punto distinto de la operación.'
  },
  {
    id: 'n2c2', nivel: 2, orden: 2, tipo: 'clasificar', puntos: 250,
    titulo: '¿Qué regulan los Incoterms?',
    corto: 'Separa lo que regulan de lo que no.',
    instruccion: 'Decide si cada asunto lo regulan los Incoterms 2020 o si queda fuera de ellos.',
    categorias: [{ id: 'si', texto: 'Lo regulan' }, { id: 'no', texto: 'No lo regulan' }],
    items: [
      { id: 'b1', texto: 'Quién contrata y paga el transporte' },
      { id: 'b2', texto: 'En qué momento pasa el riesgo de pérdida o daño' },
      { id: 'b3', texto: 'Quién se encarga del despacho de exportación' },
      { id: 'b4', texto: 'Cuándo se transfiere la propiedad de la mercancía' },
      { id: 'b5', texto: 'La forma de pago del precio' },
      { id: 'b6', texto: 'La ley aplicable y la solución de controversias' }
    ],
    consecuencia: 'Creerías que el Incoterm resuelve asuntos que requieren otras cláusulas y quedarías sin regla ante un conflicto.',
    solucion: { b1: { si: 1 }, b2: { si: 1 }, b3: { si: 1 }, b4: { no: 1 }, b5: { no: 1 }, b6: { no: 1 } },
    feedback: {
      b1: 'El reparto del transporte entre vendedor y comprador es una función central del Incoterm.',
      b2: 'La transmisión del riesgo es otra función central del Incoterm.',
      b3: 'Cada Incoterm indica quién despacha la exportación.',
      b4: 'Los Incoterms no regulan la transferencia de la propiedad de la mercancía.',
      b5: 'La forma de pago se pacta aparte (por ejemplo, con un crédito documentario).',
      b6: 'La ley aplicable y la solución de controversias se pactan en cláusulas propias; no las decide el Incoterm.'
    },
    resumen: 'Los Incoterms no determinan la propiedad de las mercancías, la forma de pago, la ley aplicable ni cómo se resuelven las controversias.'
  },
  {
    id: 'n2c3', nivel: 2, orden: 3, tipo: 'clasificar', puntos: 250,
    titulo: 'Participantes del crédito',
    corto: 'Asigna cada función a su participante.',
    instruccion: 'En un crédito documentario intervienen varios participantes. Asigna cada función a quien la cumple.',
    categorias: [{ id: 'ord', texto: 'Ordenante (comprador)' }, { id: 'ben', texto: 'Beneficiario (vendedor)' }, { id: 'emi', texto: 'Banco emisor' }, { id: 'avi', texto: 'Banco avisador' }],
    items: [
      { id: 'c1', texto: 'Pide a su banco que abra el crédito documentario.' },
      { id: 'c2', texto: 'Cobra si presenta documentos que cumplen las condiciones del crédito.' },
      { id: 'c3', texto: 'Abre el crédito y se obliga a pagar si los documentos son conformes.' },
      { id: 'c4', texto: 'Notifica el crédito al vendedor sin obligarse, por ese solo hecho, a pagar.' }
    ],
    consecuencia: 'Confundirías quién se obliga a pagar y a quién debes presentar los documentos.',
    solucion: { c1: { ord: 1 }, c2: { ben: 1 }, c3: { emi: 1 }, c4: { avi: 1 } },
    feedback: {
      c1: 'El ordenante es el comprador: solicita la apertura del crédito a su banco.',
      c2: 'El beneficiario es el vendedor: cobra si presenta documentos conformes.',
      c3: 'El banco emisor abre el crédito y asume la obligación de pagar contra documentos conformes.',
      c4: 'El banco avisador notifica el crédito al beneficiario; si además lo confirmara, asumiría su propia obligación de pago.'
    },
    resumen: 'El comprador es el ordenante, el banco emisor se obliga a pagar contra documentos conformes y el vendedor es el beneficiario; el avisador solo notifica.'
  },
  {
    id: 'n2c4', nivel: 2, orden: 4, tipo: 'clasificar', puntos: 250,
    titulo: 'Principios de las UCP 600',
    corto: '¿Correcto o incorrecto?',
    instruccion: 'Marca si cada afirmación sobre las UCP 600 y el crédito documentario es correcta o incorrecta.',
    categorias: [{ id: 'ok', texto: 'Correcto' }, { id: 'no', texto: 'Incorrecto' }],
    items: [
      { id: 'd1', texto: 'El banco examina los documentos, no las mercancías.' },
      { id: 'd2', texto: 'El crédito es independiente del contrato de compraventa.' },
      { id: 'd3', texto: 'Las UCP 600 se aplican cuando el crédito las incorpora expresamente.' },
      { id: 'd4', texto: 'El banco comprueba la calidad del café antes de pagar.' },
      { id: 'd5', texto: 'Las UCP 600 se aplican automáticamente a cualquier pago internacional.' },
      { id: 'd6', texto: 'Si los documentos presentan discrepancias, el banco puede rechazarlos.' }
    ],
    consecuencia: 'Esperarías del banco un control que no hace, o creerías aplicables reglas que no se incorporaron.',
    solucion: { d1: { ok: 1 }, d2: { ok: 1 }, d3: { ok: 1 }, d4: { no: 1 }, d5: { no: 1 }, d6: { ok: 1 } },
    feedback: {
      d1: 'Los bancos tratan con documentos, no con mercancías.',
      d2: 'El crédito es una operación separada de la compraventa, aunque se base en ella.',
      d3: 'Las UCP 600 rigen el crédito cuando este las incorpora expresamente.',
      d4: 'El banco no verifica la calidad de la mercancía: solo examina los documentos.',
      d5: 'Las UCP 600 no son automáticas: dependen de que el crédito las incorpore.',
      d6: 'Una presentación con discrepancias puede ser rechazada por el banco.'
    },
    resumen: 'Las UCP 600 (reglas de la CCI) rigen el crédito documentario si se incorporan expresamente; los bancos examinan documentos y el crédito es independiente de la compraventa.'
  },
  {
    id: 'n2c5', nivel: 2, orden: 5, tipo: 'clasificar', puntos: 250,
    titulo: '¿Quién hace qué?',
    corto: 'Corte CCI o tribunal arbitral.',
    instruccion: 'En el arbitraje CCI, la Corte y el tribunal arbitral cumplen funciones distintas. Asigna cada función a quien corresponde.',
    categorias: [{ id: 'corte', texto: 'Corte Internacional de Arbitraje de la CCI' }, { id: 'trib', texto: 'Tribunal arbitral' }],
    items: [
      { id: 'e1', texto: 'Resuelve el fondo de la controversia.' },
      { id: 'e2', texto: 'Dicta el laudo.' },
      { id: 'e3', texto: 'Administra el procedimiento arbitral.' },
      { id: 'e4', texto: 'Nombra o confirma a los árbitros.' },
      { id: 'e5', texto: 'Examina el proyecto de laudo antes de que se firme.' }
    ],
    consecuencia: 'Atribuirías la decisión de la disputa a quien solo administra el proceso, o al revés.',
    solucion: { e1: { trib: 1 }, e2: { trib: 1 }, e3: { corte: 1 }, e4: { corte: 1 }, e5: { corte: 1 } },
    feedback: {
      e1: 'Quien decide la controversia es el tribunal arbitral, no la Corte.',
      e2: 'El laudo es la decisión final del tribunal arbitral y obliga a las partes.',
      e3: 'La Corte CCI cumple una función administrativa: organiza y supervisa el arbitraje.',
      e4: 'La Corte nombra o confirma a los árbitros según el reglamento.',
      e5: 'La Corte examina el proyecto de laudo, pero no decide la controversia.'
    },
    resumen: 'La Corte CCI administra el arbitraje; el tribunal arbitral, integrado por los árbitros, resuelve la controversia mediante el laudo.'
  },
  {
    id: 'n2c6', nivel: 2, orden: 6, tipo: 'clasificar', puntos: 250,
    titulo: 'Arbitraje, mediación o juez',
    corto: 'Distingue los tres caminos.',
    instruccion: 'Asigna cada característica al mecanismo al que pertenece.',
    categorias: [{ id: 'arb', texto: 'Arbitraje' }, { id: 'med', texto: 'Mediación' }, { id: 'jue', texto: 'Juez estatal' }],
    items: [
      { id: 'f1', texto: 'Un tercero decide y su decisión (laudo) obliga a las partes.' },
      { id: 'f2', texto: 'Exige que las partes hayan pactado un convenio arbitral.' },
      { id: 'f3', texto: 'Un tercero neutral ayuda a negociar, pero no impone una decisión.' },
      { id: 'f4', texto: 'Las partes conservan el control del resultado: nadie decide por ellas.' },
      { id: 'f5', texto: 'Un juez resuelve aplicando las normas procesales del Estado.' }
    ],
    consecuencia: 'Pactarías un mecanismo esperando un resultado que no puede darte (por ejemplo, una decisión obligatoria).',
    solucion: { f1: { arb: 1 }, f2: { arb: 1 }, f3: { med: 1 }, f4: { med: 1 }, f5: { jue: 1 } },
    feedback: {
      f1: 'El arbitraje termina con una decisión obligatoria: el laudo.',
      f2: 'El arbitraje nace de un convenio arbitral pactado por las partes.',
      f3: 'El mediador facilita el diálogo; no decide.',
      f4: 'En la mediación el acuerdo, si existe, lo construyen las partes.',
      f5: 'La jurisdicción estatal la ejerce un juez del Estado con sus propias reglas procesales.'
    },
    resumen: 'El arbitraje termina en un laudo obligatorio; la mediación busca un acuerdo y no decide; la jurisdicción estatal la ejerce un juez del Estado.'
  },

  // ═════════ NIVEL 3 · NEGOCIACIÓN INTERNACIONAL ═════════
  {
    id: 'n3c1', nivel: 3, orden: 1, tipo: 'negociar', puntos: 2500,
    titulo: 'Contrato de compraventa',
    corto: 'Negocia, cierra cada punto y firma.',
    instruccion: 'Negocia con Herr Keller las condiciones de entrega, pago y solución de controversias. Si rechaza tu propuesta, ajústala; si la acepta, ciérrala. Al final revisas y firmas el contrato.',
    intro: 'Tu empresa colombiana vende café a un comprador alemán. Debes acordar la entrega, el pago y cómo se resolverán las controversias.',
    contraparte: KELLER, jugador: YO,
    rondas: [
      {
        clave: 'entrega', tema: 'Entrega',
        dice: '«Yo me encargo del transporte marítimo. ¿Cómo y dónde me entrega la mercancía?»',
        interes: 'Quieres cumplir tu parte hasta entregar al transportista del comprador y despachar la exportación. Nada más.',
        opciones: [
          { id: 'exw', texto: 'EXW: la recoge en nuestra bodega de Bogotá', reaccion: { tipo: 'rechaza', texto: '«No puedo despachar la exportación desde Alemania. Eso no me sirve.»', confianza: -10 } },
          { id: 'fca', texto: 'FCA terminal de Cartagena: entrego a su transportista, con la exportación despachada', reaccion: { tipo: 'acepta', texto: '«Perfecto: usted despacha la exportación y yo recibo en el puerto.»', confianza: 15 } },
          { id: 'dap', texto: 'DAP Hamburgo: se la entrego en su bodega', reaccion: { tipo: 'acepta', texto: '«Excelente: usted asume todo el viaje.»', confianza: 20 } }
        ]
      },
      {
        clave: 'pago', tema: 'Pago',
        dice: '«Quiero pagar con un crédito documentario. ¿Con qué reglas?»',
        interes: 'Quieres que el crédito diga expresamente qué reglas lo rigen, para saber cómo se examinarán tus documentos.',
        opciones: [
          { id: 'ucp', texto: 'Crédito documentario sujeto a las UCP 600', reaccion: { tipo: 'acepta', texto: '«De acuerdo: reglas de la CCI que los bancos conocen.»', confianza: 15 } },
          { id: 'sinreg', texto: 'Crédito documentario sin mencionar reglas', reaccion: { tipo: 'acepta', texto: '«Mejor, menos texto.»', confianza: 10 } },
          { id: 'trans', texto: 'Transferencia 60 días después de la entrega', reaccion: { tipo: 'acepta', texto: '«¡Me conviene! Pago cuando reciba.»', confianza: 20 } }
        ]
      },
      {
        clave: 'controversias', tema: 'Controversias',
        dice: '«Y si algo sale mal, ¿cómo lo resolvemos?»',
        interes: 'Quieres un mecanismo pactado de antemano cuya decisión sea obligatoria.',
        opciones: [
          { id: 'arb', texto: 'Arbitraje CCI: un tribunal arbitral decide', reaccion: { tipo: 'acepta', texto: '«Aceptable: árbitros imparciales y reglas conocidas.»', confianza: 10 } },
          { id: 'med', texto: 'Solo mediación: un tercero ayuda, sin decidir', reaccion: { tipo: 'acepta', texto: '«Me parece bien, podemos hablar.»', confianza: 10 } },
          { id: 'nada', texto: 'No pactar nada', reaccion: { tipo: 'acepta', texto: '«Mejor no complicarlo.»', confianza: 15 } }
        ]
      }
    ],
    consecuencia: 'El contrato quedaría con una cláusula que no cumple tu objetivo o con vacíos que solo se notarán cuando haya un problema.',
    solucion: {
      entrega: { fca: 1, dap: 0.3 },
      pago: { ucp: 1, sinreg: 0.3 },
      controversias: { arb: 1, med: 0.3 }
    },
    feedback: {
      entrega: {
        exw: 'El comprador lo rechazó: EXW le obligaba a despachar la exportación desde Colombia.',
        fca: 'FCA encaja: el vendedor entrega al transportista designado y despacha la exportación; el riesgo pasa al comprador en ese punto. El Incoterm solo regula entrega, costos y riesgos.',
        dap: 'DAP es válido, pero tu empresa asumiría transporte y riesgo hasta Hamburgo: mucho más de lo que querías.'
      },
      pago: {
        ucp: 'Las UCP 600 rigen el crédito cuando lo incorpora expresamente. El banco emisor se obliga a pagar contra documentos conformes; examina documentos, no mercancías.',
        sinreg: 'Si el crédito no incorpora las UCP 600, no puedes dar por hecho que se apliquen: queda incierto cómo se examinarán tus documentos.',
        trans: 'No es un crédito documentario: entregarías primero y cobrarías después, sin la obligación de pago de un banco.'
      },
      controversias: {
        arb: 'En el arbitraje CCI la Corte administra el proceso y el tribunal arbitral resuelve con un laudo obligatorio.',
        med: 'La mediación ayuda a negociar, pero nadie impone una decisión: si no hay acuerdo, quedarías sin una solución obligatoria.',
        nada: 'Sin cláusula, la ley aplicable y el juez competente se determinarían después con normas de Derecho Internacional Privado: incertidumbre y costos.'
      }
    },
    resumen: 'Cada cláusula cumple una función: el Incoterm reparte entrega, costos y riesgos; el crédito documentario (UCP 600) asegura el pago contra documentos; el arbitraje CCI resuelve controversias.'
  },

  // ═════════ NIVEL 4 · MISIÓN COMERCIAL INTERNACIONAL ═════════
  {
    id: 'n4c1', nivel: 4, orden: 1, tipo: 'clasificar', puntos: 600,
    titulo: 'Etapa 1 · La entrega',
    corto: 'DAP Hamburgo: ¿quién responde de cada tarea?',
    instruccion: 'Misión: exportas café a Hamburgo con DAP, crédito documentario (UCP 600) y arbitraje CCI. Asigna cada tarea a quien corresponde con DAP.',
    categorias: [{ id: 'v', texto: 'Vendedor' }, { id: 'c', texto: 'Comprador' }],
    items: [
      { id: 'g1', texto: 'Contratar y pagar el transporte hasta el lugar de destino' },
      { id: 'g2', texto: 'Despachar la exportación en Colombia' },
      { id: 'g3', texto: 'Soportar el riesgo mientras la mercancía viaja' },
      { id: 'g4', texto: 'Despachar la importación en Alemania' },
      { id: 'g5', texto: 'Descargar la mercancía en el lugar de destino' }
    ],
    consecuencia: 'Alguna tarea quedaría sin responsable claro o en manos de la parte equivocada, y su costo aparecería donde nadie lo esperaba.',
    solucion: { g1: { v: 1 }, g2: { v: 1 }, g3: { v: 1 }, g4: { c: 1 }, g5: { c: 1 } },
    feedback: {
      g1: 'En DAP el vendedor organiza y paga el transporte hasta el destino convenido.',
      g2: 'El despacho de exportación corresponde al vendedor.',
      g3: 'El riesgo es del vendedor hasta que la mercancía queda a disposición en el destino, lista para descargar.',
      g4: 'En DAP la importación y los derechos corresponden al comprador.',
      g5: 'DAP entrega «lista para descargar»: la descarga ya es del comprador.'
    },
    resumen: 'Con DAP la frontera de responsabilidad llega al lugar de destino: antes, vendedor; descarga e importación, comprador.'
  },
  {
    id: 'n4c2', nivel: 4, orden: 2, tipo: 'clasificar', puntos: 600,
    titulo: 'Etapa 2 · Pago y documentos',
    corto: 'Presentas documentos al banco emisor.',
    instruccion: 'Presentas documentos al banco emisor del crédito (UCP 600). Indica en cuáles casos el banco puede pagar y en cuáles puede rechazar.',
    categorias: [{ id: 'pag', texto: 'El banco puede pagar' }, { id: 'rec', texto: 'El banco puede rechazar' }],
    items: [
      { id: 's1', texto: 'Factura comercial conforme a lo que exige el crédito.' },
      { id: 's2', texto: 'Documento de transporte con fecha posterior al plazo de embarque del crédito.' },
      { id: 's3', texto: 'Documentos conformes, pero el comprador alega que el café tiene defectos.' },
      { id: 's4', texto: 'Factura que describe una mercancía distinta a la del crédito.' },
      { id: 's5', texto: 'Documentos conformes presentados dentro del plazo.' }
    ],
    consecuencia: 'No cobrarías a tiempo por presentar documentos con discrepancias, o creerías que el banco puede frenar un pago por problemas de la mercancía.',
    solucion: { s1: { pag: 1 }, s2: { rec: 1 }, s3: { pag: 1 }, s4: { rec: 1 }, s5: { pag: 1 } },
    feedback: {
      s1: 'Con documentos conformes a las condiciones del crédito, el banco debe honrar el crédito.',
      s2: 'Un documento de transporte fuera del plazo de embarque es una discrepancia: el banco puede rechazar la presentación.',
      s3: 'Los bancos examinan documentos, no mercancías, y el crédito es independiente de la compraventa: el reclamo por calidad se discute aparte.',
      s4: 'Si los documentos no concuerdan con lo exigido por el crédito hay discrepancia, y el banco puede rechazarlos.',
      s5: 'Documentos conformes y a tiempo: el banco debe pagar.'
    },
    resumen: 'Con UCP 600 el banco decide por los documentos: conformes, paga; con discrepancias, puede rechazar. La calidad de la mercancía se discute fuera del crédito.'
  },
  {
    id: 'n4c3', nivel: 4, orden: 3, tipo: 'clasificar', puntos: 600,
    titulo: 'Etapa 3 · La controversia',
    corto: 'Elige el mecanismo adecuado.',
    instruccion: 'Surge una controversia por la calidad del café. Asigna cada situación al mecanismo adecuado.',
    categorias: [{ id: 'arb', texto: 'Arbitraje CCI' }, { id: 'med', texto: 'Mediación' }, { id: 'jue', texto: 'Juez estatal' }],
    items: [
      { id: 'h1', texto: 'El contrato tiene cláusula de arbitraje CCI y el comprador reclama por la calidad del café.' },
      { id: 'h2', texto: 'Las partes quieren intentar un acuerdo con ayuda de un tercero neutral que no decide.' },
      { id: 'h3', texto: 'No hay convenio arbitral y el comprador demanda ante un tribunal estatal.' },
      { id: 'h4', texto: 'Un tercero elegido por las partes decide con un laudo obligatorio.' }
    ],
    consecuencia: 'Acudirías a un mecanismo que no corresponde y la disputa se demoraría o no tendría una decisión obligatoria.',
    solucion: { h1: { arb: 1 }, h2: { med: 1 }, h3: { jue: 1 }, h4: { arb: 1 } },
    feedback: {
      h1: 'Con convenio arbitral, la controversia va a arbitraje: la Corte CCI administra y el tribunal arbitral decide.',
      h2: 'La mediación busca un acuerdo con un tercero neutral que no impone decisión.',
      h3: 'Sin convenio arbitral, la vía es la jurisdicción estatal.',
      h4: 'La decisión obligatoria de árbitros elegidos por las partes es el laudo arbitral.'
    },
    resumen: 'Arbitraje (laudo obligatorio, si hay convenio), mediación (acuerdo, sin decisión impuesta) y juez estatal son mecanismos distintos.'
  },
  {
    id: 'n4c4', nivel: 4, orden: 4, tipo: 'clasificar', puntos: 600,
    titulo: 'Etapa 4 · Cierre: ¿qué decisión es?',
    corto: 'Sentencia, laudo o acuerdo.',
    instruccion: 'Para cerrar la operación, identifica la naturaleza de cada resultado. No son lo mismo.',
    categorias: [{ id: 'sen', texto: 'Sentencia extranjera' }, { id: 'lau', texto: 'Laudo arbitral' }, { id: 'acu', texto: 'Acuerdo de mediación' }],
    items: [
      { id: 'i1', texto: 'Resolución dictada por un juez estatal de Alemania.' },
      { id: 'i2', texto: 'Decisión dictada por un tribunal arbitral CCI.' },
      { id: 'i3', texto: 'Acuerdo logrado con ayuda de un mediador, sin decisión impuesta.' },
      { id: 'i4', texto: 'Decisión de árbitros elegidos por las partes mediante convenio arbitral.' }
    ],
    consecuencia: 'Aplicarías a la decisión el régimen que no le corresponde y tu estrategia para hacerla efectiva sería equivocada.',
    solucion: { i1: { sen: 1 }, i2: { lau: 1 }, i3: { acu: 1 }, i4: { lau: 1 } },
    feedback: {
      i1: 'Una sentencia extranjera es la decisión de un juez estatal de otro país; para ejecutarse en Colombia debe ser reconocida mediante exequátur.',
      i2: 'El laudo es la decisión de árbitros, no de un juez estatal: no es una sentencia y se rige por el régimen del arbitraje.',
      i3: 'La mediación no impone decisión: si hay acuerdo, es un pacto entre las partes; no es sentencia ni laudo.',
      i4: 'Los árbitros elegidos por las partes dictan un laudo, no una sentencia.'
    },
    resumen: 'Sentencia (juez estatal), laudo (árbitros) y acuerdo de mediación (partes) son resultados distintos con régimen distinto: no se confunden.'
  },
  {
    id: 'n4c5', nivel: 4, orden: 5, tipo: 'clasificar', puntos: 600,
    titulo: 'Etapa 4 · Reconocer una sentencia',
    corto: 'Exequátur de una sentencia extranjera.',
    instruccion: 'Un tribunal de Hamburgo condenó al vendedor colombiano en otro caso y el comprador quiere ejecutar esa sentencia en Colombia. Arma el camino del reconocimiento (exequátur).',
    categorias: [{ id: 'si', texto: 'Hace parte del camino' }, { id: 'no', texto: 'No corresponde' }],
    items: [
      { id: 'j1', texto: 'Copia de la sentencia debidamente legalizada' },
      { id: 'j2', texto: 'Prueba de que la sentencia está ejecutoriada' },
      { id: 'j3', texto: 'Solicitud de exequátur ante la Corte Suprema de Justicia, por medio de abogado' },
      { id: 'j4', texto: 'Pedir a la Corte CCI que reconozca la sentencia' },
      { id: 'j5', texto: 'Ejecutarla en Colombia sin reconocimiento previo' },
      { id: 'j6', texto: 'Presentarla ante la aduana colombiana' }
    ],
    consecuencia: 'La sentencia no podría ejecutarse en Colombia: sin reconocimiento no produce efectos ejecutables contra bienes allí.',
    solucion: { j1: { si: 1 }, j2: { si: 1 }, j3: { si: 1 }, j4: { no: 1 }, j5: { no: 1 }, j6: { no: 1 } },
    feedback: {
      j1: 'La sentencia extranjera se presenta en copia debidamente legalizada.',
      j2: 'Debe estar ejecutoriada (firme) según la ley del país donde se dictó.',
      j3: 'El exequátur se solicita ante la Corte Suprema de Justicia, por medio de abogado.',
      j4: 'La Corte CCI administra arbitrajes; no reconoce sentencias de jueces estatales. Son vías distintas.',
      j5: 'Una sentencia extranjera no se ejecuta por sí sola: primero debe ser reconocida.',
      j6: 'La aduana controla mercancías; el reconocimiento de sentencias es un trámite judicial, no logístico.'
    },
    resumen: 'El exequátur es un procedimiento judicial en Colombia, distinto del arbitraje y de la aduana: la autoridad verifica requisitos legales antes de permitir la ejecución.'
  }
];
