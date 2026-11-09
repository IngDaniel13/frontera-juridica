// FUENTE ÚNICA de las preguntas. Después de editarla ejecuta: npm run generar-datos
// Genera: src/data/questions.js, src/data/respuestasLocales.js y supabase/seed_preguntas.sql
// "correcta" es el índice (empezando en 0) de la opción correcta.

export const BANCO = [
  // ───────────── NIVEL 1. LA CÁMARA Y SUS HERRAMIENTAS (20 s) ─────────────
  {
    nivel: 1, orden: 1, tiempo: 20,
    enunciado: 'Una pyme de Medellín quiere exportar a Alemania y busca una organización empresarial mundial que elabore reglas y ofrezca servicios para el comercio internacional. ¿Qué es la Cámara de Comercio Internacional (CCI)?',
    opciones: [
      'Un tribunal de la ONU que dicta sentencias obligatorias a los Estados',
      'Una organización empresarial mundial que elabora reglas y presta servicios como el arbitraje y la capacitación',
      'La aduana que cobra aranceles en los puertos europeos',
      'Un ministerio del gobierno alemán'
    ],
    correcta: 1,
    explicacion: 'La CCI es una organización privada de alcance mundial que representa a las empresas. Elabora reglas (como los Incoterms) y ofrece servicios (arbitraje, capacitación). No es un tribunal estatal ni una autoridad aduanera.'
  },
  {
    nivel: 1, orden: 2, tiempo: 20,
    enunciado: 'El comprador alemán propone que el contrato use el término «FCA». ¿Cuál es la finalidad de los Incoterms?',
    opciones: [
      'Definir qué ley rige el contrato',
      'Designar el juez que resolverá las controversias',
      'Repartir entre vendedor y comprador las tareas, los costos y los riesgos de la entrega de la mercancía',
      'Transferir la propiedad de la mercancía'
    ],
    correcta: 2,
    explicacion: 'Los Incoterms son reglas de la CCI sobre la entrega: quién hace qué, quién paga qué y cuándo pasa el riesgo. No fijan la ley aplicable, no designan juez ni deciden cuándo se transfiere la propiedad.'
  },
  {
    nivel: 1, orden: 3, tiempo: 20,
    enunciado: 'Una empresa colombiana y otra alemana pactan que sus futuras controversias las resolverán árbitros y no jueces estatales. ¿Qué es el arbitraje?',
    opciones: [
      'Un proceso ante los jueces del país del vendedor',
      'Una recomendación no obligatoria que las partes pueden ignorar',
      'Un mecanismo por el cual las partes, mediante un convenio arbitral, someten su controversia a árbitros que deciden con un laudo obligatorio',
      'Un trámite aduanero para liberar la mercancía'
    ],
    correcta: 2,
    explicacion: 'El arbitraje nace de la voluntad de las partes (convenio arbitral). Los árbitros, y no los jueces estatales, deciden mediante un laudo obligatorio. La CCI administra procesos arbitrales, pero no resuelve por sí misma el fondo de la disputa.'
  },
  {
    nivel: 1, orden: 4, tiempo: 20,
    enunciado: 'Una asociación de exportadores quiere que sus opiniones sobre las reglas del comercio internacional lleguen a gobiernos y organismos internacionales. ¿Qué función de la CCI responde a esa necesidad?',
    opciones: [
      'La representación empresarial: llevar la voz del sector privado ante gobiernos y organismos internacionales',
      'La emisión de sentencias contra los Estados',
      'La fijación de los precios de las mercancías',
      'El cobro de impuestos de importación'
    ],
    correcta: 0,
    explicacion: 'A través de su red mundial de comités nacionales, la CCI representa los intereses empresariales y presenta las posiciones del sector ante gobiernos y organizaciones internacionales.'
  },
  {
    nivel: 1, orden: 5, tiempo: 20,
    enunciado: 'Una empresa colombiana quiere acercarse a posibles socios alemanes mediante encuentros empresariales y actividades que fomenten el comercio entre ambos países. ¿Con qué función de la CCI se relaciona?',
    opciones: [
      'Arbitraje: resolver una disputa con un comprador',
      'Promoción: acercar empresas de distintos países y fomentar el comercio y la inversión',
      'Incoterms: definir la ley aplicable al contrato',
      'Representación judicial de la empresa ante tribunales alemanes'
    ],
    correcta: 1,
    explicacion: 'La promoción busca acercar empresas y estimular el comercio y la inversión entre países. No resuelve controversias (arbitraje) ni reparte costos y riesgos de la entrega (Incoterms).'
  },
  {
    nivel: 1, orden: 6, tiempo: 20,
    enunciado: 'Un equipo de exportadores quiere aprender a usar correctamente los Incoterms en sus contratos. ¿Qué servicio de la CCI le resulta más útil?',
    opciones: [
      'Arbitraje',
      'Representación ante gobiernos',
      'Capacitación: cursos, seminarios y publicaciones sobre reglas y prácticas del comercio internacional',
      'Fijación de aranceles'
    ],
    correcta: 2,
    explicacion: 'La capacitación forma a las empresas para aplicar bien las reglas. Aprender a usarlas no es lo mismo que resolver una disputa (arbitraje) ni llevar posiciones a los gobiernos (representación).'
  },

  // ───────────── NIVEL 2. LA RUTA DE LOS INCOTERMS (25 s) ─────────────
  {
    nivel: 2, orden: 1, tiempo: 25,
    enunciado: 'Un exportador colombiano con planta en Bogotá quiere asumir la menor carga posible: el comprador alemán organizará y pagará todo el transporte y asumirá el riesgo desde que la mercancía quede a su disposición en la planta, incluida la gestión de la exportación. ¿Qué Incoterm refleja esa decisión?',
    opciones: [
      'EXW (En fábrica)',
      'DAP (Entregada en lugar de destino)',
      'DDP (Entregada con derechos pagados)',
      'CIF (Costo, seguro y flete)'
    ],
    correcta: 0,
    explicacion: 'En EXW el vendedor pone la mercancía a disposición en su establecimiento y el comprador asume costos y riesgos desde allí, incluido el transporte y los trámites de exportación. DAP y DDP cargan más responsabilidades al vendedor; en CIF el vendedor contrata flete y seguro.'
  },
  {
    nivel: 2, orden: 2, tiempo: 25,
    enunciado: 'Contrato «FOB Cartagena». El contenedor espera en el muelle de Cartagena. ¿En qué momento el riesgo de pérdida o daño pasa del vendedor colombiano al comprador alemán?',
    opciones: [
      'Cuando el contenedor llega al puerto de Hamburgo',
      'Cuando la mercancía queda colocada a bordo del buque en Cartagena',
      'Cuando se firma el contrato',
      'Cuando el comprador recibe la factura'
    ],
    correcta: 1,
    explicacion: 'Con FOB el vendedor entrega cuando la mercancía está a bordo del buque designado por el comprador en el puerto de embarque. Desde ese momento el riesgo corre por cuenta del comprador. FOB se usa solo para transporte marítimo y fluvial.'
  },
  {
    nivel: 2, orden: 3, tiempo: 25,
    enunciado: 'Contrato «CIF Hamburgo». El vendedor pagó el flete marítimo y contrató el seguro hasta Hamburgo. En pleno Atlántico, un temporal hunde el buque con la carga. ¿Quién soporta el riesgo de pérdida?',
    opciones: [
      'El vendedor, porque pagó el flete y el seguro hasta Hamburgo',
      'El comprador: en CIF el riesgo pasa al cargarse a bordo, y el seguro contratado por el vendedor sirve para cubrir la pérdida',
      'El transportista, siempre y sin excepción',
      'Nadie: el contrato queda sin efecto'
    ],
    correcta: 1,
    explicacion: 'CIF tiene dos puntos distintos: el vendedor asume los costos (flete y seguro) hasta el destino, pero el riesgo se transmite al comprador cuando la mercancía está a bordo en el puerto de embarque. El seguro contratado por el vendedor protege al comprador.'
  },
  {
    nivel: 2, orden: 4, tiempo: 25,
    enunciado: 'Contrato «DAP Hamburgo». La carga llega al lugar convenido en Alemania, lista para ser descargada. ¿Quién debe encargarse del despacho de importación en Alemania?',
    opciones: [
      'El vendedor colombiano',
      'El comprador alemán',
      'La Cámara de Comercio Internacional',
      'El transportista marítimo'
    ],
    correcta: 1,
    explicacion: 'En DAP el vendedor entrega en el lugar de destino convenido, listo para descargar, y asume el riesgo hasta ese punto; los trámites y derechos de importación corresponden al comprador. Si el vendedor debiera encargarse de la importación, el término sería DDP.'
  },
  {
    nivel: 2, orden: 5, tiempo: 25,
    enunciado: 'Las partes pactaron «FOB Cartagena». Meses después surge una disputa sobre la calidad de la mercancía y discuten qué ley rige el contrato y quién debe resolverla. ¿Qué indica el FOB sobre eso?',
    opciones: [
      'Que se aplica la ley colombiana',
      'Que los tribunales de Colombia son competentes',
      'Que la disputa debe resolverse en arbitraje',
      'Nada: el Incoterm reparte entrega, costos y riesgos; la ley aplicable y la solución de controversias deben pactarse aparte'
    ],
    correcta: 3,
    explicacion: 'Los Incoterms no determinan la ley aplicable, la competencia judicial, el arbitraje ni el reconocimiento de sentencias extranjeras. Esos asuntos se regulan en cláusulas distintas y con las normas de Derecho Internacional Privado.'
  },

  // ───────────── NIVEL 3. LA MESA DE NEGOCIACIÓN (25 s) ─────────────
  {
    nivel: 3, orden: 1, tiempo: 25,
    enunciado: 'El comprador alemán pide una cotización «CIF Hamburgo» y otra «FOB Cartagena» para la misma mercancía. ¿Qué diferencia debe esperar en el precio?',
    opciones: [
      'El precio CIF suele ser mayor, porque incluye flete y seguro hasta el destino, que en FOB asume el comprador',
      'El precio FOB es mayor, porque incluye el transporte hasta Hamburgo',
      'Son idénticos: el Incoterm no incide en el precio',
      'El precio CIF es menor, porque el comprador asume el flete'
    ],
    correcta: 0,
    explicacion: 'El Incoterm influye en el precio porque cambia qué costos asume cada parte. Con CIF el vendedor incluye flete y seguro hasta el puerto de destino; con FOB esos costos corren por cuenta del comprador.'
  },
  {
    nivel: 3, orden: 2, tiempo: 25,
    enunciado: 'La entrega pactada es el 30 de marzo. El comprador alemán quiere que, si hay retraso, el vendedor pague una suma fija por semana (con un tope). ¿Qué función cumple esa compensación pactada?',
    opciones: [
      'Determina la ley aplicable al contrato',
      'Fija desde ya la consecuencia económica del retraso, lo que reduce la discusión posterior sobre su monto',
      'Reemplaza la cláusula de arbitraje',
      'Cambia el Incoterm de FOB a CIF'
    ],
    correcta: 1,
    explicacion: 'Pactar una compensación (por ejemplo, una cláusula penal por retraso) establece de antemano cuánto se paga si la entrega es tardía. Es una condición de la negociación; no determina la ley aplicable ni el foro. Su validez y alcance dependen de la ley que rija el contrato.'
  },
  {
    nivel: 3, orden: 3, tiempo: 25,
    enunciado: 'Una cláusula dice: «Este contrato se rige por la ley alemana». ¿Qué establece esa cláusula?',
    opciones: [
      'Qué tribunal o árbitros resolverán las disputas',
      'Qué derecho se usará para interpretar el contrato y determinar los derechos y obligaciones de las partes',
      'Quién paga el flete',
      'Dónde debe entregarse la mercancía'
    ],
    correcta: 1,
    explicacion: 'La ley aplicable señala el ordenamiento jurídico que rige el fondo del contrato. No dice quién resuelve la disputa: eso corresponde a la solución de controversias.'
  },
  {
    nivel: 3, orden: 4, tiempo: 25,
    enunciado: 'Otra cláusula dice: «Toda controversia se resolverá mediante arbitraje de la CCI con sede en Bogotá». ¿Qué regula principalmente?',
    opciones: [
      'El mecanismo para resolver las controversias (arbitraje) y la sede del proceso',
      'La ley aplicable al fondo del contrato',
      'El precio de la mercancía',
      'El reparto de riesgos del transporte'
    ],
    correcta: 0,
    explicacion: 'Esta cláusula define cómo y dónde se resolverán los conflictos. Elegir arbitraje con sede en Bogotá no equivale automáticamente a elegir la ley colombiana: la ley aplicable debe pactarse por separado.'
  },
  {
    nivel: 3, orden: 5, tiempo: 25,
    enunciado: 'Las partes pactan «ley alemana» y «jueces de Bogotá». Un asesor afirma que es imposible que un juez colombiano aplique ley alemana. ¿Qué respuesta es correcta?',
    opciones: [
      'Tiene razón: el juez siempre aplica su propia ley',
      'Es una combinación posible: ley aplicable y foro son decisiones distintas, aunque con límites como el orden público',
      'Solo es posible si hay arbitraje',
      'Solo es posible si el Incoterm es DDP'
    ],
    correcta: 1,
    explicacion: 'La ley aplicable y la autoridad que decide son decisiones independientes. Un juez puede aplicar derecho extranjero cuando las normas de Derecho Internacional Privado lo permiten, salvo que contradiga el orden público u otras normas imperativas del foro.'
  },
  {
    nivel: 3, orden: 6, tiempo: 25,
    enunciado: 'El contrato Colombia–Alemania fija precio y entrega, pero no incluye cláusula de ley aplicable ni de solución de controversias. Surge una disputa. ¿Cuál es la consecuencia?',
    opciones: [
      'Se aplica automáticamente la ley del vendedor y el juez de su país',
      'Hay que determinar la ley aplicable y la autoridad competente con las reglas de Derecho Internacional Privado, lo que genera incertidumbre y costos',
      'El contrato es nulo',
      'La CCI decide la disputa de oficio'
    ],
    correcta: 1,
    explicacion: 'Sin esas cláusulas, la respuesta depende de las normas de Derecho Internacional Privado de la autoridad que conozca el caso, lo que puede ser difícil de prever. Por eso conviene pactarlas.'
  },

  // ───────────── NIVEL 4. MISIÓN DE EXPORTACIÓN (30 s) ─────────────
  {
    nivel: 4, orden: 1, tiempo: 30,
    enunciado: 'Misión: el comprador alemán exige que el vendedor colombiano entregue la mercancía en su bodega de Hamburgo, lista para descargar, y se encargue del transporte. El comprador hará el despacho de importación. ¿Qué Incoterm se ajusta a este acuerdo?',
    opciones: ['FOB Cartagena', 'EXW Bogotá', 'DAP Hamburgo', 'DDP Hamburgo'],
    correcta: 2,
    explicacion: 'DAP: el vendedor organiza el transporte y entrega en el destino convenido, listo para descargar; el comprador realiza la importación. En DDP el vendedor también asumiría el despacho y los derechos de importación.'
  },
  {
    nivel: 4, orden: 2, tiempo: 30,
    enunciado: 'Bajo DAP Hamburgo, el camión que lleva el contenedor del puerto a la bodega sufre un accidente en Alemania antes de llegar al lugar convenido y la carga se pierde. ¿Quién soporta el riesgo?',
    opciones: [
      'El comprador, porque la carga ya está en Alemania',
      'El vendedor, porque en DAP el riesgo pasa cuando la mercancía queda a disposición en el lugar de destino convenido',
      'Ninguno: es fuerza mayor automática',
      'El transportista, siempre'
    ],
    correcta: 1,
    explicacion: 'En DAP el vendedor asume los riesgos hasta poner la mercancía a disposición del comprador en el lugar de destino. El accidente ocurrió antes, así que la pérdida recae en el vendedor (sin perjuicio de seguros o reclamaciones que tenga contra el transportista).'
  },
  {
    nivel: 4, orden: 3, tiempo: 30,
    enunciado: 'Para cerrar la operación, el comprador pide factura comercial y prueba de la entrega. ¿Qué afirmación sobre la documentación es correcta?',
    opciones: [
      'Los Incoterms indican qué documentos debe aportar cada parte, como la factura comercial y la prueba de entrega',
      'Con un Incoterm ya no hacen falta documentos',
      'Los documentos de transporte determinan la ley aplicable',
      'Solo la aduana puede exigir documentos; el comprador no'
    ],
    correcta: 0,
    explicacion: 'Cada Incoterm señala obligaciones documentales (por ejemplo, factura comercial y prueba de entrega). Los documentos acreditan lo ocurrido y facilitan trámites, pero no fijan por sí solos la ley aplicable ni el foro.'
  },
  {
    nivel: 4, orden: 4, tiempo: 30,
    enunciado: 'Surge una discusión sobre un incumplimiento. Para saber qué ley rige el contrato y quién debe resolver la disputa, ¿qué debe revisarse primero?',
    opciones: [
      'El Incoterm pactado',
      'Las cláusulas de ley aplicable y de solución de controversias del contrato',
      'El itinerario del buque',
      'El tipo de contenedor utilizado'
    ],
    correcta: 1,
    explicacion: 'Las partes pueden elegir en el contrato la ley aplicable y el mecanismo de solución de controversias (autonomía de la voluntad). El Incoterm solo reparte entrega, costos y riesgos, y el transporte es un aspecto logístico.'
  },
  {
    nivel: 4, orden: 5, tiempo: 30,
    enunciado: 'Un tribunal alemán condena al exportador colombiano a pagar una suma. El comprador quiere ejecutar esa sentencia contra bienes del exportador en Colombia. ¿Qué paso jurídico es necesario?',
    opciones: [
      'Presentarla ante la aduana colombiana',
      'Nada: es ejecutable automáticamente porque Colombia y Alemania comercian entre sí',
      'Obtener el reconocimiento (exequátur) ante la autoridad colombiana competente, que verifica los requisitos legales',
      'Pedir a la CCI que la convierta en laudo'
    ],
    correcta: 2,
    explicacion: 'Una sentencia extranjera no se ejecuta por sí sola en otro país: debe ser reconocida por la autoridad competente (en Colombia, mediante exequátur ante la Corte Suprema de Justicia). No es un trámite logístico ni aduanero.'
  },
  {
    nivel: 4, orden: 6, tiempo: 30,
    enunciado: 'En el procedimiento de exequátur, ¿cuál de estos es un aspecto que la autoridad colombiana examina?',
    opciones: [
      'Que el contrato usara un Incoterm marítimo',
      'Que la mercancía hubiera llegado puntual',
      'Que la decisión no contradiga el orden público colombiano y cumpla los demás requisitos legales',
      'Que el comprador sea una empresa de gran tamaño'
    ],
    correcta: 2,
    explicacion: 'El reconocimiento se centra en requisitos jurídicos: por ejemplo, que la sentencia esté firme y debidamente legalizada, que no contradiga el orden público y que no invada materias de competencia exclusiva de jueces colombianos. Aspectos logísticos como el Incoterm o la puntualidad no se examinan.'
  }
];
