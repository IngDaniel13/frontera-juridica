export default {
  id: 2,
  nombre: 'Instrumentos de la CCI',
  corto: 'Instrumentos CCI',
  ejes: ['Incoterms 2020', 'UCP 600 y crédito documentario', 'Arbitraje CCI'],
  objetivo: 'Comprende los instrumentos de la CCI y cómo se relacionan con las operaciones comerciales internacionales.',
  intro: 'Recorre tres estaciones del mapa: Incoterms 2020, UCP 600 y arbitraje CCI. En cada una descubres los conceptos y los pones a prueba asociando y clasificando.',
  inicio: { x: 240, y: 605 },
  puntos: [],
  estaciones: [
    {
      id: 'incoterms', nombre: 'Incoterms 2020', icono: '🚢', resumen: 'Entrega, costos y riesgos',
      descubre: [
        { titulo: 'Qué son', texto: 'Reglas de la CCI, versión 2020, con 11 términos comerciales. Las partes los incorporan a su contrato de compraventa.' },
        { titulo: 'Qué reparten', texto: 'Quién realiza la entrega, quién paga el transporte y los trámites, y en qué momento pasa el riesgo de pérdida o daño.' },
        { titulo: 'Qué no regulan', texto: 'No regulan la propiedad de las mercancías, la forma de pago, la ley aplicable ni cómo se resuelven las controversias.' }
      ],
      retos: ['n2c1', 'n2c2']
    },
    {
      id: 'ucp', nombre: 'UCP 600', icono: '🏦', resumen: 'Crédito documentario',
      descubre: [
        { titulo: 'Crédito documentario', texto: 'Un banco (el emisor) se obliga a pagar al vendedor si presenta los documentos exigidos y conformes. Asegura el pago contra documentos.' },
        { titulo: 'Reglas y participantes', texto: 'Las UCP 600 son reglas de la CCI que rigen el crédito cuando este las incorpora expresamente. Intervienen ordenante, banco emisor, beneficiario y a veces un banco avisador.' },
        { titulo: 'Documentos, no mercancías', texto: 'El crédito es independiente de la compraventa y los bancos examinan documentos, no mercancías. Si hay discrepancias, pueden rechazar.' }
      ],
      retos: ['n2c3', 'n2c4']
    },
    {
      id: 'arbitraje', nombre: 'Arbitraje CCI', icono: '⚖️', resumen: 'Corte, tribunal y laudo',
      descubre: [
        { titulo: 'Dos funciones distintas', texto: 'La Corte Internacional de Arbitraje de la CCI administra el proceso; el tribunal arbitral es quien resuelve la controversia.' },
        { titulo: 'El laudo', texto: 'Es la decisión final del tribunal arbitral y obliga a las partes. Exige que antes hayan pactado un convenio arbitral.' },
        { titulo: 'Arbitraje y mediación', texto: 'En el arbitraje un tercero decide con un laudo obligatorio; en la mediación un tercero ayuda a las partes, pero no decide.' }
      ],
      retos: ['n2c5', 'n2c6']
    }
  ]
};
