import { useState } from 'react';
import { waLink } from '../config/links';

const interests = [
  'Calidad y auditoría',
  'Datos y Power BI',
  'Seguridad, ambiente y sostenibilidad',
  'Proyectos y mejora de procesos',
];

export default function LearningPathForm() {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    pais: '',
    profesion: '',
    interes: interests[0],
    objetivo: '',
    consentimiento: false,
  });

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = (event) => {
    event.preventDefault();
    const message = [
      'Hola, equipo Edvanta. Quiero recibir una ruta de aprendizaje según mi perfil.',
      '',
      `Nombre: ${form.nombre}`,
      `Correo: ${form.correo}`,
      `País: ${form.pais}`,
      `Profesión o área: ${form.profesion}`,
      `Área de interés: ${form.interes}`,
      `Objetivo profesional: ${form.objetivo}`,
    ].join('\n');
    window.open(waLink(message), '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="recursos" className="bg-white py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-teal-600">Orientación personalizada</p>
          <h2 className="text-2xl font-bold text-navy-950 md:text-3xl">
            Recibe una ruta de aprendizaje según tu perfil
          </h2>
          <p className="mt-3 text-base leading-relaxed text-gray-500">
            Cuéntanos tu área, país y objetivo. Te ayudamos a escoger una secuencia de estudio coherente con tus metas.
          </p>
          <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-800">
            Este formulario no reemplaza asesoría laboral, académica ni legal. Solo organiza una orientación inicial de aprendizaje.
          </p>
        </div>

        <form onSubmit={submit} className="rounded-lg border border-gray-200 bg-slate-50 p-5 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-navy-950">
              Nombre
              <input name="nombre" value={form.nombre} onChange={update} required className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal text-gray-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
            </label>
            <label className="text-sm font-semibold text-navy-950">
              Correo
              <input name="correo" type="email" value={form.correo} onChange={update} required className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal text-gray-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
            </label>
            <label className="text-sm font-semibold text-navy-950">
              País
              <input name="pais" value={form.pais} onChange={update} required className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal text-gray-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
            </label>
            <label className="text-sm font-semibold text-navy-950">
              Profesión o área de estudio
              <input name="profesion" value={form.profesion} onChange={update} required className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal text-gray-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
            </label>
            <label className="text-sm font-semibold text-navy-950">
              Área de interés
              <select name="interes" value={form.interes} onChange={update} className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal text-gray-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100">
                {interests.map((interest) => <option key={interest}>{interest}</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold text-navy-950 sm:col-span-2">
              Objetivo profesional
              <textarea name="objetivo" value={form.objetivo} onChange={update} required rows="4" className="mt-1 w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal text-gray-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
            </label>
          </div>

          <label className="mt-4 flex items-start gap-3 text-xs leading-relaxed text-gray-600">
            <input
              type="checkbox"
              name="consentimiento"
              checked={form.consentimiento}
              onChange={update}
              required
              className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            Acepto que Edvanta use estos datos para responder mi solicitud de orientación. No quiero recibir mensajes no solicitados.
          </label>

          <button type="submit" className="btn-teal mt-5 w-full">
            Solicitar ruta
          </button>
        </form>
      </div>
    </section>
  );
}
