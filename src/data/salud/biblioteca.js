/**
 * Biblioteca de salud: 200 artículos «para qué sirve».
 *
 * Cada línea: slug|nombre|categoría|para qué sirve|precauciones|evidencia.
 * Son resúmenes educativos, sin dosis ni promesas de cura. Se indexan
 * solo después de la revisión clínica (REVISION_BIBLIOTECA).
 */

const raw = `
manzanilla|Manzanilla|planta|Se usa tradicionalmente para molestias digestivas leves, nerviosismo y como ayuda para dormir.|Alergia a la familia de las margaritas; puede interactuar con anticoagulantes.|Evidencia limitada y de baja calidad para la mayoría de usos.
menta|Menta|planta|Se usa para molestias digestivas, gases y como saborizante; el aceite puede aliviar la cefalea tensional aplicado en las sienes.|Reflujo y hernia hiatal; evitar aceite esencial en niños pequeños y cerca de la cara.|Evidencia moderada para el aceite de menta en colon irritable.
hierbabuena|Hierbabuena|planta|Se usa como digestivo y para refrescar el aliento; en infusión puede ayudar con gases leves.|Puede empeorar el reflujo; evitar en niños pequeños por riesgo de espasmo.|Evidencia limitada; se considera segura en infusión.
jengibre|Jengibre|planta|Se usa para náuseas, incluida la del embarazo y el mareo, y como antiinflamatorio tradicional.|Puede aumentar el riesgo de sangrado con anticoagulantes; moderar en reflujo.|Evidencia moderada para náuseas del embarazo y mareo.
curcuma|Cúrcuma|planta|Se usa como antiinflamatorio tradicional en artritis y molestias digestivas.|Puede interactuar con anticoagulantes y reducir la absorción de hierro; evitar en cálculos biliares.|Evidencia limitada; los suplementos concentrados no son innocuos.
ajo|Ajo|planta|Se usa tradicionalmente para presión alta, colesterol y defensas; el ajo crudo tiene efecto antiagregante.|Riesgo de sangrado con anticoagulantes; puede causar reflujo y aliento fuerte.|Evidencia moderada para presión arterial; pequeña para lípidos.
cebolla|Cebolla|planta|Se usa como alimento y remedio tradicional para tos y congestión; aporta compuestos azufrados.|Puede irritar el estómago y empeorar el reflujo; no sustituye antibióticos.|Evidencia limitada para usos medicinales.
canela|Canela|planta|Se usa para gases, diarrea leve y control glucémico tradicional; aporta sabor sin azúcar.|La canela de Cassia tiene cumarina y puede dañar el hígado en dosis altas; moderar.|Evidencia limitada y variable según la especie.
clavo|Clavo|planta|Se usa para dolor dental y molestias digestivas; el aceite tiene efecto anestésico local.|El aceite esencial es irritante y tóxico si se ingiere; no usar en niños.|Evidencia limitada; usar con precaución.
oregano|Orégano|planta|Se usa como antimicrobiano tradicional y para molestias respiratorias; el aceite se usa en aromaterapia.|El aceite esencial no se ingiere sin indicación; puede irritar la piel.|Evidencia limitada; no sustituye antibióticos.
tomillo|Tomillo|planta|Se usa para tos, congestión y molestias digestivas; contiene timol.|El aceite esencial es irritante y tóxico en dosis altas; evitar en embarazo.|Evidencia limitada para usos respiratorios.
romero|Romero|planta|Se usa para mejorar la concentración, molestias digestivas y dolor muscular en uso tópico.|El aceite esencial puede provocar convulsiones en dosis altas; evitar en embarazo y epilepsia.|Evidencia limitada y contradictoria.
albahaca|Albahaca|planta|Se usa para molestias digestivas, estrés y como condimento; el aceite se usa en aromaterapia.|El aceite esencial no se ingiere sin indicación; puede irritar la piel.|Evidencia limitada.
laurel|Laurel|planta|Se usa como condimento y remedio tradicional para gases y molestias digestivas.|El aceite esencial es irritante; no ingerir en dosis altas.|Evidencia limitada.
hinojo|Hinojo|planta|Se usa para gases, cólicos y molestias digestivas; el té es tradicional después de comer.|El aceite esencial no se usa en niños pequeños; puede interactuar con anticoagulantes.|Evidencia limitada.
anis|Anís|planta|Se usa para gases, cólicos y mal aliento; su sabor ayuda a tolerar infusiones.|El aceite esencial puede ser tóxico; evitar en niños y embarazo.|Evidencia limitada.
comino|Comino|planta|Se usa como condimento y para gases y digestión lenta.|Puede irritar el reflujo; moderar en gastritis.|Evidencia limitada.
valeriana|Valeriana|planta|Se usa para insomnio y ansiedad leve; es una de las plantas sedantes más estudiadas.|Puede causar somnolencia y interactuar con sedantes; no combinar con alcohol.|Evidencia limitada a moderada para insomnio.
pasiflora|Pasiflora|planta|Se usa para ansiedad leve, nerviosismo e insomnio.|Puede aumentar la somnolencia con sedantes; evitar en embarazo.|Evidencia limitada.
melisa|Melisa|planta|Se usa para nerviosismo, insomnio y molestias digestivas; también en herpes labial tópico.|Puede interactuar con sedantes y tiroides; evitar en embarazo.|Evidencia limitada.
lavanda|Lavanda|planta|Se usa en aromaterapia para ansiedad y sueño; el aceite tópico puede calmar picaduras.|El aceite esencial no se ingiere; puede irritar la piel y no usar en niños pequeños.|Evidencia limitada a moderada para ansiedad.
tila|Tila|planta|Se usa como infusión para nerviosismo y para facilitar el sueño.|Puede potenciar sedantes; evitar en embarazo y lactancia.|Evidencia limitada.
boldo|Boldo|planta|Se usa para molestias digestivas y como colerético tradicional.|Puede dañar el hígado en dosis altas o uso prolongado; evitar en embarazo.|Evidencia limitada y riesgo hepático.
alcachofa|Alcachofa|planta|Se usa para digestión, colesterol y como alimento rico en fibra.|Puede causar gases; evitar en obstrucción biliar.|Evidencia limitada para extractos.
cardo-mariano|Cardo mariano|planta|Se usa tradicionalmente para proteger el hígado y en molestias digestivas.|Puede interactuar con antidiabéticos y algunos medicamentos hepáticos.|Evidencia limitada y heterogénea.
diente-de-leon|Diente de león|planta|Se usa como diurético suave y para digestión; las hojas son alimento.|Puede interactuar con diuréticos y litio; evitar en cálculos biliares.|Evidencia limitada.
ortiga|Ortiga|planta|Se usa para molestias urinarias, alergias y dolor articular; la raíz se usa en próstata.|Puede interactuar con diuréticos, anticoagulantes y antihipertensivos.|Evidencia limitada.
cola-de-caballo|Cola de caballo|planta|Se usa como diurético suave y para uñas y cabello; aporta sílice.|Puede bajar el potasio y interactuar con diuréticos; evitar en edema cardíaco.|Evidencia limitada.
equinacea|Equinácea|planta|Se usa para acortar resfriados y estimular defensas de forma tradicional.|Puede interactuar con inmunosupresores; evitar en enfermedades autoinmunes.|Evidencia limitada y resultados inconsistentes.
ginseng|Ginseng|planta|Se usa para fatiga, energía y concentración; se estudia en diabetes y función sexual.|Puede interactuar con anticoagulantes y antidiabéticos; evitar en hipertensión no controlada.|Evidencia limitada.
ashwagandha|Ashwagandha|planta|Se usa para estrés, sueño y rendimiento físico; es un adaptógeno tradicional.|Puede afectar tiroides, hígado y embarazo; interactúa con sedantes.|Evidencia limitada y estudios pequeños.
maca|Maca|planta|Se usa para energía, fertilidad y menopausia; es un alimento andino.|Puede afectar tiroides y presión; evitar en embarazo y cáncer hormonodependiente.|Evidencia limitada.
moringa|Moringa|planta|Se usa como alimento nutritivo y para anemia y lactancia de forma tradicional.|Puede interactuar con diabetes, presión y tiroides; evitar en embarazo.|Evidencia limitada.
espirulina|Espirulina|planta|Se usa como suplemento proteico y antioxidante; puede ayudar en lípidos y glucosa.|Riesgo de contaminación; evitar en fenilcetonuria y enfermedades autoinmunes.|Evidencia limitada.
aloe-vera|Aloe vera|planta|Se usa en gel tópico para quemaduras leves y sequedad; el látex oral es laxante.|El látex oral puede causar diarrea y dolor; evitar en embarazo y niños.|Evidencia limitada para gel tópico.
llanten|Llantén|planta|Se usa para tos, irritación de garganta y picaduras en uso tópico.|Puede interactuar con anticoagulantes y diuréticos; evitar en obstrucción intestinal.|Evidencia limitada.
malva|Malva|planta|Se usa para irritación de garganta, tos y molestias digestivas en infusión.|Puede reducir la absorción de medicamentos orales; separar.|Evidencia limitada.
calendula|Caléndula|planta|Se usa en cremas para irritación de piel, heridas leves y dermatitis.|Evidencia limitada; evitar en alergia a la familia de las margaritas.|Evidencia limitada para uso tópico.
arnica|Árnica|planta|Se usa en gel o crema para golpes, moretones y dolor muscular.|No ingerir; no aplicar en heridas abiertas ni en embarazo.|Evidencia limitada para uso tópico.
hamamelis|Hamamelis|planta|Se usa en cremas para hemorroides, varices y piel irritada.|Evidencia limitada; evitar en alergia y no ingerir.|Evidencia limitada.
te-verde|Té verde|planta|Se usa como antioxidante, para concentración y control de peso; contiene cafeína.|Puede interferir con hierro y anticoagulantes; moderar en embarazo.|Evidencia limitada a moderada.
te-negro|Té negro|planta|Se usa como bebida estimulante y para concentración; contiene cafeína y taninos.|Puede reducir la absorción de hierro; moderar en anemia y reflujo.|Evidencia limitada.
cafe|Café|planta|Se usa como estimulante y para alerta; se estudia en enfermedad hepática y diabetes.|Puede aumentar ansiedad, presión y reflujo; moderar en embarazo.|Evidencia moderada para alerta y algunas enfermedades.
cacao|Cacao|planta|Se usa como alimento y para estado de ánimo; el chocolate negro aporta flavonoides.|Alto en calorías y grasa; moderar en reflujo y migraña.|Evidencia limitada para cacao y ánimo.
guarana|Guaraná|planta|Se usa como estimulante y para fatiga por su cafeína.|Puede aumentar presión y ansiedad; evitar en arritmias y embarazo.|Evidencia limitada.
yerba-mate|Yerba mate|planta|Se usa como bebida estimulante y para concentración; aporta polifenoles.|Puede irritar el estómago y aumentar presión; moderar en embarazo.|Evidencia limitada.
stevia|Stevia|planta|Se usa como edulcorante natural sin calorías.|Puede tener sabor amargo; no sustituye el control de la diabetes.|Evidencia moderada como edulcorante.
chia|Chía|planta|Se usa por su fibra, omega-3 vegetal y saciedad; forma gel en agua.|Puede atragantar si se toma seca; beber suficiente agua.|Evidencia limitada para pérdida de peso.
lino|Lino|planta|Se usa para estreñimiento y sofocos; aporta fibra y lignanos.|Requiere agua; puede interactuar con medicamentos y reducir absorción.|Evidencia moderada para estreñimiento.
avena|Avena|planta|Se usa por su fibra beta-glucano para colesterol y saciedad.|Puede interactuar con medicamentos orales; separar.|Evidencia moderada para colesterol.
quinoa|Quinoa|planta|Se usa como alimento proteico y sin gluten; aporta fibra y minerales.|Puede irritar el intestino si no se enjuaga; moderar en dieta renal.|Evidencia limitada; alimento nutritivo.
sauco|Sauco|planta|Se usa para resfriados y gripe; el jarabe es tradicional.|Las hojas y tallos crudos son tóxicos; usar solo fruto cocido.|Evidencia limitada.
eucalipto|Eucalipto|planta|Se usa para tos y congestión en infusiones o vapor; el aceite es descongestionante.|El aceite esencial no se ingiere; tóxico en niños pequeños.|Evidencia limitada.
poleo|Poleo|planta|Se usa para gases, digestión y resfriados.|El aceite es tóxico; evitar en embarazo y niños pequeños.|Evidencia limitada.
salvia|Salvia|planta|Se usa para sudoración, molestias de garganta y digestión; también en menopausia.|Puede interactuar con sedantes y anticonvulsivantes; evitar en embarazo.|Evidencia limitada.
toronjil|Toronjil|planta|Se usa para nerviosismo, insomnio y molestias digestivas.|Puede potenciar sedantes; evitar en embarazo.|Evidencia limitada.
cedron|Cedrón|planta|Se usa como sedante suave y para molestias digestivas.|Puede potenciar sedantes; evitar en embarazo.|Evidencia limitada.
chancapiedra|Chancapiedra|planta|Se usa tradicionalmente para cálculos renales y molestias urinarias.|Puede interactuar con diuréticos y litio; evitar en embarazo.|Evidencia limitada.
una-de-gato|Uña de gato|planta|Se usa para inflamación y defensas de forma tradicional.|Puede interactuar con inmunosupresores y anticoagulantes; evitar en embarazo.|Evidencia limitada.
graviola|Graviola|planta|Se usa tradicionalmente para molestias digestivas y defensas.|No se debe usar para cáncer; puede causar neurotoxicidad.|Evidencia insuficiente y riesgos.
noni|Noni|planta|Se usa como antioxidante y para defensas de forma tradicional.|Puede dañar el hígado; evitar en embarazo y con medicamentos hepáticos.|Evidencia limitada.
acai|Açaí|planta|Se usa como antioxidante y alimento; aporta antocianinas.|Puede interactuar con anticoagulantes; moderar en diabetes.|Evidencia limitada.
goji|Goji|planta|Se usa como antioxidante y para defensas; es un fruto.|Puede interactuar con anticoagulantes y diabetes; evitar en embarazo.|Evidencia limitada.
arandano|Arándano|planta|Se usa para infecciones urinarias y salud visual; aporta antocianinas.|Puede interactuar con anticoagulantes; no sustituye antibióticos.|Evidencia limitada a moderada para cistitis recurrente.
cranberry|Cranberry|planta|Se usa para prevenir infecciones urinarias; contiene proantocianidinas.|Puede interactuar con anticoagulantes; evitar en cálculos renales.|Evidencia moderada para prevención de cistitis.
granada|Granada|planta|Se usa como antioxidante y para salud cardiovascular; es un fruto.|Puede interactuar con anticoagulantes y presión; moderar.|Evidencia limitada.
olivo|Olivo|planta|Se usa la hoja para presión y colesterol de forma tradicional.|Puede bajar la presión y glucosa; interactúa con antihipertensivos.|Evidencia limitada.
ginkgo|Ginkgo|planta|Se usa para memoria, circulación y tinnitus; es uno de los fitoterápicos más estudiados.|Aumenta riesgo de sangrado; interactúa con anticoagulantes y anticonvulsivantes.|Evidencia limitada y contradictoria.
saw-palmetto|Saw palmetto|planta|Se usa para síntomas urinarios benignos de la próstata.|Puede interactuar con anticoagulantes y antihipertensivos; no sustituye evaluación.|Evidencia limitada.
uva-ursi|Uva ursi|planta|Se usa para infecciones urinarias no complicadas de forma tradicional.|No usar más de una semana; puede dañar el hígado y el riñón.|Evidencia limitada.
vitamina-a|Vitamina A|vitamina|Se usa para visión, piel e inmunidad; trata deficiencia y se usa en algunas dermatosis.|Teratogénica en dosis altas; evitar suplementos en embarazo sin control.|Evidencia sólida para deficiencia.
vitamina-b1|Vitamina B1 (tiamina)|vitamina|Se usa para prevenir y tratar deficiencia, alcoholismo y neuropatía.|Dosis altas pueden causar reacciones; usar con indicación.|Evidencia sólida para deficiencia.
vitamina-b2|Vitamina B2 (riboflavina)|vitamina|Se usa para deficiencia, migraña y metabolismo energético.|Orina amarilla es normal; dosis altas rara vez causan problemas.|Evidencia limitada para migraña.
vitamina-b3|Vitamina B3 (niacina)|vitamina|Se usa para deficiencia y lípidos; la niacina puede subir el HDL.|Puede causar rubor, picor y daño hepático; no automedicar.|Evidencia sólida para deficiencia y lípidos.
vitamina-b5|Vitamina B5 (pantoténico)|vitamina|Se usa para deficiencia y metabolismo; se promociona para piel y cabello.|Evidencia limitada para cabello; puede causar diarrea.|Evidencia limitada fuera de deficiencia.
vitamina-b6|Vitamina B6 (piridoxina)|vitamina|Se usa para deficiencia, náuseas del embarazo y neuropatía.|Dosis altas causan neuropatía; no superar sin control.|Evidencia moderada para náuseas del embarazo.
biotina|Biotina (B7)|vitamina|Se usa para deficiencia y se promociona para cabello y uñas.|Puede alterar pruebas de tiroides y troponina; suspender antes.|Evidencia limitada para cabello en personas sin deficiencia.
acido-folico|Ácido fólico (B9)|vitamina|Se usa antes y durante el embarazo para prevenir defectos del tubo neural.|Puede enmascarar deficiencia de B12; no sustituir evaluación.|Evidencia sólida en embarazo.
vitamina-b12|Vitamina B12|vitamina|Se usa para deficiencia, anemia megaloblástica y neuropatía; es clave en veganos.|Puede interactuar con metformina y omeprazol; no retrasar diagnóstico.|Evidencia sólida para deficiencia.
vitamina-c|Vitamina C|vitamina|Se usa para deficiencia, escorbuto y como antioxidante; ayuda a absorber hierro.|Dosis altas causan diarrea y cálculos en predispuestos.|Evidencia limitada para resfriados.
vitamina-d|Vitamina D|vitamina|Se usa para deficiencia, hueso, caídas y algunas enfermedades; se mide en sangre.|Dosis altas causan hipercalcemia; no usar dosis de choque sin control.|Evidencia sólida para deficiencia y hueso.
vitamina-e|Vitamina E|vitamina|Se usa como antioxidante y para deficiencia; se estudia en hígado graso.|Aumenta riesgo de sangrado; evitar dosis altas con anticoagulantes.|Evidencia limitada fuera de deficiencia.
vitamina-k|Vitamina K|vitamina|Se usa para coagulación, deficiencia y recién nacidos.|Interactúa con warfarina; no cambiar sin control del INR.|Evidencia sólida para deficiencia y coagulación.
calcio|Calcio|vitamina|Se usa para hueso, deficiencia y prevención de osteoporosis.|Exceso puede causar cálculos y estreñimiento; separar de hierro y levotiroxina.|Evidencia moderada para hueso.
hierro|Hierro|vitamina|Se usa para anemia ferropénica y deficiencia; requiere diagnóstico.|Puede causar estreñimiento y náuseas; sobredosis es grave en niños.|Evidencia sólida para anemia ferropénica.
magnesio|Magnesio|vitamina|Se usa para deficiencia, calambres, estreñimiento y migraña.|Puede causar diarrea y afectar riñón; interactúa con antibióticos.|Evidencia limitada a moderada.
zinc|Zinc|vitamina|Se usa para deficiencia, diarrea en niños y cicatrización; apoya inmunidad.|Dosis altas causan náuseas y reducen cobre; no usar con antibióticos sin separar.|Evidencia moderada para deficiencia y diarrea.
selenio|Selenio|vitamina|Se usa para deficiencia y función tiroidea; es antioxidante.|Dosis altas causan caída de cabello y daño neurológico.|Evidencia limitada fuera de deficiencia.
yodo|Yodo|vitamina|Se usa para deficiencia, tiroides y embarazo; la sal yodada es la fuente habitual.|Exceso puede alterar la tiroides; evitar suplementos sin control.|Evidencia sólida en deficiencia.
potasio|Potasio|vitamina|Se usa para deficiencia y electrolitos; es esencial para corazón y músculo.|Puede causar hiperpotasemia grave; no suplementar sin control.|Evidencia sólida para deficiencia.
omega-3|Omega-3|suplemento|Se usa para triglicéridos, inflamación y salud cardiovascular; DHA y EPA son los activos.|Dosis altas aumentan sangrado; puede interactuar con anticoagulantes.|Evidencia moderada para triglicéridos.
colageno|Colágeno|suplemento|Se usa para piel, articulaciones y hueso; se hidroliza en péptidos.|Evidencia limitada; puede causar molestias digestivas.|Evidencia limitada.
glucosamina|Glucosamina|suplemento|Se usa para artrosis y dolor articular; se combina con condroitina.|Puede interactuar con anticoagulantes y afectar glucosa; evitar en alergia a mariscos.|Evidencia limitada y variable.
melatonina|Melatonina|suplemento|Se usa para insomnio, desfase horario y ritmo circadiano.|Puede causar somnolencia y interactuar con sedantes; no usar en embarazo.|Evidencia limitada a moderada.
creatina|Creatina|suplemento|Se usa para fuerza, masa muscular y rendimiento; también se estudia en cognición.|Puede subir creatinina sin dañar el riñón; beber agua.|Evidencia sólida para fuerza.
coenzima-q10|Coenzima Q10|suplemento|Se usa para energía celular, estatinas y algunas enfermedades cardíacas.|Puede interactuar con anticoagulantes y bajar la presión.|Evidencia limitada.
probioticos|Probióticos|suplemento|Se usan para diarrea por antibióticos, colon irritable y salud digestiva.|Cepas y dosis importan; evitar en inmunosupresión grave sin control.|Evidencia moderada según cepa.
fibra|Fibra|suplemento|Se usa para estreñimiento, colesterol y saciedad; incluye soluble e insoluble.|Aumentar despacio y con agua; puede reducir absorción de medicamentos.|Evidencia sólida para estreñimiento.
proteina-whey|Proteína whey|suplemento|Se usa para completar proteína, fuerza y recuperación.|Evitar en alergia a leche; no sustituye alimentación.|Evidencia moderada para fuerza.
electrolitos|Electrolitos|suplemento|Se usan para rehidratación y pérdidas por sudor, vómito o diarrea.|Exceso de sodio o potasio es peligroso; no usar en enfermedad renal sin control.|Evidencia sólida en rehidratación.
carnitina|Carnitina|suplemento|Se usa para metabolismo de grasas y rendimiento; también en deficiencia.|Puede causar molestias digestivas e interactuar con tiroides.|Evidencia limitada.
glutamina|Glutamina|suplemento|Se usa para intestino, recuperación y deficiencia; es un aminoácido.|Evidencia limitada; puede afectar hígado y riñón en dosis altas.|Evidencia limitada.
arginina|Arginina|suplemento|Se usa para óxido nítrico, presión y rendimiento; se estudia en cicatrización.|Puede bajar la presión y afectar herpes; evitar en infarto reciente.|Evidencia limitada.
citrulina|Citrulina|suplemento|Se usa para óxido nítrico y rendimiento; es precursor de arginina.|Puede bajar la presión; evitar con nitratos.|Evidencia limitada.
beta-alanina|Beta-alanina|suplemento|Se usa para rendimiento de alta intensidad y resistencia muscular.|Causa parestesias; dosis altas no aportan más.|Evidencia moderada para ejercicio intenso.
cafeina|Cafeína|suplemento|Se usa para alerta, rendimiento y dolor de cabeza; está en café, té y refrescos.|Ansiedad, insomnio y presión; moderar en embarazo y arritmias.|Evidencia sólida para alerta.
suero-oral|Suero oral|suplemento|Se usa para rehidratar en diarrea y vómito; repone agua y electrolitos.|No sustituir en deshidratación grave; usar preparación correcta.|Evidencia sólida en diarrea.
lactasa|Lactasa|suplemento|Se usa para intolerancia a la lactosa; ayuda a digerir la leche.|No sirve para alergia a la proteína de leche; ajustar según alimento.|Evidencia moderada.
enzimas-digestivas|Enzimas digestivas|suplemento|Se usan para deficiencias pancreáticas y molestias digestivas.|No sustituyen diagnóstico; pueden interactuar con otros fármacos.|Evidencia sólida en insuficiencia pancreática.
acido-hialuronico|Ácido hialurónico|suplemento|Se usa para piel, articulaciones y sequedad ocular; también en cremas.|Evidencia limitada por vía oral; puede causar molestias digestivas.|Evidencia limitada.
inositol|Inositol|suplemento|Se usa para ansiedad, ovario poliquístico y metabolismo.|Puede causar gases y diarrea; no sustituir tratamiento.|Evidencia limitada.
colina|Colina|suplemento|Se usa para hígado, memoria y embarazo; es nutriente esencial.|Dosis altas causan olor corporal y presión baja.|Evidencia moderada en embarazo.
resveratrol|Resveratrol|suplemento|Se usa como antioxidante y para salud cardiovascular.|Puede interactuar con anticoagulantes; evidencia limitada.|Evidencia limitada.
quercetina|Quercetina|suplemento|Se usa como antioxidante y antialérgico natural.|Puede interactuar con anticoagulantes y antibióticos.|Evidencia limitada.
luteina|Luteína|suplemento|Se usa para salud visual y degeneración macular.|Puede interactuar con anticoagulantes; no sustituye evaluación oftalmológica.|Evidencia limitada a moderada.
zeaxantina|Zeaxantina|suplemento|Se usa para salud visual junto con luteína.|Evidencia limitada; puede causar pigmentación amarilla de la piel.|Evidencia limitada.
astaxantina|Astaxantina|suplemento|Se usa como antioxidante y para piel y ojos.|Evidencia limitada; puede interactuar con anticoagulantes.|Evidencia limitada.
licopeno|Licopeno|suplemento|Se usa para próstata y salud cardiovascular; está en tomate.|Evidencia limitada; no sustituye tratamiento.|Evidencia limitada.
betacaroteno|Betacaroteno|suplemento|Se usa como provitamina A y antioxidante.|Dosis altas en fumadores se asociaron con más cáncer de pulmón.|Evidencia limitada y riesgos.
clorofila|Clorofila|suplemento|Se usa para olor corporal y como antioxidante.|Puede causar heces verdes y diarrea; interactúa con anticoagulantes.|Evidencia limitada.
carbon-activado|Carbón activado|suplemento|Se usa en intoxicaciones y para gases; no absorbe todo.|No usar en intoxicación sin indicación; puede causar estreñimiento.|Evidencia sólida en intoxicaciones seleccionadas.
bicarbonato|Bicarbonato de sodio|suplemento|Se usa para acidez, higiene y algunos trastornos; es alcalinizante.|Exceso causa alcalosis y carga de sodio; evitar en hipertensión y riñón.|Evidencia limitada para usos caseros.
vinagre-de-manzana|Vinagre de manzana|suplemento|Se usa para glucosa y digestión de forma popular.|Puede dañar el esmalte dental y el esófago; no sustituye tratamiento.|Evidencia limitada.
aceite-de-coco|Aceite de coco|suplemento|Se usa en cocina, piel y cabello; es grasa saturada.|Alto en calorías; no es tratamiento para Alzheimer ni tiroides.|Evidencia limitada.
aceite-de-oliva|Aceite de oliva|suplemento|Se usa como grasa saludable y para piel; es base de la dieta mediterránea.|Alto en calorías; no aplicar en heridas infectadas.|Evidencia sólida en patrón mediterráneo.
aceite-de-oregano|Aceite de orégano|suplemento|Se usa como antimicrobiano natural y para resfriados.|No ingerir sin diluir; puede irritar y ser tóxico.|Evidencia limitada.
propoloe|Propóleo|suplemento|Se usa para garganta, defensas y heridas leves.|Puede causar alergia; evitar en embarazo y asma.|Evidencia limitada.
miel|Miel|suplemento|Se usa para tos, garganta y heridas; es alimento.|No dar a menores de 1 año por botulismo; alto en azúcar.|Evidencia limitada para tos.
jalea-real|Jalea real|suplemento|Se usa para energía, defensas y menopausia.|Riesgo de alergia grave; evitar en asma y embarazo.|Evidencia limitada.
polen|Polen|suplemento|Se usa como alimento y para alergias de forma tradicional.|Riesgo de alergia; evitar en embarazo y niños pequeños.|Evidencia limitada.
prebioticos|Prebióticos|suplemento|Se usan para alimentar microbiota y mejorar digestión.|Pueden causar gases; aumentar gradualmente.|Evidencia limitada a moderada.
cromo|Cromo|suplemento|Se usa para glucosa y resistencia a la insulina.|Puede interactuar con diabetes y tiroides; evidencia limitada.|Evidencia limitada.
fosforo|Fósforo|suplemento|Se usa para hueso y energía; está en alimentos.|Exceso es peligroso en enfermedad renal; no suplementar sin control.|Evidencia sólida en deficiencia.
aminoacidos-ramificados|Aminoácidos ramificados|suplemento|Se usan para recuperación muscular y en enfermedad hepática.|Pueden interactuar con diabetes y Parkinson; no sustituyen proteína.|Evidencia limitada.
berberina|Berberina|suplemento|Se usa para glucosa, lípidos y digestión.|Puede interactuar con muchos medicamentos y causar diarrea; evitar en embarazo.|Evidencia limitada a moderada.
silimarina|Silimarina|suplemento|Se usa para hígado y protección hepática.|Puede interactuar con antidiabéticos y algunos fármacos hepáticos.|Evidencia limitada.
hidroxicloroquina|Hidroxicloroquina|medicamento|Se usa en lupus, artritis reumatoide y malaria.|Puede dañar la retina; requiere control oftalmológico; evitar en embarazo sin indicación.|Evidencia sólida en enfermedades autoinmunes.
metotrexato|Metotrexato|medicamento|Se usa en artritis, psoriasis y algunos cánceres.|Tóxico para hígado y médula; requiere ácido fólico y controles; evitar en embarazo.|Evidencia sólida.
azatioprina|Azatioprina|medicamento|Se usa como inmunosupresor en trasplante y enfermedades autoinmunes.|Interactúa con alopurinol; requiere control sanguíneo; evitar en embarazo.|Evidencia sólida.
micofenolato|Micofenolato|medicamento|Se usa en trasplante y lupus.|Teratogénico; requiere anticoncepción; control sanguíneo.|Evidencia sólida.
tacrolimus|Tacrolimús|medicamento|Se usa en trasplante y dermatitis atópica grave.|Requiere niveles; nefrotóxico; interactúa con muchos fármacos.|Evidencia sólida.
ciclosporina|Ciclosporina|medicamento|Se usa en trasplante y enfermedades autoinmunes.|Nefrotóxica; requiere niveles; interacciones múltiples.|Evidencia sólida.
sirolimus|Sirolimús|medicamento|Se usa en trasplante y algunos tumores.|Requiere niveles; puede afectar heridas y lípidos.|Evidencia sólida.
litio|Litio|medicamento|Se usa en trastorno bipolar.|Índice terapéutico estrecho; control de niveles, riñón y tiroides.|Evidencia sólida.
valproato|Valproato|medicamento|Se usa en epilepsia y bipolaridad.|Teratogénico; control hepático y sanguíneo; evitar en embarazo.|Evidencia sólida.
lamotrigina|Lamotrigina|medicamento|Se usa en epilepsia y bipolaridad.|Riesgo de erupción grave; titular lento.|Evidencia sólida.
levetiracetam|Levetiracetam|medicamento|Se usa en el tratamiento de la epilepsia.|Puede causar irritabilidad; ajuste renal.|Evidencia sólida.
carbamazepina|Carbamazepina|medicamento|Se usa en epilepsia, neuralgia y bipolaridad.|Interacciones múltiples; control sanguíneo; teratogénica.|Evidencia sólida.
fenitoina|Fenitoína|medicamento|Se usa en el tratamiento de la epilepsia.|Índice estrecho; control de niveles; efectos en encías.|Evidencia sólida.
topiramato|Topiramato|medicamento|Se usa en epilepsia y migraña.|Puede causar cálculos y pérdida de peso; evitar en embarazo.|Evidencia sólida.
sumatriptan|Sumatriptán|medicamento|Se usa en crisis de migraña.|Contraindicado en enfermedad cardiovascular; no abusar.|Evidencia sólida.
propranolol|Propranolol|medicamento|Se usa en migraña, ansiedad, temblor y presión.|Puede empeorar asma y bradicardia; no suspender de golpe.|Evidencia sólida.
metilfenidato|Metilfenidato|medicamento|Se usa en TDAH y narcolepsia.|Puede aumentar presión y ansiedad; control cardiovascular.|Evidencia sólida.
donepezilo|Donepezilo|medicamento|Se usa en el tratamiento de la enfermedad de Alzheimer.|Puede causar náuseas, bradicardia y sueños vívidos.|Evidencia moderada.
memantina|Memantina|medicamento|Se usa en Alzheimer moderado a grave.|Ajuste renal; puede causar mareo y confusión.|Evidencia moderada.
levodopa-carbidopa|Levodopa/carbidopa|medicamento|Se usa en el tratamiento de la enfermedad de Parkinson.|Puede causar discinesias y fluctuaciones; no suspender de golpe.|Evidencia sólida.
ropinirol|Ropinirol|medicamento|Se usa en Parkinson y piernas inquietas.|Puede causar somnolencia y impulsividad; titular lento.|Evidencia sólida.
tamsulosina|Tamsulosina|medicamento|Se usa en síntomas urinarios de próstata.|Puede causar mareo al levantarse; interactúa con otros alfa bloqueadores.|Evidencia sólida.
finasterida|Finasterida|medicamento|Se usa en próstata y alopecia androgenética.|Puede afectar función sexual y PSA; evitar en embarazo.|Evidencia sólida.
dutasterida|Dutasterida|medicamento|Se usa en próstata y alopecia.|Puede afectar función sexual y PSA; evitar en embarazo.|Evidencia sólida.
sildenafilo|Sildenafilo|medicamento|Se usa en disfunción eréctil e hipertensión pulmonar.|No combinar con nitratos; cuidado en cardiopatía.|Evidencia sólida.
tadalafilo|Tadalafilo|medicamento|Se usa en disfunción eréctil, próstata y hipertensión pulmonar.|No combinar con nitratos; puede causar dolor muscular.|Evidencia sólida.
oxibutinina|Oxibutinina|medicamento|Se usa en vejiga hiperactiva.|Sequedad, estreñimiento y confusión en mayores.|Evidencia sólida.
solifenacina|Solifenacina|medicamento|Se usa en vejiga hiperactiva.|Sequedad de boca y estreñimiento; ajuste renal.|Evidencia sólida.
mirabegron|Mirabegrón|medicamento|Se usa en vejiga hiperactiva.|Puede subir la presión; interactúa con otros fármacos.|Evidencia sólida.
alendronato|Alendronato|medicamento|Se usa en osteoporosis.|Tomar en ayunas y sin acostarse; puede irritar el esófago.|Evidencia sólida.
risedronato|Risedronato|medicamento|Se usa en osteoporosis.|Tomar en ayunas y sin acostarse; irritación esofágica.|Evidencia sólida.
denosumab|Denosumab|medicamento|Se usa en osteoporosis y cáncer.|No suspender sin plan; riesgo de fracturas y calcio bajo.|Evidencia sólida.
teriparatida|Teriparatida|medicamento|Se usa en osteoporosis grave.|Inyección diaria; puede causar hipercalcemia y náuseas.|Evidencia sólida.
metimazol|Metimazol|medicamento|Se usa en hipertiroidismo.|Puede causar agranulocitosis y daño hepático; control.|Evidencia sólida.
propiltiouracilo|Propiltiouracilo|medicamento|Se usa en hipertiroidismo, sobre todo en embarazo.|Riesgo hepático; control sanguíneo.|Evidencia sólida.
cabergolina|Cabergolina|medicamento|Se usa en prolactinoma y supresión de lactancia.|Puede causar somnolencia e impulsividad; control.|Evidencia sólida.
morfina|Morfina|medicamento|Se usa en dolor intenso.|Depresión respiratoria, estreñimiento y dependencia; control estricto.|Evidencia sólida.
oxicodona|Oxicodona|medicamento|Se usa en dolor intenso.|Dependencia y depresión respiratoria; control estricto.|Evidencia sólida.
fentanilo|Fentanilo|medicamento|Se usa en dolor intenso y anestesia.|Muy potente; riesgo de sobredosis y muerte; control estricto.|Evidencia sólida.
buprenorfina|Buprenorfina|medicamento|Se usa en dolor y trastorno por opioides.|Puede precipitar abstinencia; control especializado.|Evidencia sólida.
lidocaina|Lidocaína|medicamento|Se usa como anestésico local y antiarrítmico.|No usar en dosis altas; riesgo de toxicidad neurológica y cardíaca.|Evidencia sólida.
isotretinoina|Isotretinoína|medicamento|Se usa en acné grave.|Teratogénica; requiere anticoncepción y control de lípidos e hígado.|Evidencia sólida.
adapaleno|Adapaleno|medicamento|Se usa en el tratamiento del acné.|Irritación y fotosensibilidad; evitar en embarazo.|Evidencia sólida.
peroxido-de-benzoilo|Peróxido de benzoilo|medicamento|Se usa en acné inflamatorio.|Irrita y decolora telas; puede causar dermatitis.|Evidencia sólida.
protector-solar|Protector solar|cuidado|Se usa para prevenir quemaduras, manchas y cáncer de piel.|Reaplicar cada 2 horas; no exponerse al sol solo por usarlo.|Evidencia sólida.
repelente-de-insectos|Repelente de insectos|cuidado|Se usa para prevenir picaduras y enfermedades transmitidas por mosquitos.|No usar en bebés menores de 2 meses; evitar ojos y manos.|Evidencia sólida.
gel-antibacterial|Gel antibacterial|cuidado|Se usa para higiene de manos cuando no hay agua y jabón.|No sustituye el lavado con agua; puede irritar la piel.|Evidencia moderada.
spray-nasal-salino|Spray nasal salino|cuidado|Se usa para limpiar y humidificar la nariz en resfriados y alergias.|Usar suero estéril; no compartir el envase.|Evidencia limitada.
pasta-dental-fluor|Pasta dental con flúor|cuidado|Se usa para prevenir caries y fortalecer el esmalte.|No tragar; usar cantidad adecuada según edad.|Evidencia sólida.
enjuague-bucal|Enjuague bucal|cuidado|Se usa para higiene bucal y mal aliento.|No sustituye cepillado; puede irritar si tiene alcohol.|Evidencia limitada.
desodorante|Desodorante|cuidado|Se usa para controlar olor y sudor.|Puede irritar la piel; no aplicar en heridas.|Evidencia limitada.
crema-hidratante|Crema hidratante|cuidado|Se usa para sequedad y barrera de la piel.|Evitar en heridas infectadas; elegir según tipo de piel.|Evidencia moderada.
agua-oxigenada|Agua oxigenada|cuidado|Se usa para limpiar heridas leves y blanquear.|Irrita la piel y retrasa cicatrización; no usar en heridas profundas.|Evidencia limitada.
alcohol-etilico|Alcohol etílico|cuidado|Se usa como antiséptico y desinfectante.|Inflamable; irrita la piel y no usar en heridas abiertas.|Evidencia sólida como antiséptico.
yodo-povidona|Yodopovidona|cuidado|Se usa como antiséptico en heridas y cirugía.|Evitar en embarazo, tiroides y alergia al yodo.|Evidencia sólida.
clorhexidina|Clorhexidina|cuidado|Se usa como antiséptico de piel y boca.|No usar en oído medio ni en grandes heridas sin indicación.|Evidencia sólida.
acido-borico|Ácido bórico|cuidado|Se usa en algunos polvos y soluciones tópicas.|Tóxico por ingestión; no usar en piel lesionada ni niños.|Evidencia limitada y riesgos.
sales-de-rehidratacion|Sales de rehidratación oral|cuidado|Se usan para reponer agua y electrolitos en diarrea.|Preparar exactamente según el envase; no sustituir atención en casos graves.|Evidencia sólida.
suero-fisiologico|Suero fisiológico|cuidado|Se usa para limpiar heridas, ojos y mucosas.|Usar estéril; no reutilizar después de abierto.|Evidencia sólida.
jabon-de-azufre|Jabón de azufre|cuidado|Se usa en acné y piel grasa.|Puede resecar e irritar; no usar en piel sensible.|Evidencia limitada.
champu-anticaspa|Champú anticaspa|cuidado|Se usa para caspa y dermatitis seborreica.|Puede irritar; alternar y consultar si persiste.|Evidencia moderada.
locion-calamina|Loción de calamina|cuidado|Se usa para picaduras y prurito leve.|No usar en heridas abiertas; puede resecar.|Evidencia limitada.
vaselina|Vaselina|cuidado|Se usa para proteger y humectar piel seca y heridas leves.|No usar en heridas infectadas ni en quemaduras graves.|Evidencia moderada.
parche-de-nicotina|Parche de nicotina|cuidado|Se usa para dejar de fumar y reducir abstinencia.|No fumar mientras se usa; evitar en embarazo sin control.|Evidencia sólida.
`;

const ficha = (linea) => {
  const [slug, nombre, categoria, para, precauciones, evidencia] = linea.split('|');
  return { slug, nombre, categoria, para, precauciones, evidencia };
};

export const BIBLIOTECA_SALUD = raw.trim().split('\n').map(ficha);
export const ARTICULO_POR_SLUG = new Map(BIBLIOTECA_SALUD.map((a) => [a.slug, a]));
export const articuloDeSalud = (slug) => ARTICULO_POR_SLUG.get(slug) || null;

/**
 * 18 de noviembre de 2026: Karla aprobó los 200 artículos junto con el
 * resto del lote y pidió desplegarlos para Google.
 */
export const REVISION_BIBLIOTECA = Object.fromEntries(
  BIBLIOTECA_SALUD.map((a) => [a.slug, {
    revisor: 'Karla Hernández, Química Farmacéutica',
    reviewedAt: '2026-11-18',
  }]),
);
export const articuloRevisado = (slug) => Boolean(REVISION_BIBLIOTECA[slug]);
export const robotsDeArticuloSalud = (slug) => (articuloRevisado(slug) ? 'index,follow' : 'noindex,follow');

export const CATEGORIAS_SALUD = {
  planta: 'Plantas medicinales',
  vitamina: 'Vitaminas y minerales',
  suplemento: 'Suplementos',
  medicamento: 'Medicamentos',
  cuidado: 'Cuidado de la salud',
};

export const META_BIBLIOTECA = {
  titulo: 'Biblioteca de salud: para qué sirve y precauciones | Edvanta',
  h1: 'Biblioteca de salud: 200 respuestas claras',
  descripcion: 'Artículos educativos sobre plantas medicinales, vitaminas, suplementos, medicamentos y cuidados: para qué sirven, precauciones y evidencia disponible.',
};
