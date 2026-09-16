/**
 * Bitácora de acciones administrativas. La tabla solo admite inserciones
 * (un disparador bloquea cambios y borrados).
 */

// Etiquetas legibles para el panel de auditoría.
export const AUDIT_ACTIONS = {
  'admin.designado': 'Administrador designado',
  'usuario.crear': 'Participante creado',
  'usuario.editar': 'Participante editado',
  'usuario.suspender': 'Cuenta suspendida',
  'usuario.reactivar': 'Cuenta reactivada',
  'usuario.eliminar': 'Participante eliminado',
  'usuario.rol': 'Cambio de rol',
  'usuario.invitar': 'Invitación enviada',
  'usuario.importar': 'Importación de participantes',
  'empresa.crear': 'Empresa creada',
  'empresa.editar': 'Empresa editada',
  'empresa.eliminar': 'Empresa eliminada',
  'grupo.crear': 'Grupo creado',
  'grupo.editar': 'Grupo editado',
  'grupo.eliminar': 'Grupo eliminado',
  'grupo.miembros': 'Cambio de miembros de grupo',
  'curso.crear': 'Curso creado',
  'curso.editar': 'Curso editado',
  'curso.duplicar': 'Curso duplicado',
  'curso.publicar': 'Versión publicada',
  'curso.estado': 'Cambio de estado del curso',
  'curso.eliminar': 'Curso eliminado',
  'contenido.eliminar': 'Contenido eliminado',
  'recurso.version': 'Recurso reemplazado',
  'recurso.editar': 'Recurso editado',
  'asignacion.crear': 'Curso asignado',
  'asignacion.revocar': 'Asignación revocada',
  'inscripcion.retirar': 'Participante retirado',
  'inscripcion.reactivar': 'Inscripción reactivada',
  'inscripcion.fechas': 'Cambio de fechas de inscripción',
  'inscripcion.actualizacion': 'Actualización obligatoria asignada',
  'evaluacion.revisar': 'Respuesta abierta calificada',
  'nota.cambiar': 'Nota modificada',
  'actividad.revisar': 'Entrega revisada',
  'foro.moderar': 'Moderación de foro',
  'anuncio.publicar': 'Anuncio publicado',
  'reporte.exportar': 'Reporte exportado',
  'demo.eliminar': 'Datos demostrativos eliminados',
  'demo.crear': 'Datos demostrativos creados',
};

export async function audit(db, {
  actor, action, entityType, entityId = null, courseId = null, companyId = null,
  summary, before = null, after = null, reason = null, ip = null,
}) {
  await db.query(
    `INSERT INTO aula_audit_log
       (actor_id, actor_email, action, entity_type, entity_id, course_id, company_id,
        summary, before_data, after_data, reason, ip)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
    [
      actor?.id ?? null,
      actor?.email ?? null,
      action,
      entityType,
      entityId,
      courseId,
      companyId,
      summary,
      before === null ? null : JSON.stringify(before),
      after === null ? null : JSON.stringify(after),
      reason,
      ip,
    ],
  );
}
