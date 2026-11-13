import { F } from '../fuentes.js';

/**
 * Grupo terapéutico: antibióticos de uso ambulatorio.
 * Las citas [n] apuntan a `referencias` (Vancouver). Datos verificados el
 * 13-nov-2026 en las fichas técnicas de CIMA, la etiqueta de la FDA
 * (cefalexina) y el CUM del INVIMA.
 */
export default {
  tipo: 'grupo',
  slug: 'antibioticos-de-uso-ambulatorio',
  nombre: 'Antibióticos de uso ambulatorio',
  titulo: 'Antibióticos de uso ambulatorio: mecanismos, farmacocinética y atención farmacéutica',
  actualizado: '2026-11-13',
  resumen: 'Siete antibióticos que se formulan y dispensan a diario fuera del hospital: amoxicilina con ácido clavulánico, cefalexina, clindamicina, ciprofloxacino, metronidazol, trimetoprim/sulfametoxazol y nitrofurantoína. Atacan dianas distintas (la pared celular, el ribosoma, el ADN, la vía del folato), y esa diferencia explica su espectro, sus interacciones y sus efectos adversos. El grupo cierra con el proceso de atención farmacéutica del modelo de Minnesota aplicado a los antibióticos.',
  datosClave: [
    ['Grupos ATC', 'J01 (antibacterianos de uso sistémico) y P01AB (nitroimidazoles)'],
    ['Con más registros vigentes en Colombia', 'Metronidazol (71), clindamicina (61) y cefalexina (45) [8]'],
    ['Advertencia transversal', 'Diarrea asociada a Clostridioides difficile con casi todos los antibióticos [2,3]'],
    ['Lo que no hacen', 'No sirven contra virus: gripa, resfriado y la mayoría de los dolores de garganta'],
  ],
  secciones: [
    {
      id: 'dianas',
      titulo: 'Dónde actúa cada antibiótico',
      bloques: [
        { tabla: {
          columnas: ['Diana', 'Antibiótico', 'Mecanismo', 'Efecto'],
          filas: [
            ['Pared celular', 'Amoxicilina con ácido clavulánico, cefalexina', 'Inhiben las proteínas de unión a la penicilina que construyen el peptidoglicano; el clavulánico bloquea betalactamasas [1,2]', 'Bactericida [2]'],
            ['Ribosoma (subunidad 50S)', 'Clindamicina', 'Bloquea las primeras etapas de la síntesis de proteínas [3]', 'Frena la síntesis de proteínas de la bacteria [3]'],
            ['ADN girasa y topoisomerasa IV', 'Ciprofloxacino', 'Impide replicar, transcribir y reparar el ADN [4]', 'Bactericida [4]'],
            ['ADN, por reducción en anaerobiosis', 'Metronidazol', 'Se activa a radicales nitrosos que rompen el ADN [5]', 'Dependiente de la concentración [5]'],
            ['Vía del ácido fólico', 'Trimetoprim/sulfametoxazol', 'El sulfametoxazol compite con el PABA y el trimetoprim inhibe la dihidrofolato reductasa [6]', 'Bloqueo en dos pasos de la misma vía [6]'],
            ['Varios sistemas enzimáticos', 'Nitrofurantoína', 'Mecanismo no del todo establecido [7]', 'Se concentra en la orina [7]'],
          ],
        } },
      ],
    },
    {
      id: 'farmacocinetica-comparada',
      titulo: 'Farmacocinética comparada para la dispensación',
      bloques: [
        { tabla: {
          columnas: ['Antibiótico', 'Con o sin comida', 'Semivida', 'Particularidad'],
          filas: [
            ['Amoxicilina/ácido clavulánico', 'Al comienzo de la comida [1]', 'Cerca de 1 hora (amoxicilina) [1]', 'Biodisponibilidad cercana al 70 % [1]'],
            ['Cefalexina', 'Con o sin comida [2]', 'Detectable en suero hasta 6 h tras la dosis [2]', 'Más del 90 % se elimina sin cambios en la orina en 8 h [2]'],
            ['Clindamicina', 'Con comida, sin efecto cuantificable [3]', '1,5 a 3,5 horas [3]', 'Riesgo de esofagitis: vaso lleno de agua [3]'],
            ['Ciprofloxacino', 'Lejos de lácteos y cationes [4]', '4 a 7 horas [4]', 'Biodisponibilidad del 70 al 80 % [4]'],
            ['Metronidazol', 'Con o sin comida [5]', '8 a 10 horas [5]', 'Biodisponibilidad del 100 %; nada de alcohol hasta 48 h después [5]'],
            ['Trimetoprim/sulfametoxazol', 'Con alimento o bebida [6]', 'Trimetoprim: 8,6 a 17 horas [6]', 'Muy frecuente la hiperpotasemia [6]'],
            ['Nitrofurantoína', 'Con comida (mejor absorción) [7]', '—', 'Cerca del 40 % se elimina activa en la orina [7]'],
          ],
        } },
      ],
    },
    {
      id: 'resistencia',
      titulo: 'Resistencia: lo que dicen las fichas técnicas',
      bloques: [
        { lista: [
          'Betalactamasas: el ácido clavulánico protege a la amoxicilina de las betalactamasas que puede inhibir, pero no de la resistencia mediada por otros mecanismos [1].',
          'La cefalexina no actúa sobre estafilococos resistentes a la meticilina, la mayoría de los enterococos ni Pseudomonas [2].',
          'La clindamicina pierde actividad por mutación o metilación del ARN 23S del ribosoma y, con menos frecuencia, por bombas de expulsión [3].',
          'La nitrofurantoína conserva con frecuencia su actividad frente a enterobacterias productoras de BLEE, carbapenemasas KPC y otras multirresistentes, y frente a Enterococcus [7].',
        ] },
        'Por eso las fichas técnicas reservan el ciprofloxacino y el trimetoprim/sulfametoxazol, en varias infecciones comunes, para cuando el antibiótico de primera línea no es apropiado [4,6].',
      ],
    },
    {
      id: 'seguridad',
      titulo: 'Seguridad: las advertencias que comparten',
      bloques: [
        { lista: [
          'Diarrea por Clostridioides difficile: descrita con casi todos los antibióticos; con clindamicina y cefalexina se advierte de forma destacada [2,3].',
          'Reacciones graves de la piel (Stevens-Johnson, necrólisis epidérmica tóxica): metronidazol, trimetoprim/sulfametoxazol, clindamicina y cefalexina [2,3,5,6].',
          'Alergia cruzada entre betalactámicos: hasta en el 10 % de las personas con alergia a la penicilina [2].',
          'Fluoroquinolonas: tendinitis y rotura de tendones, efectos incapacitantes y duraderos, aneurisma aórtico y QT prolongado [4].',
          'Nitrofurantoína: reacciones pulmonares y hepáticas graves con tratamientos prolongados; contraindicada más allá de 7 días [7].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica con antibióticos: el modelo de Minnesota',
      destacado: true,
      bloques: [
        'El modelo de Minnesota revisa cada medicamento en el mismo orden: indicación, efectividad, seguridad y adherencia [9]. Con los antibióticos, cada paso tiene un problema típico.',
        { tabla: {
          columnas: ['Necesidad', 'Problema relacionado con la farmacoterapia', 'Ejemplo en la dispensación'],
          filas: [
            ['Indicación', 'Farmacoterapia innecesaria', 'Antibiótico para una gripa o un resfriado, que son virales'],
            ['Efectividad', 'Medicamento inefectivo o dosis baja', 'Ciprofloxacino tomado con leche o con un antiácido; nitrofurantoína con función renal baja [4,7]'],
            ['Seguridad', 'Reacción adversa o interacción', 'Metronidazol con alcohol; trimetoprim/sulfametoxazol con warfarina; ciprofloxacino con tizanidina o teofilina [4-6]'],
            ['Adherencia', 'Incumplimiento', 'Suspender al sentirse mejor o guardar las tabletas sobrantes para otra ocasión'],
          ],
        } },
        'La experiencia farmacoterapéutica del paciente —lo que cree, espera y teme de los antibióticos— explica muchos de estos problemas; conocerla ayuda a prevenirlos [9,10].',
      ],
    },
  ],
  referencias: [
    F.ftAmoxiClav, F.dmCefalexina, F.ftDalacin, F.ftCiprofloxacino, F.ftMetronidazol, F.ftSeptrin, F.ftFurantoina,
    F.invimaCum, F.cipolle2012, F.ramalho2012,
  ],
  enlaces: [
    ['Amoxicilina: para qué sirve', '/articulos/amoxicilina-para-que-sirve'],
    ['Azitromicina: para qué sirve', '/articulos/azitromicina-para-que-sirve'],
    ['Uso racional de antibióticos: el rol del farmacéutico clínico', '/articulos/antibioticos-uso-racional-resistencia'],
    ['Cursos de antibióticos y resistencia antimicrobiana', '/articulos/cursos-de-antibioticos-y-resistencia-antimicrobiana'],
  ],
  seo: {
    titulo: 'Antibióticos de uso ambulatorio: vademécum farmacológico',
    descripcion: 'Mecanismos, farmacocinética, resistencia y seguridad de 7 antibióticos de uso ambulatorio, con atención farmacéutica según el modelo de Minnesota.',
  },
};
