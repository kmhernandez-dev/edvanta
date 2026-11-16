import { F } from '../fuentes.js';

/**
 * Monografía: fosfomicina. Verificada el 13-nov-2026 en la ficha técnica
 * de CIMA, la clasificación AWaRe y el CUM del INVIMA.
 */
export default {
  tipo: 'medicamento',
  slug: 'fosfomicina',
  nombre: 'Fosfomicina',
  titulo: 'Fosfomicina: farmacología y atención farmacéutica',
  grupo: 'antibioticos-de-uso-ambulatorio',
  clase: 'Derivado del ácido fosfónico',
  atc: 'J01XX01',
  marcas: ['Monurol', 'Fosfomicina'],
  vias: ['Oral'],
  mecanismo: 'Inhibe la enzima MurA y bloquea la primera etapa de la síntesis del peptidoglucano; es bactericida frente a bacterias sensibles.',
  actualizado: '2026-11-13',
  resumenCorto: 'antibiótico de dosis única para cistitis no complicada; no sirve para pielonefritis.',
  resumen: 'La fosfomicina trometamol es un antibiótico oral que se usa en dosis única de 3 g para la cistitis no complicada. Inhibe la síntesis de la pared bacteriana por un mecanismo distinto al de los betalactámicos y alcanza concentraciones urinarias altas. No es adecuada para infecciones del riñón ni sistémicas. La atención farmacéutica se centra en la indicación, la administración nocturna, la hidratación, la adherencia y la prevención de resistencias.',
  datosClave: [
    ['Clase', 'Derivado del ácido fosfónico [1,2]'],
    ['Código ATC', 'J01XX01 [1]'],
    ['Dosis habitual', '3 g en dosis única en cistitis no complicada [1,2]'],
    ['Metabolismo', 'No se metaboliza de forma relevante; eliminación renal [1]'],
    ['Semivida', 'Aproximadamente 5 a 6 horas [1]'],
    ['Colombia', 'Registros vigentes en el CUM; consultar presentación [3]'],
  ],
  secciones: [
    {
      id: 'farmacoquimica',
      titulo: 'Farmacoquímica',
      bloques: [
        'La fosfomicina es un derivado del ácido fosfónico producido originalmente por *Streptomyces*. La forma oral es fosfomicina trometamol, una sal que mejora la absorción [1,2].',
        'Su fórmula es C3H7O4P y su peso molecular es 138,06 para la fosfomicina libre; la sal trometamol tiene mayor peso y solubilidad [1].',
      ],
    },
    {
      id: 'farmacodinamia',
      titulo: 'Farmacodinamia',
      bloques: [
        'Inhibe la enzima MurA (UDP-N-acetilglucosamina enolpiruvil transferasa), que cataliza la primera etapa de la síntesis del peptidoglucano. El bloqueo detiene la formación de la pared y causa la lisis bacteriana [1,2].',
        'Es bactericida frente a *Escherichia coli*, *Enterococcus faecalis* y otras bacterias urinarias sensibles. Su mecanismo es único, lo que limita la resistencia cruzada [1].',
      ],
    },
    {
      id: 'farmacocinetica',
      titulo: 'Farmacocinética',
      bloques: [
        { tabla: {
          columnas: ['Parámetro', 'Valor'],
          filas: [
            ['Absorción', 'Oral; biodisponibilidad de aproximadamente 30 a 40 % [1]'],
            ['Concentración máxima', '2 a 3 horas [1]'],
            ['Unión a proteínas', 'Baja [1]'],
            ['Metabolismo', 'No se metaboliza de forma relevante [1]'],
            ['Semivida', '5 a 6 horas [1]'],
            ['Eliminación', 'Renal, principalmente sin cambios [1]'],
            ['Alimentos', 'Pueden reducir la absorción; se recomienda separar [1]'],
          ],
        } },
      ],
    },
    {
      id: 'indicaciones',
      titulo: 'Indicaciones',
      bloques: [
        'La fosfomicina trometamol está indicada en [1,2]:',
        { lista: [
          'Cistitis aguda no complicada en la mujer.',
          'Bacteriuria asintomática en el embarazo, según el antibiograma y el criterio médico.',
          'Profilaxis de infecciones urinarias en algunos pacientes, con esquemas específicos.',
          'Infecciones urinarias bajas causadas por bacterias sensibles.',
        ] },
        'No se usa para pielonefritis, prostatitis, infecciones complicadas ni infecciones sistémicas.',
      ],
    },
    {
      id: 'posologia',
      titulo: 'Posología y administración',
      bloques: [
        { tabla: {
          columnas: ['Indicación', 'Esquema orientativo'],
          filas: [
            ['Cistitis no complicada', '3 g en dosis única [1,2]'],
            ['Bacteriuria en el embarazo', '3 g en dosis única, según protocolo [1]'],
            ['Profilaxis', 'Dosis y frecuencia según el esquema indicado [1]'],
          ],
        } },
        { lista: [
          'Disolver el sobre en un vaso de agua y tomar inmediatamente [1].',
          'Preferiblemente por la noche, después de vaciar la vejiga [1].',
          'No requiere repetir la dosis sin indicación médica [1].',
          'No tomar con metoclopramida, porque reduce la absorción [1].',
        ] },
      ],
    },
    {
      id: 'contraindicaciones-y-advertencias',
      titulo: 'Contraindicaciones y advertencias',
      bloques: [
        'Contraindicaciones y precauciones [1,2]:',
        { lista: [
          'Hipersensibilidad a fosfomicina.',
          'Insuficiencia renal grave: valorar antes de usar.',
          'Diarrea grave o colitis: evitar hasta evaluar.',
          'Embarazo y lactancia: consultar; se usa en el embarazo cuando está indicada.',
        ] },
        'Advertencias: colitis por *C. difficile*, reacciones alérgicas graves, alteraciones hematológicas y falta de eficacia en infecciones del tracto urinario alto [1,2].',
      ],
    },
    {
      id: 'interacciones',
      titulo: 'Interacciones',
      bloques: [
        { tabla: {
          columnas: ['Medicamento', 'Efecto', 'Qué hacer'],
          filas: [
            ['Metoclopramida', 'Reduce la absorción de fosfomicina', 'Evitar o separar [1]'],
            ['Antiácidos con aluminio o magnesio', 'Pueden reducir la absorción', 'Separar [1]'],
            ['Warfarina', 'No se ha descrito una interacción relevante', 'Vigilar si hay cambios [2]'],
            ['Otros antibióticos', 'Pueden alterar la flora', 'No combinar sin indicación [1]'],
          ],
        } },
      ],
    },
    {
      id: 'reacciones-adversas',
      titulo: 'Reacciones adversas',
      bloques: [
        'Las más frecuentes son diarrea, náuseas, dolor abdominal, cefalea y vaginitis [1,2].',
        { lista: [
          'Frecuentes: diarrea, náuseas, cefalea y candidiasis vaginal.',
          'Poco frecuentes: vómito, dolor abdominal, rash y mareo.',
          'Raras: colitis pseudomembranosa, anafilaxia y alteraciones hematológicas.',
        ] },
      ],
    },
    {
      id: 'embarazo-y-lactancia',
      titulo: 'Embarazo y lactancia',
      bloques: [
        { lista: [
          'Embarazo: se ha usado para infecciones urinarias con indicación médica; no usar por cuenta propia [1,2].',
          'Lactancia: pasa en pequeñas cantidades; se considera compatible en tratamientos cortos, pero consultar [1].',
          'Fertilidad: no se han descrito efectos adversos [2].',
        ] },
      ],
    },
    {
      id: 'evidencia',
      titulo: 'Evidencia clínica',
      bloques: [
        'La fosfomicina trometamol en dosis única de 3 g tiene eficacia demostrada en cistitis no complicada, con una respuesta clínica y microbiológica comparable a otros antibióticos de varios días [1,2].',
        'Su ventaja es la simplicidad del esquema y la baja propensión a resistencia cruzada, aunque la resistencia está aumentando en algunas regiones [1].',
        'No debe usarse en pielonefritis porque las concentraciones séricas son bajas y no cubren la infección del parénquima renal [1,2].',
      ],
    },
    {
      id: 'regulacion',
      titulo: 'Situación regulatoria',
      bloques: [
        { lista: [
          'Colombia: el CUM registra fosfomicina trometamol en granulado para solución oral [3].',
          'Unión Europea: la fosfomicina está autorizada para cistitis no complicada [1].',
          'Estados Unidos: la FDA mantiene etiquetas de fosfomicina trometamol [1].',
        ] },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica (modelo de Minnesota)',
      destacado: true,
      bloques: [
        'La fosfomicina es un antibiótico de una sola dosis, pero eso no significa que no requiera educación: la indicación, la hidratación y los signos de alarma son clave [4].',
        { subtitulo: '1. Valoración de las necesidades' },
        { tabla: {
          columnas: ['Necesidad', 'Qué revisar'],
          filas: [
            ['Indicación', 'Cistitis no complicada; descartar pielonefritis [1,2]'],
            ['Efectividad', 'Mejoría de síntomas urinarios en 48 a 72 horas [1]'],
            ['Seguridad', 'Función renal, alergia, diarrea y embarazo [1,2]'],
            ['Adherencia', 'Dosis única y no repetir sin indicación [1]'],
          ],
        } },
        { subtitulo: '2. Problemas relacionados con la farmacoterapia más probables' },
        { tabla: {
          columnas: ['Categoría de PRF', 'Situación típica', 'Intervención'],
          filas: [
            ['Farmacoterapia innecesaria', 'Uso en pielonefritis o infección complicada', 'Cambiar el esquema [1,2]'],
            ['Dosis demasiado baja', 'Repetición o fraccionamiento sin indicación', 'Explicar la dosis única [1]'],
            ['Interacción', 'Metoclopramida o antiácidos', 'Separar o evitar [1]'],
            ['Incumplimiento', 'No completar la hidratación y el seguimiento', 'Educar [4]'],
          ],
        } },
        { subtitulo: '3. Plan de cuidado y seguimiento' },
        { lista: [
          'Confirmar que no hay signos de pielonefritis [1,2].',
          'Explicar la toma nocturna y la hidratación [1].',
          'Revisar función renal y embarazo [1].',
          'Registrar el estado de cada problema según el modelo [4].',
        ] },
      ],
    },
    {
      id: 'experiencia-farmacoterapeutica',
      titulo: 'Experiencia farmacoterapéutica',
      destacado: true,
      bloques: [
        'La fosfomicina se percibe como “un sobre y listo”. Esa simplicidad puede llevar a no consultar si los síntomas persisten o a repetirla sin evaluación [4,5].',
        { subtitulo: 'Lo que conviene explorar' },
        { lista: [
          'Si tiene fiebre, dolor lumbar o vómito, que sugieran pielonefritis [1].',
          'Si entiende que es una sola dosis y no debe repetirla [1].',
          'Si está embarazada o lactando [1].',
          'Si toma metoclopramida o antiácidos [1].',
          'Si los síntomas no mejoran en 48 a 72 horas [1].',
        ] },
        { subtitulo: 'Preguntas para la entrevista' },
        { lista: [
          '¿Sabe cómo tomar el sobre y a qué hora?',
          '¿Tiene fiebre o dolor en la espalda?',
          '¿Está embarazada?',
          '¿Qué hará si los síntomas no mejoran?',
        ] },
      ],
    },
  ],
  referencias: [F.ftFosfomicina, F.whoAware2023, F.invimaCum, F.cipolle2012, F.ramalho2012],
  enlaces: [
    ['Fosfomicina: para qué sirve', '/articulos/fosfomicina-para-que-sirve'],
    ['Infección urinaria: síntomas y tratamiento', '/articulos/infeccion-urinaria-sintomas-tratamiento'],
    ['Antibióticos de uso ambulatorio', '/vademecum/antibioticos-de-uso-ambulatorio'],
  ],
  seo: {
    titulo: 'Fosfomicina: farmacología y atención farmacéutica',
    descripcion: 'Fosfomicina: mecanismo, dosis única, cistitis no complicada, embarazo, metoclopramida y atención farmacéutica.',
  },
};
