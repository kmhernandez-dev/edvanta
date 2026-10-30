/**
 * ============================================================
 *  Diploma.jsx — El certificado de aprobación de Edvanta
 *
 *  El mismo diseño del PDF (lib/certificado/pdf.js), dibujado con HTML
 *  para que cada curso muestre su nombre y sus horas. Escala con su
 *  propio ancho (unidades cqw): en el móvil se ve igual que en la mesa.
 *
 *  muestra → la vista previa de la ficha del curso: en lugar del nombre
 *  de una persona dice «Tu nombre», y el código es de ejemplo. El QR sí
 *  funciona: lleva a la página donde se verifican los certificados.
 *  previa  → el de quien ya completó el curso, antes de emitirlo: con su
 *  nombre, pero todavía sin código.
 * ============================================================
 */
import { useEffect, useState } from 'react';
import { qrDe } from '../../lib/certificado/qr';
import {
  EMISOR, FIRMA, LOGO, SELLO, lineaDeExpedicion, lineaDeIntensidad, urlDeVerificacion,
} from '../../lib/certificado/formato';

/** Las tres bolitas de marca (lavanda, azul, turquesa). */
function Puntos({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-[0.55cqw] ${className}`} aria-hidden="true">
      <span className="h-[0.6cqw] w-[0.6cqw] rounded-full bg-[#8981CE]" />
      <span className="h-[0.6cqw] w-[0.6cqw] rounded-full bg-[#082E86]" />
      <span className="h-[0.6cqw] w-[0.6cqw] rounded-full bg-[#25A7B0]" />
    </span>
  );
}

/** El marco, la luz de las esquinas y las líneas onduladas del diseño. */
function Fondo() {
  const ondas = Array.from({ length: 7 }, (_, i) => i);
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1492 1054" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <radialGradient id="dip-luz-a" cx="0" cy="1" r="0.7">
          <stop offset="0" stopColor="#DDF3F2" stopOpacity="0.9" />
          <stop offset="1" stopColor="#DDF3F2" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dip-luz-b" cx="1" cy="0" r="0.6">
          <stop offset="0" stopColor="#EEE8FC" stopOpacity="0.95" />
          <stop offset="1" stopColor="#EEE8FC" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1492" height="1054" fill="#FCFDFF" />
      <rect width="1492" height="1054" fill="url(#dip-luz-a)" />
      <rect width="1492" height="1054" fill="url(#dip-luz-b)" />
      {/* Ondas finas en la esquina superior derecha y en la inferior izquierda. */}
      <g fill="none" stroke="#8981CE" strokeOpacity="0.28" strokeWidth="1.1">
        {ondas.map((i) => (
          <path key={`a${i}`} d={`M ${960 + i * 22} 34 C ${1120 + i * 18} ${140 + i * 10}, ${1250 - i * 6} ${40 + i * 14}, 1458 ${180 + i * 26}`} />
        ))}
      </g>
      <g fill="none" stroke="#25A7B0" strokeOpacity="0.22" strokeWidth="1.1">
        {ondas.map((i) => (
          <path key={`b${i}`} d={`M 34 ${640 + i * 24} C ${170 + i * 10} ${760 - i * 8}, ${300 + i * 14} ${980 - i * 6}, ${520 + i * 26} 1020`} />
        ))}
      </g>
      {/* Doble marco */}
      <rect x="22" y="22" width="1448" height="1010" rx="6" fill="none" stroke="#8981CE" strokeOpacity="0.55" strokeWidth="2" />
      <rect x="36" y="36" width="1420" height="982" rx="4" fill="none" stroke="#082E86" strokeOpacity="0.28" strokeWidth="1" />
      {/* Bolitas en las esquinas */}
      {[[36, 36], [1456, 36], [36, 1018], [1456, 1018]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="#8981CE" fillOpacity="0.8" />
      ))}
    </svg>
  );
}

export default function Diploma({
  titular, documento, curso, horas, modalidad = 'Virtual', fecha, codigo, muestra = false, previa = false, className = '',
}) {
  const [qr, setQr] = useState(null);
  const enlace = urlDeVerificacion(muestra || !codigo ? null : codigo);
  const sello = muestra ? 'Muestra' : previa ? 'Vista previa' : null;
  useEffect(() => {
    let vivo = true;
    qrDe(enlace).then((url) => { if (vivo) setQr(url); }).catch(() => {});
    return () => { vivo = false; };
  }, [enlace]);

  const nombre = muestra ? 'Tu nombre' : titular;
  const tamNombre = nombre.length > 34 ? 'text-[3.1cqw]' : nombre.length > 24 ? 'text-[3.7cqw]' : 'text-[4.3cqw]';
  // El curso tiene una franja fija (dos líneas como máximo): cuanto más
  // largo el nombre, más pequeña la letra, sin tapar lo de abajo.
  const tamCurso = curso.length > 64 ? 'text-[2.35cqw]' : curso.length > 40 ? 'text-[2.75cqw]' : 'text-[3.4cqw]';
  // Cada línea va a la altura que tiene en el diseño (porcentaje del alto).
  const linea = 'absolute inset-x-[7%] flex justify-center text-center';

  return (
    <figure
      className={`relative w-full select-none overflow-hidden rounded-[1.2cqw] bg-white text-[#14233F] shadow-[0_24px_60px_-24px_rgba(8,46,134,.35)] ring-1 ring-[#E3E9F2] [aspect-ratio:1492/1054] [container-type:inline-size] ${className}`}
      aria-label={muestra ? `Muestra del certificado de aprobación de ${curso}` : `Certificado de aprobación de ${titular} en ${curso}`}
    >
      <Fondo />
      {/* Cabecera */}
      <img src={LOGO} alt="Edvanta" className="absolute left-[9.6%] top-[8.3%] w-[14.6%]" loading="lazy" />
      <p className="absolute right-[7.4%] top-[10%] text-right font-display text-[1.25cqw] font-bold leading-[1.6] tracking-[0.12em] text-[#082E86]">
        {EMISOR.nombre.toUpperCase()}
        <span className="block font-semibold tracking-[0.06em]">NIT: {EMISOR.nit}</span>
      </p>

      {/* Cuerpo */}
      <p className={`${linea} top-[18.2%] font-display text-[1.55cqw] font-semibold uppercase tracking-[0.5em] text-[#082E86]`}>Educación continua</p>
      <p className={`${linea} top-[22.4%] font-serif text-[4.4cqw] font-bold uppercase leading-none tracking-[0.01em] text-[#031D5C]`}>
        Certificado de aprobación
      </p>
      <div className="absolute left-1/2 top-[30.4%] flex w-[36%] -translate-x-1/2 items-center gap-[1.2cqw]" aria-hidden="true">
        <span className="h-px flex-1 bg-[#082E86]/30" />
        <Puntos />
        <span className="h-px flex-1 bg-[#082E86]/30" />
      </div>
      <p className={`${linea} top-[34.6%] font-serif text-[1.85cqw]`}>{EMISOR.nombre} certifica que</p>
      <p className={`${linea} top-[38.6%] h-[8.6%] items-center font-serif font-semibold leading-[1.05] ${tamNombre} ${muestra ? 'text-[#082E86]/45' : 'text-[#031D5C]'}`}>
        <span className="max-w-[92%]">{nombre}</span>
      </p>
      {(documento || muestra) && (
        <p className={`${linea} top-[47.6%] font-serif text-[1.45cqw] text-[#4A5A73]`}>
          Documento de identidad: {muestra ? 'tu número' : documento}
        </p>
      )}
      <p className={`${linea} top-[52.6%] font-serif text-[1.85cqw]`}>Ha aprobado satisfactoriamente el curso</p>
      <p className={`${linea} top-[56.4%] h-[8%] items-center font-serif font-bold leading-[1.1] text-[#031D5C] ${tamCurso}`}>
        <span className="line-clamp-2 max-w-[92%]">{curso}</span>
      </p>
      <p className={`${linea} top-[65.4%] font-serif text-[1.6cqw]`}>{lineaDeIntensidad({ horas, modalidad })}</p>
      <p className={`${linea} top-[70%] font-serif text-[1.5cqw] text-[#4A5A73]`}>{lineaDeExpedicion({ fecha })}</p>

      {/* Pie: firma, sello y verificación */}
      <div className="absolute left-[17.6%] top-[74%] flex w-[24%] flex-col items-center">
        <img src={FIRMA.imagen} alt="Firma de Karla H." className="w-[86%] translate-y-[0.7cqw]" loading="lazy" />
        <span className="h-px w-full bg-[#082E86]/55" />
        <span className="mt-[0.8cqw] font-serif text-[1.45cqw]">{FIRMA.cargo}</span>
      </div>
      <div className="absolute left-1/2 top-[74.4%] flex -translate-x-1/2 flex-col items-center">
        <img src={SELLO} alt="Sello de Edvanta" className="w-[12.2cqw]" loading="lazy" />
        <span className="mt-[0.3cqw] font-display text-[1.35cqw] font-semibold tracking-[0.18em] text-[#082E86]">edvanta.co</span>
      </div>
      <div className="absolute right-[5.4%] top-[79%] flex flex-col items-center">
        <span className="flex h-[8.4cqw] w-[8.4cqw] items-center justify-center rounded-[0.4cqw] border border-[#082E86]/40 bg-white p-[0.55cqw]">
          {qr ? <img src={qr} alt={`QR para verificar en ${enlace}`} className="h-full w-full" /> : null}
        </span>
        <span className="mt-[0.6cqw] font-display text-[1.2cqw] font-semibold text-[#4A5A73]">Verificación</span>
      </div>
      <p className="absolute bottom-[5%] left-[4.4%] font-display text-[1.15cqw] font-semibold text-[#4A5A73]">
        Código: {muestra || !codigo ? 'EDV-XXXX-XXXX' : codigo}
      </p>
      <p className="absolute bottom-[1.6%] left-1/2 -translate-x-1/2"><Puntos /></p>
      {sello && (
        <figcaption className="absolute right-[3.4%] top-[3.4%] rounded-full bg-[#082E86] px-[1.4cqw] py-[0.5cqw] font-display text-[1.1cqw] font-bold uppercase tracking-[0.14em] text-white">
          {sello}
        </figcaption>
      )}
    </figure>
  );
}
