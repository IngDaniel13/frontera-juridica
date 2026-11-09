export default {
  id: 1,
  nombre: 'La Cámara y sus herramientas',
  corto: 'La Cámara',
  fondo: 'camara',
  ejes: ['Cámara de Comercio Internacional (CCI)', 'Incoterms', 'Arbitraje', 'Representación empresarial', 'Promoción', 'Capacitación'],
  objetivo: 'Descubre cómo funcionan la CCI y sus herramientas, y clasifícalas aplicándolas a casos reales.',
  intro: 'Recorre la sede de la Cámara de Comercio Internacional. Habla con la guía, visita cada sala y guarda lo que descubras en tu carpeta: cuando la completes se abrirá la Mesa de clasificación.',
  inicio: { x: 240, y: 600 },
  fichas: {
    f1: { titulo: 'La CCI: una organización empresarial mundial', texto: 'La guía te explica: la Cámara de Comercio Internacional es una organización privada que representa a las empresas del mundo. Elabora reglas y ofrece servicios; no es un tribunal estatal ni una aduana.' },
    f2: { titulo: 'Incoterms: las reglas de la entrega', texto: 'En la biblioteca encuentras los Incoterms: reglas de la CCI que reparten entre vendedor y comprador las tareas, los costos y los riesgos de la entrega. No dicen qué ley se aplica ni qué juez decide.' },
    f3: { titulo: 'Arbitraje: jueces elegidos por las partes', texto: 'En esta sala se administran arbitrajes. Si las partes pactan un convenio arbitral, árbitros privados resuelven la disputa con un laudo obligatorio, en lugar de un juez estatal.' },
    f4: { titulo: 'Representación empresarial', texto: 'Desde este podio la CCI lleva la voz del sector privado ante gobiernos y organismos internacionales, a través de su red de comités nacionales.' },
    f5: { titulo: 'Promoción del comercio', texto: 'La promoción acerca empresas de distintos países y estimula el comercio y la inversión: contactos, encuentros y oportunidades para darse a conocer.' },
    f6: { titulo: 'Capacitación', texto: 'En el aula se forma a las empresas: cursos, seminarios y publicaciones para aplicar bien las reglas y prácticas del comercio internacional.' }
  },
  puntos: [
    { x: 120, y: 530, etiqueta: 'Guía de la Cámara', tipo: 'ficha', ficha: 'f1', sprite: 'guia' },
    { x: 360, y: 450, etiqueta: 'Biblioteca de Incoterms', tipo: 'ficha', ficha: 'f2' },
    { x: 120, y: 370, etiqueta: 'Sala de arbitraje', tipo: 'ficha', ficha: 'f3' },
    { x: 360, y: 290, etiqueta: 'Podio de representación', tipo: 'ficha', ficha: 'f4' },
    { x: 120, y: 210, etiqueta: 'Sala de promoción', tipo: 'ficha', ficha: 'f5' },
    { x: 360, y: 150, etiqueta: 'Aula de capacitación', tipo: 'ficha', ficha: 'f6' },
    { x: 240, y: 330, etiqueta: 'Mesa de clasificación', tipo: 'reto', reto: 'n1c1' },
    { x: 240, y: 200, etiqueta: 'Baúl del exportador', tipo: 'reto', reto: 'n1c2' }
  ]
};
