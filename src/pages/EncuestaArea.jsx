/**
 * ============================================================
 *  EncuestaArea.jsx — /encuesta/:area · Encuestas por área
 *
 *  Una página corta por área (calidad, farmacia clínica,
 *  farmacología, asuntos regulatorios y webinars). Cada una pregunta
 *  lo que la persona necesita, guarda la respuesta como solicitud de
 *  interés con su propia referencia y abre WhatsApp con las respuestas.
 *  Debajo, las guías y la escuela del área: quien ya sabe lo que quiere
 *  no tiene que esperar.
 *
 *  Las respuestas se leen en el panel de solicitudes, filtrando por la
 *  referencia «encuesta-<area>».
 * ============================================================
 */

import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import SiteHeader from '../components/edvanta/SiteHeader';
import SiteFooter from '../components/edvanta/SiteFooter';
import { EncuestaRapida, PortadaGenerada } from '../components/edvanta/catalogo';
import { BotonWhatsApp } from '../components/edvanta/embudo';
import { ROLES_PROFESIONALES } from '../data/edvanta/catalogoInicio';
import { GUIAS_VENTA, MARCAS } from '../data/guiasVenta';
import { updatePageSeo } from '../utils/seo';

const MODALIDADES = [
  ['aula', 'A mi ritmo, en el aula virtual'],
  ['en-vivo', 'En vivo, por videollamada'],
  ['combinada', 'Combinado'],
];

export const ENCUESTAS = {
  calidad: {
    nombre: 'Calidad',
    h1: 'Dinos qué te quita tiempo en calidad y te decimos por dónde empezar',
    seo: 'Encuesta de calidad farmacéutica: BPM, validaciones, CAPA y auditorías',
    temas: ['BPM e INVIMA', 'Validaciones', 'Gestión documental y POE', 'Auditorías internas', 'Desviaciones y CAPA', 'Control de calidad', 'Integridad de datos', 'ISO 9001', 'IA para el área de calidad'],
    pregunta: '¿Qué tema de calidad necesitas resolver?',
    idea: '¿Qué tarea de calidad te gustaría hacer en la mitad del tiempo? (opcional)',
    areas: ['calidad', 'gestion'],
    escuela: ['/escuelas/calidad-y-produccion-farmaceutica', 'Escuela de Calidad y Producción'],
  },
  'farmacia-clinica': {
    nombre: 'Farmacia clínica',
    h1: '¿Qué caso clínico quieres resolver con más seguridad?',
    seo: 'Encuesta de farmacia clínica: seguimiento, conciliación y farmacovigilancia',
    temas: ['Seguimiento farmacoterapéutico', 'Conciliación de medicamentos', 'Problemas farmacoterapéuticos', 'Farmacovigilancia', 'Entrevista y educación al paciente', 'Farmacocinética clínica', 'Antimicrobianos (PROA)', 'IA para la práctica clínica'],
    pregunta: '¿Qué quieres fortalecer en tu práctica clínica?',
    idea: '¿Qué caso te gustaría que resolviéramos en un curso? (opcional)',
    areas: ['farmacia-clinica'],
    escuela: ['/escuelas/salud-y-farmacia-clinica', 'Escuela de Salud y Farmacia Clínica'],
  },
  farmacologia: {
    nombre: 'Farmacología',
    h1: '¿Qué grupo de medicamentos quieres dominar?',
    seo: 'Encuesta de farmacología: qué grupos de medicamentos quieres estudiar',
    temas: ['Cardiovascular', 'Sistema nervioso central', 'Oncología', 'Endocrino y diabetes', 'Respiratorio', 'Renal', 'Antimicrobianos', 'Interacciones', 'Farmacocinética'],
    pregunta: '¿Qué farmacología quieres estudiar?',
    idea: '¿Qué medicamento o interacción te genera más dudas? (opcional)',
    areas: ['farmacologia', 'farmacia-clinica'],
    escuela: ['/escuelas/salud-y-farmacia-clinica', 'Escuela de Salud y Farmacia Clínica'],
  },
  'asuntos-regulatorios': {
    nombre: 'Asuntos regulatorios',
    h1: '¿Qué trámite o norma sanitaria te está costando?',
    seo: 'Encuesta de asuntos regulatorios: registro sanitario INVIMA y normativa',
    temas: ['Registro sanitario INVIMA', 'Medicamentos de síntesis', 'Biológicos y biosimilares', 'Dispositivos médicos', 'Cosméticos', 'Fitoterapéuticos y suplementos', 'Publicidad de medicamentos', 'Farmacovigilancia regulatoria'],
    pregunta: '¿Qué tema regulatorio necesitas?',
    idea: '¿Qué trámite te gustaría ver explicado paso a paso? (opcional)',
    areas: [],
    escuela: ['/escuelas/asuntos-regulatorios', 'Escuela de Asuntos Regulatorios'],
  },
  webinars: {
    nombre: 'Webinars',
    h1: 'Elige el tema del próximo webinar de Edvanta',
    seo: 'Webinars de Edvanta para químicos farmacéuticos: vota el próximo tema',
    temas: ['Farmacia clínica', 'Calidad y BPM', 'Asuntos regulatorios', 'Farmacología', 'IA para químicos farmacéuticos', 'Empleo y LinkedIn', 'Marketing farmacéutico'],
    pregunta: '¿Sobre qué quieres un webinar?',
    idea: '¿Qué día y hora te sirven? (opcional)',
    modalidad: '¿Cómo prefieres verlo?',
    modalidades: [['en-vivo', 'En vivo, con preguntas'], ['aula', 'Grabado, para verlo a mi ritmo'], ['combinada', 'Las dos']],
    desc: 'Vota por el tema y la forma de verlo. Te avisamos por WhatsApp cuando abra la inscripción.',
    areas: ['calidad', 'farmacia-clinica', 'carrera'],
    escuela: ['/escuelas', 'Todas las escuelas'],
  },
};

export default function EncuestaArea() {
  const { area } = useParams();
  const e = ENCUESTAS[area];

  useEffect(() => {
    if (!e) return;
    updatePageSeo({
      title: `${e.seo} | Edvanta`,
      description: `${e.desc || 'Responde tres preguntas en un minuto y sigue por WhatsApp: te recomendamos el curso o la guía para empezar.'}`.slice(0, 158),
      canonical: `https://edvanta.co/encuesta/${area}`,
      keywords: e.temas.slice(0, 6),
    });
  }, [e, area]);

  if (!e) return <Navigate to="/" replace />;
  const guias = GUIAS_VENTA.filter((g) => g.marca !== 'fst' && e.areas.includes(g.area)).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main>
        <section className="ds-surface-glow overflow-hidden">
          <div className="ed-grid pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto max-w-5xl px-4 pb-4 pt-12 sm:px-6 lg:px-8 lg:pt-16">
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-edvanta-tealdark">Encuesta · {e.nombre}</p>
            <h1 className="mt-3 max-w-3xl font-display text-[2rem] font-extrabold leading-[1.08] tracking-[-0.02em] text-edvanta-deep [text-wrap:balance] sm:text-5xl">{e.h1}</h1>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-edvanta-muted">
              {['Un minuto, tres preguntas', 'Recomendación según tu perfil', 'Seguimos por WhatsApp'].map((t) => (
                <li key={t} className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-edvanta-teal" aria-hidden="true" />{t}</li>
              ))}
            </ul>
          </div>
        </section>

        <EncuestaRapida
          referencia={`encuesta-${area}`}
          eyebrow="Tu respuesta"
          titulo={e.pregunta}
          desc={e.desc || 'Al final abrimos WhatsApp con tus respuestas para recomendarte el curso o la guía que te sirve.'}
          temas={e.temas}
          roles={ROLES_PROFESIONALES}
          modalidades={e.modalidades || MODALIDADES}
          preguntaModalidad={e.modalidad}
          preguntaTemas={e.pregunta}
          preguntaIdea={e.idea}
        />

        <section className="border-t border-edvanta-border bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.16em] text-edvanta-tealdark">¿Ya sabes lo que buscas?</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-edvanta-deep sm:text-3xl">Empieza hoy con {e.nombre.toLowerCase()}</h2>
              </div>
              <Link to={e.escuela[0]} className="ed-btn ed-btn--secondary">{e.escuela[1]}<ArrowRight className="ed-btn__arrow" aria-hidden="true" /></Link>
            </div>
            {guias.length > 0 ? (
              <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
                {guias.map((g) => (
                  <Link key={g.slug} to={`/guia/${g.slug}`} className="group">
                    <div className="aspect-[4/5] overflow-hidden rounded-[var(--ds-r-lg)] bg-edvanta-bg ring-1 ring-edvanta-border transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[var(--ds-sh-md)]">
                      {g.portada ? <img src={g.portada} alt="" loading="lazy" className="h-full w-full object-contain p-2" /> : <PortadaGenerada titulo={g.titulo} sello={MARCAS[g.marca].sello} tono={g.marca === 'atenfarma' ? 1 : 0} />}
                    </div>
                    <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-edvanta-deep group-hover:text-edvanta-blue">{g.titulo}</h3>
                    <p className="mt-1 inline-flex items-center gap-1 text-[13px] font-semibold text-edvanta-tealdark">Ver la guía <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-8 flex flex-wrap items-center gap-4 rounded-[var(--ds-r-lg)] border border-edvanta-border bg-edvanta-bg p-6">
                <p className="flex-1 text-[15px] leading-7 text-edvanta-muted">Estudia gratis los cursos de la escuela y pide el certificado verificable cuando lo necesites.</p>
                <BotonWhatsApp mensaje={`Hola, equipo Edvanta. Quiero orientación sobre ${e.nombre.toLowerCase()}.`} origen={`encuesta-${area}-sin-guias`} />
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
