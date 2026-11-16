import { F } from '../fuentes.js';

/**
 * Grupo terapéutico: medicamentos para el dolor y la inflamación.
 * Las citas [n] apuntan a `referencias` (Vancouver). Datos verificados el
 * 16-nov-2026 en las fichas técnicas de CIMA, el CUM del INVIMA, el
 * metaanálisis CNT, los ensayos PRECISION y MEDAL y la revisión de Cashin
 * y cols. sobre relajantes musculares.
 */
export default {
  tipo: 'grupo',
  slug: 'medicamentos-para-el-dolor-y-la-inflamacion',
  nombre: 'Medicamentos para el dolor y la inflamación',
  titulo: 'Medicamentos para el dolor y la inflamación: AINE, coxibs, acetaminofén, dipirona, tramadol y relajantes musculares',
  actualizado: '2026-11-16',
  resumen: 'Once medicamentos que se piden a diario en la droguería y se formulan en consulta: diclofenaco, ibuprofeno, naproxeno, meloxicam, etoricoxib, celecoxib, ketorolaco, acetaminofén, dipirona (metamizol), tramadol y metocarbamol. Comparten un objetivo, aliviar el dolor, pero actúan por mecanismos distintos y tienen riesgos distintos: sangrado digestivo y daño renal con los AINE, riesgo trombótico con los coxibs y el diclofenaco, daño hepático por sobredosis con el acetaminofén, agranulocitosis con la dipirona, dependencia e interacciones con el tramadol y sedación con el metocarbamol. Este grupo reúne sus dianas, la evidencia de seguridad comparada y la atención farmacéutica con el modelo de Minnesota.',
  datosClave: [
    ['Grupos ATC', 'M01A (AINE y coxibs), N02 (acetaminofén, dipirona y tramadol) y M03B (metocarbamol)'],
    ['Con más registros vigentes en Colombia', 'Acetaminofén (313), ibuprofeno (169), naproxeno (85) y diclofenaco (82) [8]'],
    ['Riesgo transversal de los AINE', 'Hemorragia y úlcera digestiva, retención de líquidos y daño renal [1-5,9]'],
    ['Regla práctica', 'Un solo AINE a la vez, a la dosis eficaz más baja y por el menor tiempo [1-3]'],
  ],
  secciones: [
    {
      id: 'dianas-y-mecanismos',
      titulo: 'Dónde actúa cada medicamento',
      bloques: [
        'El dolor se puede tratar en distintos puntos: en el tejido inflamado, en la médula espinal o en el cerebro. Cada medicamento del grupo actúa en un sitio diferente:',
        { tabla: {
          columnas: ['Medicamento', 'Diana', 'Efecto principal'],
          filas: [
            ['Diclofenaco, ibuprofeno y naproxeno', 'Síntesis de prostaglandinas [15-17]', 'Analgésico, antiinflamatorio y antipirético [15-17]'],
            ['Meloxicam y ketorolaco', 'Ciclooxigenasa (síntesis de prostaglandinas) [1,4]', 'Analgésico, antiinflamatorio y antipirético [1,4]'],
            ['Acetaminofén', 'Mecanismo analgésico no totalmente determinado [18]', 'Analgésico y antipirético, no antiinflamatorio [18]'],
            ['Etoricoxib y celecoxib', 'COX-2 de forma selectiva [2,3]', 'Antiinflamatorio con menos efecto sobre la COX-1 [2,3]'],
            ['Dipirona (metamizol)', 'Acción central y periférica de la 4-metilaminoantipirina [5]', 'Analgésico, antipirético y espasmolítico [5]'],
            ['Tramadol', 'Receptores opioides μ, δ y κ; metabolito activo por CYP2D6 [6]', 'Analgésico de acción central [6]'],
            ['Metocarbamol', 'Reflejos polisinápticos de la médula y centros subcorticales [7]', 'Relajación muscular con sedación [7]'],
          ],
        } },
      ],
    },
    {
      id: 'farmacocinetica-comparada',
      titulo: 'Farmacocinética comparada',
      bloques: [
        { tabla: {
          columnas: ['Medicamento', 'Semivida', 'Metabolismo', 'Tomas al día'],
          filas: [
            ['Diclofenaco', '1 a 2 h [15]', 'Primer paso de cerca del 50 %; CYP2C9 [15]', 'Dos o tres [15]'],
            ['Ibuprofeno', 'Eliminación completa a las 24 h [16]', 'CYP2C9 y CYP2C8 [16]', 'Cada 6 a 8 h [16]'],
            ['Naproxeno', 'Unas 13 h [17]', '95 % por orina [17]', 'Dos [17]'],
            ['Meloxicam', '13 a 25 h [1]', 'CYP2C9 y CYP3A4 [1]', 'Una [1]'],
            ['Etoricoxib', 'Unas 22 h [2]', 'CYP3A4 [2]', 'Una [2]'],
            ['Celecoxib', '8 a 12 h [3]', 'CYP2C9; inhibe el CYP2D6 [3]', 'Una o dos [3]'],
            ['Ketorolaco', 'Unas 5 h; 7 h en mayores [4]', 'Eliminación renal del 91,4 % [4]', 'Cada 4 a 6 h, máximo 7 días [4]'],
            ['Acetaminofén', '1,5 a 3 h [18]', 'Hepático; glutatión [18]', 'Cada 4 a 6 h; máximo 3 g al día según la ficha española [18]'],
            ['Dipirona', '4-MAA: 2,7 h [5]', 'Hidrólisis a 4-MAA [5]', 'Cada 4 a 6 h, uso corto [5]'],
            ['Tramadol', 'Unas 6 h [6]', 'CYP2D6 y CYP3A4 [6]', 'Cada 4 a 6 h [6]'],
            ['Metocarbamol', '1 a 2 h [7]', 'Hepático [7]', 'Tres o cuatro [7]'],
          ],
        } },
      ],
    },
    {
      id: 'seguridad-comparada',
      titulo: 'Seguridad comparada: lo que dicen los ensayos',
      bloques: [
        'El metaanálisis de datos individuales del grupo CNT mostró que los coxibs y el diclofenaco aumentan los eventos vasculares mayores en cerca de un tercio frente a placebo (razón de tasas 1,37 y 1,41), que el ibuprofeno en dosis altas aumenta los eventos coronarios mayores y que todos los AINE estudiados aumentan las complicaciones digestivas altas (coxibs 1,81; diclofenaco 1,89; ibuprofeno 3,97; naproxeno 4,22) [9].',
        'En PRECISION, con 24.081 pacientes de riesgo cardiovascular aumentado, el celecoxib a dosis moderadas no fue inferior al ibuprofeno ni al naproxeno en seguridad cardiovascular y produjo menos eventos digestivos [10].',
        'En MEDAL, con 34.701 pacientes, el etoricoxib y el diclofenaco tuvieron tasas similares de eventos trombóticos; el etoricoxib produjo menos eventos digestivos altos, pero no menos complicaciones graves [11].',
        'En el dolor lumbar agudo, los relajantes musculares no benzodiacepínicos dan una reducción pequeña del dolor a corto plazo y podrían aumentar los eventos adversos [12].',
      ],
    },
    {
      id: 'eleccion-segun-el-paciente',
      titulo: 'Elección según el paciente',
      bloques: [
        { tabla: {
          columnas: ['Situación del paciente', 'Qué evitar', 'Por qué'],
          filas: [
            ['Úlcera o sangrado digestivo previo', 'Todos los AINE; el ketorolaco está contraindicado [1,4]', 'Riesgo de hemorragia [1,4,9]'],
            ['Cardiopatía isquémica o insuficiencia cardiaca', 'Etoricoxib, celecoxib y diclofenaco están contraindicados [2,3,15]', 'Riesgo trombótico y retención de líquidos [2,3,15]'],
            ['Enfermedad hepática o consumo habitual de alcohol', 'Acetaminofén: contraindicado en enfermedad hepática; máximo 2 g al día con alcohol [18]', 'Hepatotoxicidad [18]'],
            ['Aspirina diaria para el corazón', 'Uso habitual de ibuprofeno o naproxeno [16,17]', 'Pueden reducir el efecto antiplaquetario [16,17]'],
            ['Hipertensión no controlada', 'Etoricoxib (contraindicado) [2]', 'Sube la presión [2]'],
            ['Enfermedad renal o deshidratación', 'AINE y coxibs; ketorolaco contraindicado [1-4]', 'Insuficiencia renal funcional [1-4]'],
            ['Quimioterapia o alteración de la médula ósea', 'Dipirona (contraindicada) [5]', 'Agranulocitosis [5]'],
            ['Antidepresivos, benzodiacepinas o pregabalina', 'Tramadol, salvo vigilancia estrecha [6]', 'Síndrome serotoninérgico y depresión respiratoria [6]'],
            ['Epilepsia', 'Metocarbamol (contraindicado) y tramadol si no está controlada [6,7]', 'Convulsiones [6,7]'],
            ['Tercer trimestre del embarazo', 'AINE, coxibs y dipirona [1-5]', 'Cierre del ductus arterioso y daño renal fetal [1,5]'],
          ],
        } },
      ],
    },
    {
      id: 'atencion-farmaceutica',
      titulo: 'Atención farmacéutica en el dolor',
      destacado: true,
      bloques: [
        'El problema más frecuente con estos medicamentos no es la falta de eficacia: es la suma. Un paciente con meloxicam formulado compra ibuprofeno para la noche y toma un «relajante» que le regaló un familiar. El farmacéutico es quien ve el conjunto [13].',
        { subtitulo: 'Preguntas clave en la dispensación' },
        { lista: [
          '¿Qué otros medicamentos para el dolor toma, incluidos los de venta libre? [1-4]',
          '¿Ha tenido úlcera, heces negras o problemas de riñón? [1,4]',
          '¿Tiene hipertensión, angina o insuficiencia cardiaca? [2,3]',
          '¿Toma anticoagulantes, antidepresivos, pastillas para dormir o pregabalina? [1,6]',
          '¿Está embarazada o lactando? [1-5]',
        ] },
        { subtitulo: 'La experiencia del paciente' },
        'El dolor es la experiencia que más empuja a la automedicación. Preguntar qué espera, qué ha probado y qué teme permite proponer un plan con un solo antiinflamatorio, una duración clara y señales de alarma que el paciente reconozca [13,14].',
      ],
    },
  ],
  referencias: [
    F.ftMeloxicam, F.ftEtoricoxib, F.ftCelecoxib, F.ftKetorolaco, F.ftNolotil, F.ftTramadol, F.ftRobaxin,
    F.invimaCum16, F.cnt2013, F.precision, F.medal, F.cashin2021, F.cipolle2012, F.ramalho2012,
    F.ftDiclofenaco, F.ftIbuprofeno, F.ftNaproxeno, F.ftParacetamol,
  ],
  enlaces: [
    ['Diclofenaco: para qué sirve', '/articulos/diclofenaco-para-que-sirve'],
    ['Ibuprofeno: para qué sirve', '/articulos/ibuprofeno-para-que-sirve'],
    ['Naproxeno: para qué sirve', '/articulos/naproxeno-para-que-sirve'],
    ['Acetaminofén: para qué sirve', '/articulos/acetaminofen-para-que-sirve'],
    ['Cursos de farmacología gratis', '/articulos/cursos-de-farmacologia-gratis'],
    ['Curso gratis: Farmacología del Sistema Nervioso Central', '/curso-de-farmacologia-del-sistema-nervioso-central'],
  ],
  seo: {
    titulo: 'Medicamentos para el dolor y la inflamación: vademécum',
    descripcion: 'Diclofenaco, ibuprofeno, naproxeno, coxibs, ketorolaco, acetaminofén, dipirona, tramadol y metocarbamol: seguridad comparada y atención farmacéutica.',
  },
};
