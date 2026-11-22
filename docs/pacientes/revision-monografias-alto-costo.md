# Revisión clínica: 51 monografías oncológicas de alto costo

**Aprobadas por Karla el 22-nov-2026** («revisadas»). La revisión quedó en `REVISION_VADEMECUM` (`src/data/revisionClinica.js`) y las monografías son indexables y entran al sitemap.

Cada monografía une la ficha para pacientes ya aprobada el 21-nov-2026 con datos profesionales tomados de la ficha técnica de CIMA (ATC, mecanismo, farmacocinética, posología, advertencias, interacciones y estudios) y el CUM del INVIMA (consulta del 21-nov-2026). Para corregir una, se edita su registro en `src/data/vademecum/altoCosto/` y se ejecutan las pruebas.

## Qué revisar en cada una

- Posología: dosis, frecuencia y ajustes de la tabla.
- Advertencias e interacciones: que la acción indicada coincida con la ficha técnica.
- Estudios: nombre, población y diseño.
- Atención farmacéutica: los problemas relacionados con la farmacoterapia y el plan.

## Inmunoterapia (4)

| Monografía | Ficha técnica (CIMA) | Revisada |
|---|---|---|
| [Nivolumab](https://edvanta.co/vademecum/nivolumab) | [Opdivo 10 mg/ml concentrado para solución para perfusión](https://cima.aemps.es/cima/dochtml/ft/1151014001/FT_1151014001.html) | [x] |
| [Atezolizumab](https://edvanta.co/vademecum/atezolizumab) | [Tecentriq 1200 mg concentrado para solución para perfusión](https://cima.aemps.es/cima/dochtml/ft/1171220001/FT_1171220001.html) | [x] |
| [Durvalumab](https://edvanta.co/vademecum/durvalumab) | [Imfinzi 50 mg/ml concentrado para solución para perfusión](https://cima.aemps.es/cima/dochtml/ft/1181322001/FT_1181322001.html) | [x] |
| [Ipilimumab](https://edvanta.co/vademecum/ipilimumab) | [Yervoy 5 mg/ml concentrado para solución para perfusión](https://cima.aemps.es/cima/dochtml/ft/11698001/FT_11698001.html) | [x] |

## Hormonoterapia (5)

| Monografía | Ficha técnica (CIMA) | Revisada |
|---|---|---|
| [Tamoxifeno](https://edvanta.co/vademecum/tamoxifeno) | [Tamoxifeno Cinfa 10 mg comprimidos EFG](https://cima.aemps.es/cima/dochtml/ft/63754/FT_63754.html) | [x] |
| [Letrozol](https://edvanta.co/vademecum/letrozol) | [Femara 2,5 mg comprimidos recubiertos con película](https://cima.aemps.es/cima/dochtml/ft/61628/FT_61628.html) | [x] |
| [Anastrozol](https://edvanta.co/vademecum/anastrozol) | [Arimidex 1 mg comprimidos recubiertos con película](https://cima.aemps.es/cima/dochtml/ft/61286/FT_61286.html) | [x] |
| [Enzalutamida](https://edvanta.co/vademecum/enzalutamida) | [Xtandi 40 mg comprimidos recubiertos con película](https://cima.aemps.es/cima/dochtml/ft/113846002/FT_113846002.html) | [x] |
| [Abiraterona](https://edvanta.co/vademecum/abiraterona) | [Zytiga 500 mg comprimidos recubiertos con película](https://cima.aemps.es/cima/dochtml/ft/111714003/FT_111714003.html) | [x] |

## Terapias dirigidas (25)

| Monografía | Ficha técnica (CIMA) | Revisada |
|---|---|---|
| [Trastuzumab deruxtecán](https://edvanta.co/vademecum/trastuzumab-deruxtecan) | [Enhertu 100 mg polvo para concentrado para solución para perfusión](https://cima.aemps.es/cima/dochtml/ft/1201508001/FT_1201508001.html) | [x] |
| [Pertuzumab](https://edvanta.co/vademecum/pertuzumab) | [Perjeta 420 mg concentrado para solución para perfusión](https://cima.aemps.es/cima/dochtml/ft/113813001/FT_113813001.html) | [x] |
| [Bevacizumab](https://edvanta.co/vademecum/bevacizumab) | [Avastin 25 mg/ml concentrado para solución para perfusión](https://cima.aemps.es/cima/dochtml/ft/04300001/FT_04300001.html) | [x] |
| [Cetuximab](https://edvanta.co/vademecum/cetuximab) | [Erbitux 5 mg/ml solución para perfusión](https://cima.aemps.es/cima/dochtml/ft/04281003/FT_04281003.html) | [x] |
| [Rituximab](https://edvanta.co/vademecum/rituximab) | [MabThera 100 mg concentrado para solución para perfusión](https://cima.aemps.es/cima/dochtml/ft/98067001/FT_98067001.html) | [x] |
| [Daratumumab](https://edvanta.co/vademecum/daratumumab) | [Darzalex 20 mg/ml concentrado para solución para perfusión](https://cima.aemps.es/cima/dochtml/ft/1161101001/FT_1161101001.html) | [x] |
| [Carfilzomib](https://edvanta.co/vademecum/carfilzomib) | [Kyprolis 10 mg polvo para solución para perfusión](https://cima.aemps.es/cima/dochtml/ft/1151060002/FT_1151060002.html) | [x] |
| [Bortezomib](https://edvanta.co/vademecum/bortezomib) | [Velcade 3,5 mg polvo para solución inyectable](https://cima.aemps.es/cima/dochtml/ft/04274001/FT_04274001.html) | [x] |
| [Nilotinib](https://edvanta.co/vademecum/nilotinib) | [Tasigna 150 mg cápsulas duras](https://cima.aemps.es/cima/dochtml/ft/07422006/FT_07422006.html) | [x] |
| [Dasatinib](https://edvanta.co/vademecum/dasatinib) | [Sprycel 50 mg comprimidos recubiertos con película](https://cima.aemps.es/cima/dochtml/ft/06363005/FT_06363005.html) | [x] |
| [Osimertinib](https://edvanta.co/vademecum/osimertinib) | [Tagrisso 40 mg comprimidos recubiertos con película](https://cima.aemps.es/cima/dochtml/ft/1161086001/FT_1161086001.html) | [x] |
| [Palbociclib](https://edvanta.co/vademecum/palbociclib) | [Ibrance 100 mg cápsulas duras](https://cima.aemps.es/cima/dochtml/ft/1161147003/FT_1161147003.html) | [x] |
| [Ribociclib](https://edvanta.co/vademecum/ribociclib) | [Kisqali 200 mg comprimidos recubiertos con película](https://cima.aemps.es/cima/dochtml/ft/1171221001/FT_1171221001.html) | [x] |
| [Abemaciclib](https://edvanta.co/vademecum/abemaciclib) | [Verzenios 100 mg comprimidos recubiertos con película](https://cima.aemps.es/cima/dochtml/ft/1181307013/FT_1181307013.html) | [x] |
| [Lenalidomida](https://edvanta.co/vademecum/lenalidomida) | [Revlimid 10 mg cápsulas duras](https://cima.aemps.es/cima/dochtml/ft/07391002/FT_07391002.html) | [x] |
| [Pomalidomida](https://edvanta.co/vademecum/pomalidomida) | [Imnovid 3 mg cápsulas duras](https://cima.aemps.es/cima/dochtml/ft/113850003/FT_113850003.html) | [x] |
| [Ibrutinib](https://edvanta.co/vademecum/ibrutinib) | [Imbruvica 140 mg cápsulas duras](https://cima.aemps.es/cima/dochtml/ft/114945001/FT_114945001.html) | [x] |
| [Venetoclax](https://edvanta.co/vademecum/venetoclax) | [Venclyxto 100 mg comprimidos recubiertos con película](https://cima.aemps.es/cima/dochtml/ft/161138005/FT_161138005.html) | [x] |
| [Olaparib](https://edvanta.co/vademecum/olaparib) | [Lynparza 100 mg comprimidos recubiertos con película](https://cima.aemps.es/cima/dochtml/ft/114959002/FT_114959002.html) | [x] |
| [Ruxolitinib](https://edvanta.co/vademecum/ruxolitinib) | [Jakavi 10 mg comprimidos](https://cima.aemps.es/cima/dochtml/ft/112773015/FT_112773015.html) | [x] |
| [Everolimus](https://edvanta.co/vademecum/everolimus) | [Afinitor 10 mg comprimidos](https://cima.aemps.es/cima/dochtml/ft/09538004/FT_09538004.html) | [x] |
| [Sunitinib](https://edvanta.co/vademecum/sunitinib) | [Sutent 12,5 mg cápsulas duras](https://cima.aemps.es/cima/dochtml/ft/06347001/FT_06347001.html) | [x] |
| [Sorafenib](https://edvanta.co/vademecum/sorafenib) | [Nexavar 200 mg comprimidos recubiertos con película](https://cima.aemps.es/cima/dochtml/ft/06342001/FT_06342001.html) | [x] |
| [Lenvatinib](https://edvanta.co/vademecum/lenvatinib) | [Lenvima 10 mg cápsulas duras](https://cima.aemps.es/cima/dochtml/ft/1151002002/FT_1151002002.html) | [x] |
| [Cabozantinib](https://edvanta.co/vademecum/cabozantinib) | [Cabometyx 20 mg comprimidos recubiertos con película](https://cima.aemps.es/cima/dochtml/ft/1161136002/FT_1161136002.html) | [x] |

## Quimioterapia (15)

| Monografía | Ficha técnica (CIMA) | Revisada |
|---|---|---|
| [Capecitabina](https://edvanta.co/vademecum/capecitabina) | [Capecitabina Glenmark 150 mg comprimidos recubiertos con película EFG](https://cima.aemps.es/cima/dochtml/ft/84871/FT_84871.html) | [x] |
| [Docetaxel](https://edvanta.co/vademecum/docetaxel) | [Docetaxel Glenmark 20 mg/1 ml concentrado para solución para perfusión EFG](https://cima.aemps.es/cima/dochtml/ft/85174/FT_85174.html) | [x] |
| [Paclitaxel](https://edvanta.co/vademecum/paclitaxel) | [Paclitaxel Accord 6 mg/ml concentrado para solución para perfusión EFG](https://cima.aemps.es/cima/dochtml/ft/73010/FT_73010.html) | [x] |
| [Carboplatino](https://edvanta.co/vademecum/carboplatino) | [Carboplatino Pharmacia 10 mg/ml concentrado para solución para perfusión EFG](https://cima.aemps.es/cima/dochtml/ft/62123/FT_62123.html) | [x] |
| [Cisplatino](https://edvanta.co/vademecum/cisplatino) | [Cisplatino Pharmacia 1 mg/ml concentrado para solución para perfusión EFG](https://cima.aemps.es/cima/dochtml/ft/62107/FT_62107.html) | [x] |
| [Doxorrubicina](https://edvanta.co/vademecum/doxorrubicina) | [Doxorubicina Accord 2 mg/ml concentrado para solución para perfusión EFG](https://cima.aemps.es/cima/dochtml/ft/73266/FT_73266.html) | [x] |
| [Ciclofosfamida](https://edvanta.co/vademecum/ciclofosfamida) | [Ciclofosfamida Dr. Reddys 500 mg/ml concentrado para solución inyectable y para perfusión](https://cima.aemps.es/cima/dochtml/ft/86548/FT_86548.html) | [x] |
| [Oxaliplatino](https://edvanta.co/vademecum/oxaliplatino) | [Oxaliplatino Accord 5 mg/ml concentrado para solución para perfusión EFG](https://cima.aemps.es/cima/dochtml/ft/72386/FT_72386.html) | [x] |
| [Azacitidina](https://edvanta.co/vademecum/azacitidina) | [Vidaza 25 mg/ml polvo para suspensión inyectable](https://cima.aemps.es/cima/dochtml/ft/08488001/FT_08488001.html) | [x] |
| [Gemcitabina](https://edvanta.co/vademecum/gemcitabina) | [Gemcitabina Hospira 1000 mg concentrado para solución para perfusión](https://cima.aemps.es/cima/dochtml/ft/74082/FT_74082.html) | [x] |
| [Irinotecán](https://edvanta.co/vademecum/irinotecan) | [Irinotecán Glenmark 20 mg/ml concentrado para solución para perfusión EFG](https://cima.aemps.es/cima/dochtml/ft/88929/FT_88929.html) | [x] |
| [Fluorouracilo](https://edvanta.co/vademecum/fluorouracilo) | [Fluorouracilo Accord 50 mg/ml solución inyectable o para perfusión EFG](https://cima.aemps.es/cima/dochtml/ft/71868/FT_71868.html) | [x] |
| [Pemetrexed](https://edvanta.co/vademecum/pemetrexed) | [Alimta 100 mg polvo para concentrado para solución para perfusión](https://cima.aemps.es/cima/dochtml/ft/04290002/FT_04290002.html) | [x] |
| [Temozolomida](https://edvanta.co/vademecum/temozolomida) | [Temodal 100 mg cápsulas duras](https://cima.aemps.es/cima/dochtml/ft/98096015/FT_98096015.html) | [x] |
| [Hidroxicarbamida (hidroxiurea)](https://edvanta.co/vademecum/hidroxicarbamida) | [Hydrea 500 mg cápsulas duras](https://cima.aemps.es/cima/dochtml/ft/61633/FT_61633.html) | [x] |

## Soporte (2)

| Monografía | Ficha técnica (CIMA) | Revisada |
|---|---|---|
| [Filgrastim](https://edvanta.co/vademecum/filgrastim) | [Neupogen 30 MU (0,6 mg/ml) solución inyectable en jeringa precargada](https://cima.aemps.es/cima/dochtml/ft/64314/FT_64314.html) | [x] |
| [Pegfilgrastim](https://edvanta.co/vademecum/pegfilgrastim) | [Neulasta 6 mg solución inyectable](https://cima.aemps.es/cima/dochtml/ft/02227004/FT_02227004.html) | [x] |

