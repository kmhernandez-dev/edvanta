/**
 * Administración de cursos: datos, estructura, bloques, recursos,
 * vista previa, publicación y participantes de cada curso.
 */
import express from 'express';
import {
  courseOptions, createCourse, deleteCourse, duplicateCourse, getCourse, getVersion, listCourseAssignments,
  listCourseEnrollments, listCourses, listVersions, publishCheck, publishCourse, readCourse, setCourseStatus,
  updateCourse,
} from '../../lib/aula/courses.js';
import {
  createBlock, createLesson, createModule, deleteBlock, deleteLesson, deleteModule, duplicateBlock,
  duplicateLesson, duplicateModule, getLesson, lessonImpactById, moduleImpact, moveLesson, readBlockInput,
  readLesson, readModule, reorderBlocks, reorderLessons, reorderModules, updateBlock, updateLesson, updateModule,
} from '../../lib/aula/structure.js';
import {
  addResourceVersion, createCategory, createResource, deleteCategory, deleteResource, listResources,
  listResourceVersions, readCategory, readResource, readVersion, reorderResources, setResourceStatus,
  updateCategory, updateResource,
} from '../../lib/aula/resources.js';
import { buildSnapshot } from '../../lib/aula/snapshot.js';
import {
  bool, id as idField, idList, int, oneOf, route, str,
} from '../../lib/aula/http.js';
import { actorOf } from './middleware.js';

const ctx = (req) => ({ actor: actorOf(req), ip: req.aula.ip, now: req.aula.now });
const param = (req, name = 'id') => idField(req.params[name], name, 'El identificador');

export function adminCoursesRouter() {
  const router = express.Router();

  // ── Cursos ────────────────────────────────────────────────
  router.get('/options/courses', route(async (req, res) => {
    res.json(await courseOptions(req.aula.db, { companyId: req.query.companyId }));
  }));
  router.get('/courses', route(async (req, res) => res.json(await listCourses(req.aula.db, req.query))));
  router.post('/courses', route(async (req, res) => {
    res.status(201).json(await createCourse(req.aula.db, readCourse(req.body), ctx(req)));
  }));
  router.get('/courses/:id', route(async (req, res) => res.json(await getCourse(req.aula.db, param(req)))));
  router.patch('/courses/:id', route(async (req, res) => {
    res.json(await updateCourse(req.aula.db, param(req), readCourse(req.body, { partial: true }), ctx(req)));
  }));
  router.post('/courses/:id/status', route(async (req, res) => {
    const target = oneOf(req.body?.status, 'status', 'El estado', ['borrador', 'en_revision', 'archivado', 'restaurar']);
    const reason = str(req.body?.reason, 'reason', 'El motivo', { max: 500, optional: true });
    res.json(await setCourseStatus(req.aula.db, param(req), target, { ...ctx(req), reason }));
  }));
  router.post('/courses/:id/duplicate', route(async (req, res) => {
    const b = req.body || {};
    const options = {
      title: str(b.title, 'title', 'El título', { max: 160, optional: true }),
      kind: oneOf(b.kind, 'kind', 'El tipo', ['edvanta', 'empresa'], { optional: true }),
      companyId: b.companyId ? idField(b.companyId, 'companyId', 'La empresa') : null,
    };
    res.status(201).json(await duplicateCourse(req.aula.db, param(req), options, ctx(req)));
  }));
  router.delete('/courses/:id', route(async (req, res) => {
    const reason = str(req.body?.reason, 'reason', 'El motivo', { max: 500, optional: true });
    res.json(await deleteCourse(req.aula.db, param(req), { ...ctx(req), reason }));
  }));

  // Vista previa: exactamente lo que vería un participante al publicar.
  router.get('/courses/:id/preview', route(async (req, res) => {
    res.json(await buildSnapshot(req.aula.db, param(req)));
  }));

  // ── Publicación y versiones ───────────────────────────────
  router.get('/courses/:id/publish', route(async (req, res) => res.json(await publishCheck(req.aula.db, param(req)))));
  router.post('/courses/:id/publish', route(async (req, res) => {
    const b = req.body || {};
    const options = {
      changeSummary: str(b.changeSummary, 'changeSummary', 'El resumen de cambios', { max: 1000, optional: true }) || '',
      mandatory: bool(b.mandatory, 'mandatory', 'Actualización obligatoria', { optional: true }),
      reopenCompleted: bool(b.reopenCompleted, 'reopenCompleted', 'Reabrir completados', { optional: true }),
    };
    res.status(201).json(await publishCourse(req.aula.db, param(req), options, ctx(req)));
  }));
  router.get('/courses/:id/versions', route(async (req, res) => res.json(await listVersions(req.aula.db, param(req)))));
  router.get('/courses/:id/versions/:versionId', route(async (req, res) => {
    res.json(await getVersion(req.aula.db, param(req), param(req, 'versionId')));
  }));

  // ── Participantes del curso ───────────────────────────────
  router.get('/courses/:id/enrollments', route(async (req, res) => {
    res.json(await listCourseEnrollments(req.aula.db, param(req), req.query));
  }));
  router.get('/courses/:id/assignments', route(async (req, res) => {
    res.json(await listCourseAssignments(req.aula.db, param(req)));
  }));

  // ── Módulos ───────────────────────────────────────────────
  router.post('/courses/:id/modules', route(async (req, res) => {
    const afterModuleId = req.body?.afterModuleId ? idField(req.body.afterModuleId, 'afterModuleId', 'El módulo') : null;
    res.status(201).json(await createModule(req.aula.db, param(req), readModule(req.body), { afterModuleId }));
  }));
  router.put('/courses/:id/modules/order', route(async (req, res) => {
    res.json(await reorderModules(req.aula.db, param(req), idList(req.body?.ids, 'ids', 'Los módulos', { max: 500 })));
  }));
  router.patch('/modules/:id', route(async (req, res) => {
    res.json(await updateModule(req.aula.db, param(req), readModule(req.body, { partial: true })));
  }));
  router.get('/modules/:id/impact', route(async (req, res) => res.json(await moduleImpact(req.aula.db, param(req)))));
  router.delete('/modules/:id', route(async (req, res) => res.json(await deleteModule(req.aula.db, param(req), ctx(req)))));
  router.post('/modules/:id/duplicate', route(async (req, res) => {
    res.status(201).json(await duplicateModule(req.aula.db, param(req)));
  }));

  // ── Clases ────────────────────────────────────────────────
  router.post('/modules/:id/lessons', route(async (req, res) => {
    const afterLessonId = req.body?.afterLessonId ? idField(req.body.afterLessonId, 'afterLessonId', 'La clase') : null;
    res.status(201).json(await createLesson(req.aula.db, param(req), readLesson(req.body), { afterLessonId }));
  }));
  router.put('/modules/:id/lessons/order', route(async (req, res) => {
    res.json(await reorderLessons(req.aula.db, param(req), idList(req.body?.ids, 'ids', 'Las clases', { max: 1000 })));
  }));
  router.get('/lessons/:id', route(async (req, res) => res.json(await getLesson(req.aula.db, param(req)))));
  router.patch('/lessons/:id', route(async (req, res) => {
    res.json(await updateLesson(req.aula.db, param(req), readLesson(req.body, { partial: true })));
  }));
  router.get('/lessons/:id/impact', route(async (req, res) => res.json(await lessonImpactById(req.aula.db, param(req)))));
  router.delete('/lessons/:id', route(async (req, res) => res.json(await deleteLesson(req.aula.db, param(req), ctx(req)))));
  router.post('/lessons/:id/duplicate', route(async (req, res) => {
    res.status(201).json(await duplicateLesson(req.aula.db, param(req)));
  }));
  router.post('/lessons/:id/move', route(async (req, res) => {
    const moduleId = idField(req.body?.moduleId, 'moduleId', 'El módulo');
    const position = int(req.body?.position, 'position', 'La posición', { min: 0, optional: true });
    res.json(await moveLesson(req.aula.db, param(req), { moduleId, position }));
  }));

  // ── Bloques ───────────────────────────────────────────────
  router.post('/lessons/:id/blocks', route(async (req, res) => {
    const b = req.body || {};
    let afterBlockId = null;
    if (b.position === 'inicio') afterBlockId = 0;
    else if (b.afterBlockId) afterBlockId = idField(b.afterBlockId, 'afterBlockId', 'El bloque');
    res.status(201).json(await createBlock(req.aula.db, param(req), readBlockInput(b), { afterBlockId }));
  }));
  router.put('/lessons/:id/blocks/order', route(async (req, res) => {
    res.json(await reorderBlocks(req.aula.db, param(req), idList(req.body?.ids, 'ids', 'Los bloques', { max: 500 })));
  }));
  router.patch('/blocks/:id', route(async (req, res) => res.json(await updateBlock(req.aula.db, param(req), req.body))));
  router.delete('/blocks/:id', route(async (req, res) => res.json(await deleteBlock(req.aula.db, param(req), { now: req.aula.now }))));
  router.post('/blocks/:id/duplicate', route(async (req, res) => {
    res.status(201).json(await duplicateBlock(req.aula.db, param(req)));
  }));

  // ── Recursos de trabajo ───────────────────────────────────
  router.get('/courses/:id/resources', route(async (req, res) => res.json(await listResources(req.aula.db, param(req)))));
  router.put('/courses/:id/resources/order', route(async (req, res) => {
    res.json(await reorderResources(req.aula.db, param(req), idList(req.body?.ids, 'ids', 'Los recursos', { max: 1000 })));
  }));
  router.post('/courses/:id/resource-categories', route(async (req, res) => {
    res.status(201).json(await createCategory(req.aula.db, param(req), readCategory(req.body)));
  }));
  router.patch('/resource-categories/:id', route(async (req, res) => {
    res.json(await updateCategory(req.aula.db, param(req), readCategory(req.body)));
  }));
  router.delete('/resource-categories/:id', route(async (req, res) => {
    res.json(await deleteCategory(req.aula.db, param(req), { now: req.aula.now }));
  }));
  router.post('/courses/:id/resources', route(async (req, res) => {
    const input = readResource(req.body);
    const version = readVersion(req.body, { first: true });
    res.status(201).json(await createResource(req.aula.db, param(req), input, version, ctx(req)));
  }));
  router.patch('/resources/:id', route(async (req, res) => {
    res.json(await updateResource(req.aula.db, param(req), readResource(req.body, { partial: true }), ctx(req)));
  }));
  router.get('/resources/:id/versions', route(async (req, res) => res.json(await listResourceVersions(req.aula.db, param(req)))));
  router.post('/resources/:id/versions', route(async (req, res) => {
    const version = readVersion(req.body);
    const notifyParticipants = bool(req.body?.notify, 'notify', 'Avisar', { optional: true });
    res.status(201).json(await addResourceVersion(req.aula.db, param(req), version, { ...ctx(req), notifyParticipants }));
  }));
  router.post('/resources/:id/status', route(async (req, res) => {
    res.json(await setResourceStatus(req.aula.db, param(req), req.body?.status, ctx(req)));
  }));
  router.delete('/resources/:id', route(async (req, res) => res.json(await deleteResource(req.aula.db, param(req), ctx(req)))));

  return router;
}
