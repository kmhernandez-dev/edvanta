/**
 * El certificado en PDF (A4 horizontal), con el mismo diseño que
 * components/edvanta/Diploma.jsx. Las medidas salen del diseño original
 * (1492 × 1054 px): cada píxel del diseño mide k milímetros en la hoja.
 * jsPDF se carga solo cuando alguien descarga su certificado.
 */
import {
  EMISOR, FIRMA, LOGO, SELLO, lineaDeExpedicion, lineaDeIntensidad, urlDeVerificacion,
} from './formato';
import { qrDe } from './qr';

const W = 297;
const H = 210;
const k = W / 1492;
const px = (v) => v * k;

const AZUL = [8, 46, 134];
const AZUL_HONDO = [3, 29, 92];
const TEXTO = [20, 35, 63];
const GRIS = [74, 90, 115];
const LAVANDA = [137, 129, 206];
const TURQUESA = [37, 167, 176];

async function comoDataUrl(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`No se pudo cargar ${url}`);
  const blob = await r.blob();
  return new Promise((ok, mal) => {
    const f = new FileReader();
    f.onload = () => ok(f.result);
    f.onerror = mal;
    f.readAsDataURL(blob);
  });
}

function puntos(doc, x, y) {
  [LAVANDA, AZUL, TURQUESA].forEach((color, i) => {
    doc.setFillColor(...color);
    doc.circle(x + (i - 1) * 2.2, y, 0.75, 'F');
  });
}

/** Texto centrado que se achica hasta caber en `lineas` renglones. */
function centrado(doc, texto, y, { fuente = 'times', estilo = 'normal', tam, color = TEXTO, ancho = px(1300), lineas = 1, interlineado = 1.12 }) {
  doc.setFont(fuente, estilo);
  doc.setTextColor(...color);
  let t = tam;
  let partes = [texto];
  for (; t > tam * 0.55; t -= 0.5) {
    doc.setFontSize(t);
    partes = doc.splitTextToSize(texto, ancho);
    if (partes.length <= lineas) break;
  }
  const alto = (t * 0.3528) * interlineado; // pt → mm
  const inicio = y - ((partes.length - 1) * alto) / 2;
  partes.slice(0, lineas).forEach((p, i) => doc.text(p, W / 2, inicio + i * alto, { align: 'center', baseline: 'middle' }));
}

export async function pdfDelCertificado(c) {
  const [{ jsPDF }, logo, firma, sello, qr] = await Promise.all([
    import('jspdf'), comoDataUrl(LOGO), comoDataUrl(FIRMA.imagen), comoDataUrl(SELLO), qrDe(urlDeVerificacion(c.codigo)),
  ]);
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true });
  doc.setProperties({
    title: `Certificado de aprobación · ${c.curso}`,
    subject: `Certificado ${c.codigo}`,
    author: EMISOR.nombre,
    creator: 'edvanta.co',
  });

  // Fondo y doble marco
  doc.setFillColor(252, 253, 255);
  doc.rect(0, 0, W, H, 'F');
  doc.setDrawColor(...LAVANDA);
  doc.setLineWidth(0.4);
  doc.roundedRect(px(22), px(22), px(1448), px(1010), 1.2, 1.2, 'S');
  doc.setDrawColor(...AZUL);
  doc.setLineWidth(0.15);
  doc.roundedRect(px(36), px(36), px(1420), px(982), 0.8, 0.8, 'S');
  doc.setFillColor(...LAVANDA);
  [[36, 36], [1456, 36], [36, 1018], [1456, 1018]].forEach(([x, y]) => doc.circle(px(x), px(y), 0.9, 'F'));

  // Cabecera
  doc.addImage(logo, 'PNG', px(143), px(88), px(218), px(218 * (512 / 931)));
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...AZUL);
  doc.text(EMISOR.nombre.toUpperCase(), W - px(110), px(118), { align: 'right', charSpace: 0.5 });
  doc.setFont('helvetica', 'normal');
  doc.text(`NIT: ${EMISOR.nit}`, W - px(110), px(146), { align: 'right', charSpace: 0.2 });

  // Cuerpo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...AZUL);
  doc.text('EDUCACIÓN CONTINUA', W / 2, px(204), { align: 'center', baseline: 'middle', charSpace: 2.2 });
  centrado(doc, 'CERTIFICADO DE APROBACIÓN', px(270), { estilo: 'bold', tam: 33, color: AZUL_HONDO });
  doc.setDrawColor(...AZUL);
  doc.setLineWidth(0.15);
  doc.line(W / 2 - 52, px(322), W / 2 - 6, px(322));
  doc.line(W / 2 + 6, px(322), W / 2 + 52, px(322));
  puntos(doc, W / 2, px(322));
  centrado(doc, `${EMISOR.nombre} certifica que`, px(380), { tam: 14 });
  centrado(doc, c.titular, px(452), { estilo: 'bold', tam: 32, color: AZUL_HONDO });
  if (c.documento) centrado(doc, `Documento de identidad: ${c.documento}`, px(514), { tam: 11, color: GRIS });
  centrado(doc, 'Ha aprobado satisfactoriamente el curso', px(569), { tam: 14 });
  centrado(doc, c.curso, px(636), { estilo: 'bold', tam: 25, color: AZUL_HONDO, lineas: 2 });
  centrado(doc, lineaDeIntensidad({ horas: c.horas, modalidad: c.modalidad }), px(702), { tam: 12.5 });
  centrado(doc, lineaDeExpedicion({ ciudad: c.ciudad, fecha: c.emitidoEl }), px(750), { tam: 11.5, color: GRIS });

  // Firma
  doc.addImage(firma, 'PNG', px(288), px(778), px(308), px(308 * (96 / 340)));
  doc.setDrawColor(...AZUL);
  doc.setLineWidth(0.25);
  doc.line(px(263), px(864), px(621), px(864));
  doc.setFont('times', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...TEXTO);
  doc.text(FIRMA.cargo, px(442), px(892), { align: 'center', baseline: 'middle' });

  // Sello
  doc.addImage(sello, 'PNG', px(655), px(784), px(182), px(182));
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...AZUL);
  doc.text('edvanta.co', W / 2, px(984), { align: 'center', baseline: 'middle', charSpace: 1 });

  // Verificación
  doc.setDrawColor(...AZUL);
  doc.setLineWidth(0.2);
  doc.roundedRect(px(1286), px(833), px(125), px(125), 0.6, 0.6, 'S');
  doc.addImage(qr, 'PNG', px(1294), px(841), px(109), px(109));
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...GRIS);
  doc.text('Verificación', px(1348), px(978), { align: 'center', baseline: 'middle' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(urlDeVerificacion(c.codigo).replace('https://', ''), px(1348), px(996), { align: 'center', baseline: 'middle' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(`Código: ${c.codigo}`, px(66), px(994), { baseline: 'middle' });
  puntos(doc, W / 2, px(1034));

  return doc;
}

/** Descarga el certificado: «certificado-EDV-XXXX-XXXX.pdf». */
export async function descargarCertificado(c) {
  const doc = await pdfDelCertificado(c);
  doc.save(`certificado-${c.codigo}.pdf`);
}
