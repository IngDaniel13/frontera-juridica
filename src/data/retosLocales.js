// ARCHIVO GENERADO por scripts/generar-datos.mjs. No lo edites a mano: edita scripts/banco-retos.mjs
// Soluciones y retroalimentación. Se cargan SOLO en el modo individual (al terminar cada reto).
// En multijugador no se usan: la evaluación la hace Supabase.
export const SECRETOS = {
  "n1c1": {
    "solucion": {
      "i1": {
        "incoterms": 1
      },
      "i2": {
        "arbitraje": 1
      },
      "i3": {
        "representacion": 1
      },
      "i4": {
        "promocion": 1
      },
      "i5": {
        "capacitacion": 1
      }
    },
    "feedback": {
      "i1": "Los Incoterms reparten tareas, costos y riesgos de la entrega. No fijan la ley aplicable ni el juez competente.",
      "i2": "El arbitraje nace de un convenio de las partes: árbitros privados deciden con un laudo obligatorio. La CCI administra estos procesos.",
      "i3": "La representación empresarial lleva la voz del sector privado ante gobiernos y organismos internacionales.",
      "i4": "La promoción acerca empresas de distintos países y fomenta el comercio y la inversión.",
      "i5": "La capacitación forma a las empresas para aplicar bien las reglas y prácticas del comercio internacional."
    },
    "resumen": "La CCI reúne en un mismo entorno reglas (Incoterms), arbitraje, representación, promoción y capacitación. No es un tribunal estatal ni una autoridad aduanera."
  },
  "n1c2": {
    "solucion": {
      "k1": {
        "si": 1
      },
      "k2": {
        "si": 1
      },
      "k3": {
        "si": 1
      },
      "k4": {
        "no": 1
      },
      "k5": {
        "no": 1
      },
      "k6": {
        "si": 1
      }
    },
    "feedback": {
      "k1": "Los Incoterms son reglas elaboradas por la CCI.",
      "k2": "La Corte Internacional de Arbitraje de la CCI administra procesos arbitrales; quienes deciden son los árbitros.",
      "k3": "La CCI ofrece formación para las empresas.",
      "k4": "La CCI no es un tribunal estatal: no dicta sentencias de jueces.",
      "k5": "Los aranceles los cobran las autoridades aduaneras de cada Estado, no la CCI.",
      "k6": "La CCI representa los intereses empresariales ante gobiernos y organismos internacionales."
    },
    "resumen": "Distinguir lo que la CCI hace (reglas, arbitraje, formación, representación) de lo que hacen los Estados (sentencias, aranceles) evita confundir instituciones."
  },
  "n2c1": {
    "solucion": {
      "a1": {
        "exw": 1
      },
      "a2": {
        "fca": 1
      },
      "a3": {
        "cif": 1
      },
      "a4": {
        "dap": 1
      }
    },
    "feedback": {
      "a1": "EXW es la menor obligación para el vendedor: el comprador asume transporte, exportación y riesgos desde el establecimiento del vendedor.",
      "a2": "En FCA el vendedor cumple al entregar al transportista designado por el comprador y despacha la exportación; el riesgo pasa en ese momento.",
      "a3": "En CIF el vendedor contrata y paga flete y seguro hasta el puerto de destino, pero el riesgo pasa al comprador cuando la mercancía está a bordo. Solo se usa en transporte marítimo y fluvial.",
      "a4": "En DAP el vendedor asume costos y riesgo hasta el destino convenido, listo para descargar; la importación corresponde al comprador."
    },
    "resumen": "Los Incoterms 2020 reparten obligaciones de entrega, costos y riesgos; cada término mueve esa «frontera» a un punto distinto de la operación."
  },
  "n2c2": {
    "solucion": {
      "b1": {
        "si": 1
      },
      "b2": {
        "si": 1
      },
      "b3": {
        "si": 1
      },
      "b4": {
        "no": 1
      },
      "b5": {
        "no": 1
      },
      "b6": {
        "no": 1
      }
    },
    "feedback": {
      "b1": "El reparto del transporte entre vendedor y comprador es una función central del Incoterm.",
      "b2": "La transmisión del riesgo es otra función central del Incoterm.",
      "b3": "Cada Incoterm indica quién despacha la exportación.",
      "b4": "Los Incoterms no regulan la transferencia de la propiedad de la mercancía.",
      "b5": "La forma de pago se pacta aparte (por ejemplo, con un crédito documentario).",
      "b6": "La ley aplicable y la solución de controversias se pactan en cláusulas propias; no las decide el Incoterm."
    },
    "resumen": "Los Incoterms no determinan la propiedad de las mercancías, la forma de pago, la ley aplicable ni cómo se resuelven las controversias."
  },
  "n2c3": {
    "solucion": {
      "c1": {
        "ord": 1
      },
      "c2": {
        "ben": 1
      },
      "c3": {
        "emi": 1
      },
      "c4": {
        "avi": 1
      }
    },
    "feedback": {
      "c1": "El ordenante es el comprador: solicita la apertura del crédito a su banco.",
      "c2": "El beneficiario es el vendedor: cobra si presenta documentos conformes.",
      "c3": "El banco emisor abre el crédito y asume la obligación de pagar contra documentos conformes.",
      "c4": "El banco avisador notifica el crédito al beneficiario; si además lo confirmara, asumiría su propia obligación de pago."
    },
    "resumen": "El comprador es el ordenante, el banco emisor se obliga a pagar contra documentos conformes y el vendedor es el beneficiario; el avisador solo notifica."
  },
  "n2c4": {
    "solucion": {
      "d1": {
        "ok": 1
      },
      "d2": {
        "ok": 1
      },
      "d3": {
        "ok": 1
      },
      "d4": {
        "no": 1
      },
      "d5": {
        "no": 1
      },
      "d6": {
        "ok": 1
      }
    },
    "feedback": {
      "d1": "Los bancos tratan con documentos, no con mercancías.",
      "d2": "El crédito es una operación separada de la compraventa, aunque se base en ella.",
      "d3": "Las UCP 600 rigen el crédito cuando este las incorpora expresamente.",
      "d4": "El banco no verifica la calidad de la mercancía: solo examina los documentos.",
      "d5": "Las UCP 600 no son automáticas: dependen de que el crédito las incorpore.",
      "d6": "Una presentación con discrepancias puede ser rechazada por el banco."
    },
    "resumen": "Las UCP 600 (reglas de la CCI) rigen el crédito documentario si se incorporan expresamente; los bancos examinan documentos y el crédito es independiente de la compraventa."
  },
  "n2c5": {
    "solucion": {
      "e1": {
        "trib": 1
      },
      "e2": {
        "trib": 1
      },
      "e3": {
        "corte": 1
      },
      "e4": {
        "corte": 1
      },
      "e5": {
        "corte": 1
      }
    },
    "feedback": {
      "e1": "Quien decide la controversia es el tribunal arbitral, no la Corte.",
      "e2": "El laudo es la decisión final del tribunal arbitral y obliga a las partes.",
      "e3": "La Corte CCI cumple una función administrativa: organiza y supervisa el arbitraje.",
      "e4": "La Corte nombra o confirma a los árbitros según el reglamento.",
      "e5": "La Corte examina el proyecto de laudo, pero no decide la controversia."
    },
    "resumen": "La Corte CCI administra el arbitraje; el tribunal arbitral, integrado por los árbitros, resuelve la controversia mediante el laudo."
  },
  "n2c6": {
    "solucion": {
      "f1": {
        "arb": 1
      },
      "f2": {
        "arb": 1
      },
      "f3": {
        "med": 1
      },
      "f4": {
        "med": 1
      },
      "f5": {
        "jue": 1
      }
    },
    "feedback": {
      "f1": "El arbitraje termina con una decisión obligatoria: el laudo.",
      "f2": "El arbitraje nace de un convenio arbitral pactado por las partes.",
      "f3": "El mediador facilita el diálogo; no decide.",
      "f4": "En la mediación el acuerdo, si existe, lo construyen las partes.",
      "f5": "La jurisdicción estatal la ejerce un juez del Estado con sus propias reglas procesales."
    },
    "resumen": "El arbitraje termina en un laudo obligatorio; la mediación busca un acuerdo y no decide; la jurisdicción estatal la ejerce un juez del Estado."
  },
  "n3c1": {
    "solucion": {
      "entrega": {
        "fca": 1,
        "dap": 0.3
      },
      "pago": {
        "ucp": 1,
        "sinreg": 0.3
      },
      "controversias": {
        "arb": 1,
        "med": 0.3
      }
    },
    "feedback": {
      "entrega": {
        "exw": "El comprador lo rechazó: EXW le obligaba a despachar la exportación desde Colombia.",
        "fca": "FCA encaja: el vendedor entrega al transportista designado y despacha la exportación; el riesgo pasa al comprador en ese punto. El Incoterm solo regula entrega, costos y riesgos.",
        "dap": "DAP es válido, pero tu empresa asumiría transporte y riesgo hasta Hamburgo: mucho más de lo que querías."
      },
      "pago": {
        "ucp": "Las UCP 600 rigen el crédito cuando lo incorpora expresamente. El banco emisor se obliga a pagar contra documentos conformes; examina documentos, no mercancías.",
        "sinreg": "Si el crédito no incorpora las UCP 600, no puedes dar por hecho que se apliquen: queda incierto cómo se examinarán tus documentos.",
        "trans": "No es un crédito documentario: entregarías primero y cobrarías después, sin la obligación de pago de un banco."
      },
      "controversias": {
        "arb": "En el arbitraje CCI la Corte administra el proceso y el tribunal arbitral resuelve con un laudo obligatorio.",
        "med": "La mediación ayuda a negociar, pero nadie impone una decisión: si no hay acuerdo, quedarías sin una solución obligatoria.",
        "nada": "Sin cláusula, la ley aplicable y el juez competente se determinarían después con normas de Derecho Internacional Privado: incertidumbre y costos."
      }
    },
    "resumen": "Cada cláusula cumple una función: el Incoterm reparte entrega, costos y riesgos; el crédito documentario (UCP 600) asegura el pago contra documentos; el arbitraje CCI resuelve controversias."
  },
  "n4c1": {
    "solucion": {
      "g1": {
        "v": 1
      },
      "g2": {
        "v": 1
      },
      "g3": {
        "v": 1
      },
      "g4": {
        "c": 1
      },
      "g5": {
        "c": 1
      }
    },
    "feedback": {
      "g1": "En DAP el vendedor organiza y paga el transporte hasta el destino convenido.",
      "g2": "El despacho de exportación corresponde al vendedor.",
      "g3": "El riesgo es del vendedor hasta que la mercancía queda a disposición en el destino, lista para descargar.",
      "g4": "En DAP la importación y los derechos corresponden al comprador.",
      "g5": "DAP entrega «lista para descargar»: la descarga ya es del comprador."
    },
    "resumen": "Con DAP la frontera de responsabilidad llega al lugar de destino: antes, vendedor; descarga e importación, comprador."
  },
  "n4c2": {
    "solucion": {
      "s1": {
        "pag": 1
      },
      "s2": {
        "rec": 1
      },
      "s3": {
        "pag": 1
      },
      "s4": {
        "rec": 1
      },
      "s5": {
        "pag": 1
      }
    },
    "feedback": {
      "s1": "Con documentos conformes a las condiciones del crédito, el banco debe honrar el crédito.",
      "s2": "Un documento de transporte fuera del plazo de embarque es una discrepancia: el banco puede rechazar la presentación.",
      "s3": "Los bancos examinan documentos, no mercancías, y el crédito es independiente de la compraventa: el reclamo por calidad se discute aparte.",
      "s4": "Si los documentos no concuerdan con lo exigido por el crédito hay discrepancia, y el banco puede rechazarlos.",
      "s5": "Documentos conformes y a tiempo: el banco debe pagar."
    },
    "resumen": "Con UCP 600 el banco decide por los documentos: conformes, paga; con discrepancias, puede rechazar. La calidad de la mercancía se discute fuera del crédito."
  },
  "n4c3": {
    "solucion": {
      "h1": {
        "arb": 1
      },
      "h2": {
        "med": 1
      },
      "h3": {
        "jue": 1
      },
      "h4": {
        "arb": 1
      }
    },
    "feedback": {
      "h1": "Con convenio arbitral, la controversia va a arbitraje: la Corte CCI administra y el tribunal arbitral decide.",
      "h2": "La mediación busca un acuerdo con un tercero neutral que no impone decisión.",
      "h3": "Sin convenio arbitral, la vía es la jurisdicción estatal.",
      "h4": "La decisión obligatoria de árbitros elegidos por las partes es el laudo arbitral."
    },
    "resumen": "Arbitraje (laudo obligatorio, si hay convenio), mediación (acuerdo, sin decisión impuesta) y juez estatal son mecanismos distintos."
  },
  "n4c4": {
    "solucion": {
      "i1": {
        "sen": 1
      },
      "i2": {
        "lau": 1
      },
      "i3": {
        "acu": 1
      },
      "i4": {
        "lau": 1
      }
    },
    "feedback": {
      "i1": "Una sentencia extranjera es la decisión de un juez estatal de otro país; para ejecutarse en Colombia debe ser reconocida mediante exequátur.",
      "i2": "El laudo es la decisión de árbitros, no de un juez estatal: no es una sentencia y se rige por el régimen del arbitraje.",
      "i3": "La mediación no impone decisión: si hay acuerdo, es un pacto entre las partes; no es sentencia ni laudo.",
      "i4": "Los árbitros elegidos por las partes dictan un laudo, no una sentencia."
    },
    "resumen": "Sentencia (juez estatal), laudo (árbitros) y acuerdo de mediación (partes) son resultados distintos con régimen distinto: no se confunden."
  },
  "n4c5": {
    "solucion": {
      "j1": {
        "si": 1
      },
      "j2": {
        "si": 1
      },
      "j3": {
        "si": 1
      },
      "j4": {
        "no": 1
      },
      "j5": {
        "no": 1
      },
      "j6": {
        "no": 1
      }
    },
    "feedback": {
      "j1": "La sentencia extranjera se presenta en copia debidamente legalizada.",
      "j2": "Debe estar ejecutoriada (firme) según la ley del país donde se dictó.",
      "j3": "El exequátur se solicita ante la Corte Suprema de Justicia, por medio de abogado.",
      "j4": "La Corte CCI administra arbitrajes; no reconoce sentencias de jueces estatales. Son vías distintas.",
      "j5": "Una sentencia extranjera no se ejecuta por sí sola: primero debe ser reconocida.",
      "j6": "La aduana controla mercancías; el reconocimiento de sentencias es un trámite judicial, no logístico."
    },
    "resumen": "El exequátur es un procedimiento judicial en Colombia, distinto del arbitraje y de la aduana: la autoridad verifica requisitos legales antes de permitir la ejecución."
  }
};
