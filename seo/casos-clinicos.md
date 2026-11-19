# Casos clínicos para practicar (exámenes tipo parcial)

18 de noviembre de 2026. Pedido de Karla: casos clínicos de las enfermedades más buscadas, para que los estudiantes de la salud estudien para sus parciales. Deben ser interactivos, tipo juego, con selección múltiple, completar y relacionar, y posicionarse cuando los estudiantes buscan cuestionarios de práctica.

## Qué quedó publicado (commit e817e61)

- **Catálogo:** `/casos-clinicos`, con filtros por área, buscador, preguntas frecuentes y el progreso de quien practica: casos hechos, puntos y días seguidos.
- **66 casos:** `/casos-clinicos/:slug`, cada uno con la historia de un paciente ficticio y 10 preguntas (selección múltiple, completar y relacionar). Los primeros 50 están aprobados e indexados; los 16 del lote 2 están en `noindex` hasta la revisión de Karla.
- **Juego:**
  - modo estudio, con explicación inmediata, pistas que valen la mitad y bono por racha;
  - modo parcial, con cronómetro y sin ayudas;
  - nota de 0 a 5 (se aprueba con 3,0), estrellas y nivel;
  - confeti desde 80 %;
  - repaso de cada respuesta con su cita;
  - curso gratis del tema, siguiente caso y botón «Reta a un compañero» por WhatsApp.
- **Progreso:** se guarda en el navegador de cada estudiante. No se recogen datos personales.
- **Acceso:** el catálogo está en el pie de página, en «Aprende → Casos clínicos para practicar».

### Las 50 páginas

| Área | Casos |
|---|---|
| Cardiovascular (11) | hipertensión arterial, insuficiencia cardiaca, fibrilación auricular, dislipidemia, crisis hipertensiva, preeclampsia, angina estable, anticoagulación con warfarina, síndrome coronario agudo, trombosis venosa profunda, embolia pulmonar |
| Endocrino (11) | diabetes tipo 2, diabetes tipo 1, cetoacidosis diabética, hipoglucemia, hipotiroidismo, hipertiroidismo, obesidad, osteoporosis, insuficiencia suprarrenal, diabetes gestacional, síndrome metabólico |
| Respiratorio (8) | asma, EPOC, neumonía adquirida en la comunidad, rinitis alérgica, tuberculosis, sinusitis aguda, bronquiolitis, apnea del sueño |
| Infecciosas (12) | infección urinaria, pielonefritis, faringoamigdalitis, otitis media aguda, celulitis, vaginosis bacteriana, Helicobacter pylori, herpes zóster, sepsis, meningitis bacteriana, hepatitis C, dengue |
| Sistema nervioso y salud mental (9) | depresión, ansiedad, epilepsia, migraña, Parkinson, insomnio, dolor neuropático, esquizofrenia, ACV isquémico |
| Digestivo (7) | reflujo gastroesofágico, diarrea aguda, síndrome de intestino irritable, estreñimiento, náuseas y vómito, pancreatitis aguda, cirrosis |
| Renal, reumatología y urgencias (8) | enfermedad renal crónica, gota, artritis reumatoide, anemia ferropénica, intoxicación por acetaminofén, anafilaxia, artrosis, cálculos renales |

## Fuentes: nada citado de memoria

- **Guías y ensayos:** 42 referencias nuevas generadas desde PubMed (E-utilities) a partir del PMID. Los autores, la revista, el volumen, las páginas y el DOI salen tal como los registra PubMed. Se suman a las del vademécum.
- **Fichas técnicas:** 40 fichas nuevas de CIMA. El número de registro se buscó en la API de CIMA y la ficha responde 200. Antes de escribir, un script descargó cada ficha citada y confirmó que contiene el dato que el caso le atribuye. Así se corrigieron dos textos, sobre dapagliflozina y warfarina.
- **Enlaces:** las 177 URL de las referencias respondían el 18-nov.
- **Herramientas:** `src/data/casosClinicos/fuentes.js` es el banco de referencias. La prueba `src/__tests__/casos-clinicos.test.js` hace 470 comprobaciones sobre los 66 casos: 10 preguntas con los tres tipos, cada cita con su referencia, cada referencia citada, enlaces internos existentes y títulos y descripciones dentro de los límites.

## Indexación: los 66 casos aprobados

Karla aprobó los **66 casos** el 18-nov-2026 junto con la biblioteca de salud. Los 16 casos nuevos (síndrome coronario agudo, trombosis venosa profunda, embolia pulmonar, diabetes gestacional, síndrome metabólico, sinusitis aguda, bronquiolitis, sepsis, pancreatitis aguda, cálculos renales, ACV isquémico, meningitis bacteriana, hepatitis C, dengue, cirrosis y apnea del sueño) salen `index,follow` y están en el sitemap; el catálogo también se indexa.

Cada slug queda registrado en `src/data/casosClinicos/revision.js` con `revisadoPorKarla('2026-11-18')`. Para un caso nuevo, se repite el mismo registro y se compila:

1. `npm.cmd run build`.
2. IndexNow con las URL aprobadas.
3. Solicitudes en Search Console para los casos nuevos.

## Búsquedas objetivo

Cada página apunta a «caso clínico de [enfermedad]», «caso clínico [enfermedad] resuelto» y «preguntas de [tema] farmacología». El catálogo apunta a «casos clínicos de farmacología», «examen de farmacología con respuestas» y «cuestionario de farmacología para practicar».

El HTML de cada caso trae unas 1.700 palabras, todas las preguntas con sus respuestas explicadas y un `Quiz` en JSON-LD.

## Lote 3: 34 casos restantes

Para completar los 50 nuevos, faltan 34. La lista de trabajo, sin repetir los 66 actuales:

- **Cardiovascular (5):** valvulopatía aórtica, endocarditis infecciosa, miocarditis, pericarditis, hipertensión pulmonar.
- **Endocrino (5):** hipogonadismo, síndrome de Cushing, hiperparatiroidismo, hipoparatiroidismo, tiroiditis subaguda.
- **Respiratorio (3):** derrame pleural, fibrosis quística, urticaria y angioedema.
- **Infecciosas (3):** hepatitis B, VIH, malaria.
- **Neurología (5):** hemorragia subaracnoidea, esclerosis múltiple, Alzheimer, neuropatía periférica, cefalea tensional.
- **Digestivo (3):** hepatitis alcohólica, colecistitis aguda, enfermedad inflamatoria intestinal.
- **Renal, reumatología y urgencias (6):** síndrome nefrótico, lupus eritematoso, vasculitis, pie diabético, osteomielitis, insuficiencia renal aguda.
- **Pediatría (4):** fiebre sin foco, deshidratación, convulsión febril, infección urinaria pediátrica.

Cada uno se escribe con el mismo estándar: 10 preguntas, tres tipos, referencias verificables y revisión clínica antes de indexar.

## Siguientes pasos

- Revisión de Karla e indexación por lotes.
- **Hecho 19-nov (03a7861):** 79 páginas del vademécum y 40 artículos muestran «Practica con un caso clínico» (servidor y React). El mapa se regenera con `node scripts/casos-enlaces-inversos.mjs` al agregar casos; la prueba falla si no coincide. IndexNow: 119 URL, HTTP 200.
- Agregar el catálogo a `/recursos-para-estudiantes-de-quimica-farmaceutica`.
- Medir en Search Console, con la página filtrada por `/casos-clinicos/`.
- Más casos con fuentes verificables: dengue, VIH, malaria e insulinoterapia hospitalaria. Necesitan guías de la OPS/OMS verificadas primero.

## Errores encontrados en referencias de las clases del aula (no corregidos)

Las clases son de otro bloque; aquí solo se documenta lo encontrado al verificar fuentes.

| Clase | Referencia citada | Problema |
|---|---|---|
| HTA: «HTA resistente…» y «Otros antihipertensivos…» | PATHWAY-2 con el PMID 26314530 | Ese PMID es otro artículo (CPAP en apnea del sueño). PATHWAY-2 es el 26414968 |
| IC: diuréticos de asa, resistencia diurética, ficha furosemida | «Furosemida Cinfa 40 mg», CIMA 22974 | El registro 22974 es Furantoína (nitrofurantoína) |
| Endocrina: «Levotiroxina: absorción…» | «Eutirox 50», CIMA 62319 | El registro 62319 es Captopril Alter |
| Endocrina: «Antitiroideos…» | «Tirodril 5 mg», CIMA 59127 | El registro 59127 es Zestril (lisinopril); Tirodril 5 mg es el 24700 |
| Endocrina: «Sulfonilureas y pioglitazona…» | Glibenclamida Normon, CIMA 58304 | La ficha da 404 |
| Endocrina: «Calcio, vitamina D y bisfosfonatos» | Alendronato semanal Normon, CIMA 65647 | La ficha da 404; una vigente es la 70911 |
| Respiratoria y asma/EPOC: GPC de EPOC | `GPC_Comp_EPOC.pdf` de MinSalud | La dirección da 404 |
