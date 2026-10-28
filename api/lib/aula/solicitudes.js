/**
 * ============================================================
 *  solicitudes.js — Interés, propuestas y contacto
 *
 *  Lo que llega por los formularios públicos se guarda aquí y se
 *  atiende desde el panel del aula. La persona solo ve «recibimos tu
 *  solicitud» cuando la fila quedó escrita: si la base de datos falla,
 *  se le dice, y se le da otro canal.
 *
 *  Datos mínimos. Ningún campo pide información de salud, y la
 *  autorización para responder no se mezcla con la de recibir
 *  novedades: son dos casillas y dos columnas.
 * ============================================================
 */

import {
  badRequest, bool, calendarDate, email, int, notFound, oneOf, str, strList,
} from './http.js';
import { audit } from './audit.js';

export const TIPOS = ['interes', 'propuesta', 'contacto'];
export const ESTADOS = ['nueva', 'en_conversacion', 'cerrada'];

export const ROLES = {
  auxiliar: 'Auxiliar de farmacia',
  regente: 'Regente de farmacia',
  quimico: 'Químico farmacéutico',
  otro_profesional: 'Otro profesional de la salud',
  estudiante: 'Estudiante',
  paciente: 'Paciente',
  cuidador: 'Cuidador o familiar',
  otro: 'Otro',
};

export const TIPOS_DE_INSTITUCION = {
  hospital: 'Hospital o clínica',
  ips: 'IPS',
  eps: 'EPS',
  laboratorio: 'Laboratorio farmacéutico',
  fabricante: 'Fabricante o maquilador',
  distribuidor: 'Distribuidor u operador farmacéutico',
  distribuidora: 'Distribuidora o droguería',
  drogueria: 'Droguería',
  farmacia: 'Farmacia',
  'central-mezclas': 'Central de mezclas',
  empresa: 'Otra empresa',
  otra: 'Otra organización del sector salud',
};

export const MODALIDADES = {
  'en-vivo': 'Sesiones en vivo por videollamada',
  aula: 'Cohorte cerrada en el aula virtual',
  combinada: 'Formación combinada',
  diseno: 'Diseño a medida',
  'por-definir': 'Por definir con la institución',
};

const REFERENCIA = /^[a-z0-9][a-z0-9-]{0,79}$/;
const TELEFONO = /^[+\d\s().-]{7,40}$/;

/** Valida y limpia lo que manda el formulario. Lanza 400 con el campo. */
export function leerSolicitud(body = {}) {
  const tipo = oneOf(body.tipo, 'tipo', 'El tipo de solicitud', TIPOS);

  const referencia = body.referencia ? String(body.referencia).trim() : null;
  if (referencia && !REFERENCIA.test(referencia)) {
    throw badRequest('No reconocemos qué estás solicitando. Recarga la página e inténtalo de nuevo.', { field: 'referencia' });
  }

  const whatsapp = str(body.whatsapp, 'whatsapp', 'El WhatsApp', { optional: true, max: 40 });
  if (whatsapp && !TELEFONO.test(whatsapp)) {
    throw badRequest('El WhatsApp solo puede tener números, espacios y el signo +.', { field: 'whatsapp' });
  }

  const institucion = str(body.institucion, 'institucion', 'El nombre de la institución', {
    optional: tipo !== 'propuesta', max: 160,
  });
  const mensaje = str(body.mensaje, 'mensaje', 'El mensaje', {
    optional: tipo !== 'contacto', max: 1500,
  });
  const areas = strList(body.areas, 'areas', 'Las áreas de interés', { maxItems: 20, maxLength: 120 });
  const perfiles = strList(body.perfiles, 'perfiles', 'Los perfiles', { maxItems: 20, maxLength: 120 });
  const participantes = int(body.participantes, 'participantes', 'El número de participantes', {
    min: 1, max: 100000, optional: true,
  });
  const modalidad = oneOf(body.modalidad, 'modalidad', 'La modalidad', Object.keys(MODALIDADES), { optional: true });
  const resultadoEsperado = str(body.resultadoEsperado, 'resultadoEsperado', 'La necesidad o resultado esperado', {
    optional: true, max: 1500,
  });
  const pais = str(body.pais, 'pais', 'El país', { optional: true, max: 80 });
  const ciudad = str(body.ciudad, 'ciudad', 'La ciudad', { optional: true, max: 80 });
  const fechaTentativa = calendarDate(body.fechaTentativa, 'fechaTentativa', 'La fecha tentativa', { optional: true });

  if (body.aceptaTratamiento !== true) {
    throw badRequest('Para responderte necesitamos tu autorización para usar estos datos.', { field: 'aceptaTratamiento' });
  }

  return {
    tipo,
    referencia,
    nombre: str(body.nombre, 'nombre', 'Tu nombre', { max: 120 }),
    correo: email(body.correo, 'correo', 'El correo'),
    whatsapp,
    rol: oneOf(body.rol, 'rol', 'Tu rol', Object.keys(ROLES), { optional: true }),
    institucion,
    tipoInstitucion: oneOf(body.tipoInstitucion, 'tipoInstitucion', 'El tipo de institución', Object.keys(TIPOS_DE_INSTITUCION), { optional: true }),
    cargo: str(body.cargo, 'cargo', 'El cargo', { optional: true, max: 120 }),
    areas,
    perfiles,
    participantes,
    modalidad,
    resultadoEsperado,
    pais,
    ciudad,
    fechaTentativa,
    mensaje,
    aceptaNovedades: bool(body.aceptaNovedades, 'aceptaNovedades', 'La autorización de novedades', { optional: true, fallback: false }),
    origen: str(body.origen, 'origen', 'La página de origen', { optional: true, max: 255 }),
  };
}

const fechaTexto = (v) => {
  if (!v) return null;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v).slice(0, 10);
};

const aFila = (r) => ({
  id: r.id,
  tipo: r.tipo,
  referencia: r.referencia,
  nombre: r.nombre,
  correo: r.correo,
  whatsapp: r.whatsapp,
  rol: r.rol,
  rolTexto: r.rol ? ROLES[r.rol] || r.rol : null,
  institucion: r.institucion,
  tipoInstitucion: r.tipo_institucion,
  tipoInstitucionTexto: r.tipo_institucion ? TIPOS_DE_INSTITUCION[r.tipo_institucion] || r.tipo_institucion : null,
  cargo: r.cargo,
  areas: r.areas || [],
  perfiles: r.perfiles || [],
  participantes: r.participantes,
  modalidad: r.modalidad,
  modalidadTexto: r.modalidad ? MODALIDADES[r.modalidad] || r.modalidad : null,
  resultadoEsperado: r.resultado_esperado,
  pais: r.pais,
  ciudad: r.ciudad,
  fechaTentativa: fechaTexto(r.fecha_tentativa),
  mensaje: r.mensaje,
  aceptaNovedades: r.acepta_novedades,
  origen: r.origen,
  estado: r.estado,
  notaInterna: r.nota_interna,
  fecha: r.created_at,
  actualizada: r.updated_at,
});

export async function crearSolicitud(db, s) {
  const { rows } = await db.query(
    `INSERT INTO solicitudes
       (tipo, referencia, nombre, correo, whatsapp, rol, institucion, tipo_institucion,
        cargo, areas, perfiles, participantes, modalidad, resultado_esperado, pais, ciudad,
        fecha_tentativa, mensaje, acepta_tratamiento, acepta_novedades, origen)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
             $17, $18, TRUE, $19, $20)
     RETURNING *`,
    [
      s.tipo, s.referencia, s.nombre, s.correo, s.whatsapp, s.rol, s.institucion,
      s.tipoInstitucion, s.cargo, s.areas, s.perfiles, s.participantes, s.modalidad,
      s.resultadoEsperado, s.pais, s.ciudad, s.fechaTentativa, s.mensaje,
      s.aceptaNovedades, s.origen,
    ],
  );
  return aFila(rows[0]);
}

export async function listarSolicitudes(db, { estado, tipo, pagina = 1, tamano = 30 } = {}) {
  const filtros = [];
  const params = [];
  if (estado && ESTADOS.includes(estado)) { params.push(estado); filtros.push(`estado = $${params.length}`); }
  if (tipo && TIPOS.includes(tipo)) { params.push(tipo); filtros.push(`tipo = $${params.length}`); }
  const where = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';

  params.push(tamano + 1, (pagina - 1) * tamano);
  const { rows } = await db.query(
    `SELECT * FROM solicitudes ${where}
      ORDER BY created_at DESC, id DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );
  const { rows: conteo } = await db.query(
    'SELECT estado, COUNT(*)::int AS n FROM solicitudes GROUP BY estado',
  );
  const porEstado = Object.fromEntries(ESTADOS.map((e) => [e, 0]));
  for (const c of conteo) porEstado[c.estado] = c.n;

  return {
    solicitudes: rows.slice(0, tamano).map(aFila),
    hayMas: rows.length > tamano,
    porEstado,
  };
}

export async function actualizarSolicitud(db, id, { estado, notaInterna }, { actor, ip } = {}) {
  const cambios = {};
  if (estado !== undefined) cambios.estado = oneOf(estado, 'estado', 'El estado', ESTADOS);
  if (notaInterna !== undefined) {
    cambios.nota_interna = str(notaInterna, 'notaInterna', 'La nota', { optional: true, max: 2000 });
  }
  if (!Object.keys(cambios).length) throw badRequest('No hay nada que cambiar.');

  return db.tx(async (t) => {
    const { rows: antes } = await t.query('SELECT * FROM solicitudes WHERE id = $1 FOR UPDATE', [id]);
    if (!antes.length) throw notFound('Esta solicitud ya no existe.');

    const sets = Object.keys(cambios).map((k, i) => `${k} = $${i + 2}`);
    const { rows } = await t.query(
      `UPDATE solicitudes
          SET ${sets.join(', ')}, atendida_por = $${sets.length + 2}, updated_at = NOW()
        WHERE id = $1
        RETURNING *`,
      [id, ...Object.values(cambios), actor?.id ?? null],
    );
    await audit(t, {
      actor,
      action: 'solicitud.atender',
      entityType: 'solicitud',
      entityId: id,
      summary: `Solicitud de ${antes[0].nombre}: ${cambios.estado ? `estado ${cambios.estado}` : 'nota actualizada'}`,
      before: { estado: antes[0].estado },
      after: { estado: rows[0].estado },
      ip,
    });
    return aFila(rows[0]);
  });
}

const escapar = (v) => String(v ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

const TITULOS = {
  interes: 'Nuevo registro de interés',
  propuesta: 'Nueva solicitud de propuesta institucional',
  contacto: 'Nuevo mensaje de contacto',
};

/** Aviso interno por correo. Si no sale, la solicitud igual quedó guardada. */
export function avisoDeSolicitud(s, siteUrl) {
  const filas = [
    ['Qué pidió', s.referencia],
    ['Nombre', s.nombre],
    ['Correo', s.correo],
    ['WhatsApp', s.whatsapp],
    ['Rol', s.rolTexto],
    ['Institución', s.institucion],
    ['Tipo de institución', s.tipoInstitucionTexto],
    ['Cargo', s.cargo],
    ['Áreas de interés', (s.areas || []).join(', ')],
    ['Perfiles', (s.perfiles || []).join(', ')],
    ['Participantes', s.participantes],
    ['Modalidad', s.modalidadTexto],
    ['Necesidad o resultado esperado', s.resultadoEsperado],
    ['Ubicación', [s.ciudad, s.pais].filter(Boolean).join(', ')],
    ['Fecha tentativa', s.fechaTentativa],
    ['Mensaje', s.mensaje],
    ['Acepta novedades', s.aceptaNovedades ? 'Sí' : 'No'],
    ['Página', s.origen],
  ].filter(([, v]) => v);

  return {
    subject: `${TITULOS[s.tipo]}${s.referencia ? ` · ${s.referencia}` : ''}`,
    html: `
      <h2 style="font-family:Arial,sans-serif;color:#082E86">${TITULOS[s.tipo]}</h2>
      <table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">
        ${filas.map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#5b6478;vertical-align:top">${k}</td><td style="padding:4px 0;color:#17223b;white-space:pre-wrap">${escapar(v)}</td></tr>`).join('')}
      </table>
      <p style="font-family:Arial,sans-serif;font-size:13px;color:#5b6478">
        Atiéndela en <a href="${siteUrl}/aula/admin/solicitudes">${siteUrl}/aula/admin/solicitudes</a>.
      </p>`,
  };
}
