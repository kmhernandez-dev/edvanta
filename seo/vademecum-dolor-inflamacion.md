# Vademécum Edvanta: dolor e inflamación (1.000 keywords)

**Estado 16-nov-2026:** lote 1 escrito.
- 1 página de grupo, 7 monografías y 7 fichas para pacientes.
- Todo está en `noindex` hasta la revisión clínica de Karla.
- Las 7 fichas ya están en la cola `seo/revision-clinica/pre-revision.md`.

## Por qué este grupo

**Lo que ya posiciona.** Semrush (base Colombia, 16-nov) muestra que lo que ya posiciona en edvanta.co son las fichas «[medicamento] para qué sirve». La de diclofenaco trae 605 de las 622 visitas orgánicas estimadas del sitio (97 %). La de amoxicilina posiciona 15 keywords.

**La demanda.** Este grupo extiende ese mismo grupo temático con la demanda más alta y la dificultad más baja que no cubría el sitio:

| Fármaco | «… para qué sirve» (búsquedas al mes) | Término principal (búsquedas al mes) | KD del término principal |
|---|---|---|---|
| Etoricoxib | 27.100 | 90.500 | 53 |
| Meloxicam | 60.500 | 74.000 | 40 |
| Metocarbamol | 22.200 | 49.500 | 35 |
| Dipirona | 18.100 | 33.100 | 36 |
| Celecoxib | 9.900 | 27.100 | 43 |
| Tramadol | 8.100 | 22.200 | 65 |
| Ketorolaco | 4.400 | 14.800 | 37 |

**La alternativa que se descartó.** El grupo de corticoides también tiene demanda alta: prednisona 60.500 y prednisolona 22.200 búsquedas al mes. Este grupo se eligió primero porque se apoya en el diclofenaco, que ya trae casi todo el tráfico del sitio. Los corticoides quedan como candidatos para el siguiente grupo.

## Qué se publicó (lote 1)

| Página | URL |
|---|---|
| Grupo | `/vademecum/medicamentos-para-el-dolor-y-la-inflamacion` |
| Monografías | `/vademecum/meloxicam`, `/etoricoxib`, `/celecoxib`, `/ketorolaco`, `/dipirona`, `/tramadol`, `/metocarbamol` |
| Fichas para pacientes | `/articulos/[dci]-para-que-sirve` de los mismos 7 |

**Fuentes verificadas el 16-nov:**
- Fichas técnicas de CIMA (AEMPS).
- CUM del INVIMA: registros vigentes, presentaciones, concentraciones, marcas y combinaciones. Se consultó en datos.gov.co.
- En PubMed:
  - metaanálisis CNT 2013 (*Lancet*);
  - PRECISION 2016 (*N Engl J Med*);
  - MEDAL 2006 (*Lancet*);
  - Cashin 2021 (*BMJ*).

**Datos de Colombia que se usan en las páginas:**

| Dato | Detalle |
|---|---|
| Registros vigentes | Tramadol 61, meloxicam 60, etoricoxib 56, metocarbamol 33, dipirona 29, celecoxib 13 y ketorolaco 8 |
| Marcas registradas | Arcoxia, Celebrex, Novalgina y Tramal (Mobic no tiene registro) |
| Combinaciones registradas | Metocarbamol con ibuprofeno o con acetaminofén; tramadol con acetaminofén o con diclofenaco; dipirona con butilescopolamina |
| Concentraciones | Metocarbamol 750 mg; etoricoxib 30, 60, 90 y 120 mg; meloxicam 7,5 y 15 mg; celecoxib 100 y 200 mg |

**Huecos de búsqueda que se cubrieron con secciones nuevas:**
- Metocarbamol con ibuprofeno: unas 14.000 búsquedas al mes entre todas sus variantes.
- Tramadol con acetaminofén o con diclofenaco.
- Hioscina con dipirona.
- Etoricoxib de 60, 90 y 120 mg.
- Meloxicam de 7,5 y 15 mg.
- «¿Da sueño?».
- «¿La dipirona es un AINE?».

## Las 1.000 keywords

**Archivos:**
- Plan: `seo/vademecum-dolor-inflamacion-1000-keywords.csv`. Se genera con `node scripts/plan-keywords-dolor.mjs`.
- Fuente: `seo/semrush/dolor-inflamacion-co-2026-11-16.csv`.

**Composición:**
- **718 búsquedas reales de Semrush (Colombia):** suman 826.140 búsquedas al mes. Cada una está asignada a la página que la responde: la ficha, la monografía o el grupo.
- **282 términos profesionales sin volumen medido:** por ejemplo, «tramadol cyp2d6» o «celecoxib farmacocinética». Cada uno está asignado a la sección de la monografía que lo responde. En el CSV aparecen como «patrón».
- **Prioridad:** 68 son P1, 280 son P2 y 652 son P3.

**189 búsquedas excluidas, con su motivo:**
- veterinarias («meloxicam perros»);
- de precio, porque Edvanta no publica precios;
- oftálmicas;
- dietas y remedios naturales.

**12 búsquedas pendientes:**
- combinaciones que hay que verificar en el CUM antes de responderlas (meloxicam con esomeprazol, dipirona con cafeína, ketorolaco con tramadol);
- la presentación sublingual del ketorolaco.

## Cómo conecta con la venta

- **Profesionales:** las monografías y la sección «Para profesionales» de cada ficha llevan al curso propio y gratuito **Farmacología del Sistema Nervioso Central** (`/curso-de-farmacologia-del-sistema-nervioso-central`). El curso tiene las clases:
  - «AINE y paracetamol en el manejo del dolor: visión desde el SNC»;
  - «Receptores opioides, agonistas y agonistas parciales».

  El curso es gratis. El ingreso viene del certificado verificable y de llevar al profesional a las rutas de formación.
- **Pacientes:** la ficha resuelve la duda y enlaza a las fichas relacionadas: diclofenaco, ibuprofeno, naproxeno, acetaminofén, sertralina, losartán, enalapril y Buscapina. Así la sesión crece dentro del grupo temático.

## Cómo se mide

- **Lunes, Search Console:** filtrar las páginas con la expresión regular `meloxicam|etoricoxib|celecoxib|ketorolaco|dipirona|tramadol|metocarbamol|dolor-y-la-inflamacion`. Anotar en `seo/medicion.md` las consultas con impresiones, los clics y la posición.
- **Semrush, proyecto edvanta.co:** keywords orgánicas del dominio. Hoy son 347 en total; en la base de Colombia, unas 100 repartidas en 40 páginas.
- **Atribución:** visitas del curso de Farmacología del SNC que llegan desde `/vademecum/` y `/articulos/*-para-que-sirve`.

### Qué esperar y qué justificaría invertir más

**Mañana no se puede llegar a 1.000 keywords con este lote.** Hay tres pasos que no dependen de escribir más:
1. Karla debe revisar las páginas para que pasen a `index`.
2. Google debe rastrearlas e indexarlas. Hoy ese es el cuello de botella, según `seo/medicion.md`.
3. Semrush tarda días o semanas en reflejar las posiciones nuevas.

**Lo que sí acelera:**
1. Revisión de Karla de las 15 páginas de este lote y de las 15 de antimicrobianos que siguen en `noindex`.
2. Despliegue y aviso por IndexNow.
3. Solicitud de indexación en Search Console de las 7 fichas (cuota de unas 10 al día).

**Indicadores a los 30 días de indexar el lote:**
- **Acelerar** (lote 2 de este grupo y corticoides) si se cumple una de estas condiciones:
  - 200 o más consultas con impresiones en el grupo;
  - las 7 fichas en el top 20 de su «para qué sirve».
- **Pausar y revisar la indexación** si hay menos de 50 consultas con impresiones.

## Siguiente paso

1. **Karla:** revisar las 7 fichas (cola en `seo/revision-clinica/pre-revision.md`), las 7 monografías y la página del grupo. Anotar la revisión en `src/data/revisionClinica.js` y en `REVISION_VADEMECUM`.
2. **Claude Code:**
   - lote 2: monografías de diclofenaco, ibuprofeno, naproxeno y acetaminofén, que ya tienen ficha para pacientes que posiciona;
   - verificar las 12 búsquedas pendientes.
3. **Despliegue:** al aprobarse, enviar IndexNow y pedir la indexación en Search Console.
