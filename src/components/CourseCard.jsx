import { useState } from 'react';

const categoryColors = {
  'Salud y Medicina':                          'bg-teal-50 text-teal-700 border-teal-200',
  'IA y Datos':                               'bg-blue-50 text-blue-700 border-blue-200',
  'Tecnología':                               'bg-purple-50 text-purple-700 border-purple-200',
  'Gestión Empresarial y Calidad':            'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Marketing':                                'bg-rose-50 text-rose-700 border-rose-200',
  'Seguridad, Medio Ambiente y Operaciones':  'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Psicología, Educación y Oficios':          'bg-amber-50 text-amber-700 border-amber-200',
  'Legal, Ofimática e Ingeniería':            'bg-sky-50 text-sky-700 border-sky-200',
  'Idiomas':                                  'bg-orange-50 text-orange-700 border-orange-200',
};

export default function CourseCard({ course, myRoute, onAddRoute }) {
  const chipStyle = categoryColors[course.category] || 'bg-gray-50 text-gray-600 border-gray-200';
  const inRoute = myRoute.includes(course.id);

  return (
    <div className={`card p-4 flex flex-col gap-3 transition-all ${inRoute ? 'ring-2 ring-teal-400 border-teal-200' : ''}`}>
      {/* Category chip */}
      <span className={`chip border text-xs font-medium self-start ${chipStyle}`}>
        {course.category}
      </span>

      {/* Name */}
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-navy-950 leading-snug mb-1">
          {course.name}
        </h4>
        <p className="text-xs text-gray-400 font-mono">{course.code}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <a
          href={course.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-navy-900 text-white text-xs font-semibold rounded-lg hover:bg-navy-800 transition-colors"
        >
          Ver curso
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <button
          onClick={() => onAddRoute(course.id)}
          title={inRoute ? 'Quitar de mi ruta' : 'Agregar a mi ruta'}
          className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
            inRoute
              ? 'bg-teal-600 border-teal-600 text-white hover:bg-teal-700'
              : 'bg-white border-gray-200 text-gray-600 hover:border-teal-400 hover:text-teal-600'
          }`}
        >
          {inRoute ? (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
