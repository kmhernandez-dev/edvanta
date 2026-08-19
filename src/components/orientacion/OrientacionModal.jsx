import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProfessional } from '../../context/ProfessionalContext';
import { trackEvent } from '../../utils/analytics';
import { EDVANTA_COMMUNITY_URL } from '../../config/links';
import {
  SITUACIONES,
  OBJETIVOS,
  AREAS_INTERES,
  NIVELES_EXPERIENCIA,
  buildOrientacionResult,
  saveOrientacionLocal,
} from '../../lib/orientacion';

const OBJETIVO_MAP = {
  'Conseguir mi primer empleo.': 'job',
  'Entrar a la industria farmacéutica.': 'career_choice',
  'Cambiar de área profesional.': 'career_choice',
  'Fortalecer mi perfil actual.': 'specialize',
  'Prepararme para una entrevista.': 'job',
  'Actualizar mis conocimientos.': 'learn',
  'Todavía no sé qué área elegir.': 'career_choice',
};

const NIVEL_MAP = {
  Ninguna: 'exploring',
  Básica: 'junior',
  Intermedia: 'mid',
  Avanzada: 'senior',
};

const AREA_MAP = {
  'Garantía de Calidad': 'Calidad y cumplimiento',
  'Control de Calidad': 'Laboratorio y análisis',
  Producción: 'Producción y operaciones',
  'Asuntos Regulatorios': 'Asuntos regulatorios',
  Farmacovigilancia: 'Farmacovigilancia',
  'Investigación y Desarrollo': 'Investigación y desarrollo',
};

const TOTAL_STEPS = 5; // 4 preguntas + resultado

function CheckIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function OrientacionModal({ open, onClose }) {
  const { user, isAuthenticated } = useAuth();
  const { upsertProfessionalProfile } = useProfessional();

  const [step, setStep] = useState(0); // 0 intro, 1..4 preguntas, 5 resultado
  const [situacion, setSituacion] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [areas, setAreas] = useState([]);
  const [nivel, setNivel] = useState('');
  const [resultado, setResultado] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    if (open) {
      setStep(0);
      setSituacion('');
      setObjetivo('');
      setAreas([]);
      setNivel('');
      setResultado(null);
      setSaving(false);
      setSavedMessage('');
      trackEvent('orientacion_opened', { origin: 'home_hero' });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const toggleArea = area => {
    setAreas(current => current.includes(area) ? current.filter(item => item !== area) : [...current, area]);
  };

  const start = () => {
    setStep(1);
    trackEvent('orientacion_started', {});
  };

  const next = () => {
    if (step === 1 && !situacion) return;
    if (step === 2 && !objetivo) return;
    if (step === 3 && areas.length === 0) return;
    if (step === 4 && !nivel) return;
    if (step === 4) {
      const result = buildOrientacionResult({ situacion, objetivo, areas, nivel });
      setResultado(result);
      if (result) {
        saveOrientacionLocal(result);
        trackEvent('orientacion_completed', {
          area: result.areaSlug,
          objetivo: OBJETIVO_MAP[objetivo] || '',
          nivel: NIVEL_MAP[nivel] || '',
        });
      }
    }
    setStep(current => Math.min(TOTAL_STEPS, current + 1));
  };

  const back = () => setStep(current => Math.max(0, current - 1));

  const saveToProfile = async () => {
    if (!user || !resultado) return;
    setSaving(true);
    setSavedMessage('');
    const mappedInterests = (resultado.areas || [])
      .filter(item => item !== 'No estoy seguro')
      .map(item => AREA_MAP[item])
      .filter(Boolean);
    const payload = {
      experience_level: NIVEL_MAP[nivel] || null,
      professional_goal: OBJETIVO_MAP[objetivo] || null,
      target_career_slug: resultado.professionalCareerSlug || null,
      interests: mappedInterests,
      current_role: situacion === 'Ya trabajo como Químico Farmacéutico.' ? 'Químico Farmacéutico' : null,
    };
    const res = await upsertProfessionalProfile(payload);
    setSaving(false);
    if (res.error) return;
    setSavedMessage('Orientación guardada en tu perfil de Edvanta.');
    trackEvent('orientacion_saved', { area: resultado.areaSlug });
  };

  const questionTitle = step => {
    if (step === 1) return '¿Cuál es tu situación actual?';
    if (step === 2) return '¿Qué quieres conseguir ahora?';
    if (step === 3) return '¿Qué áreas te llaman más la atención?';
    return '¿Qué experiencia tienes en esta área?';
  };

  const renderOptions = () => {
    if (step === 1) {
      return SITUACIONES.map(option => (
        <button key={option} type="button" onClick={() => { setSituacion(option); next(); }} aria-pressed={situacion === option}
          className={`min-h-12 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${situacion === option ? 'border-edvanta-blue bg-edvanta-light text-edvanta-deep' : 'border-edvanta-border bg-white text-slate-700 hover:border-edvanta-blue'}`}>
          {option}
        </button>
      ));
    }
    if (step === 2) {
      return OBJETIVOS.map(option => (
        <button key={option} type="button" onClick={() => { setObjetivo(option); next(); }} aria-pressed={objetivo === option}
          className={`min-h-12 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${objetivo === option ? 'border-edvanta-blue bg-edvanta-light text-edvanta-deep' : 'border-edvanta-border bg-white text-slate-700 hover:border-edvanta-blue'}`}>
          {option}
        </button>
      ));
    }
    if (step === 3) {
      return AREAS_INTERES.map(option => (
        <button key={option} type="button" onClick={() => toggleArea(option)} aria-pressed={areas.includes(option)}
          className={`min-h-12 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${areas.includes(option) ? 'border-edvanta-blue bg-edvanta-light text-edvanta-deep' : 'border-edvanta-border bg-white text-slate-700 hover:border-edvanta-blue'}`}>
          {areas.includes(option) && <CheckIcon className="mb-0.5 mr-1.5 inline h-3.5 w-3.5 text-edvanta-blue" />}
          {option}
        </button>
      ));
    }
    return NIVELES_EXPERIENCIA.map(option => (
      <button key={option} type="button" onClick={() => { setNivel(option); next(); }} aria-pressed={nivel === option}
        className={`min-h-12 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${nivel === option ? 'border-edvanta-blue bg-edvanta-light text-edvanta-deep' : 'border-edvanta-border bg-white text-slate-700 hover:border-edvanta-blue'}`}>
        {option}
      </button>
    ));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-edvanta-deep/40 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label="Orientación profesional gratuita">
      <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl ring-1 ring-edvanta-deep/10" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-edvanta-border px-6 py-5">
          <div>
            <p className="eyebrow-edvanta mb-1">Orientación profesional gratuita</p>
            <h2 className="font-display text-xl font-extrabold text-edvanta-deep">Descubre qué camino profesional puede encajar contigo</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-gray-50 hover:text-slate-600">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6">
          {step === 0 && (
            <div>
              <p className="text-sm leading-6 text-slate-600">
                Cuéntanos un poco sobre tu experiencia, intereses y objetivos. Edvanta organizará una orientación inicial con áreas, competencias y formación recomendada.
              </p>
              <ul className="mt-5 space-y-2.5">
                {['Tu área con mayor afinidad', 'Competencias para comenzar a desarrollar', 'Primer paso y siguientes pasos de formación'].map(item => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-edvanta-light text-edvanta-blue"><CheckIcon className="h-3 w-3" /></span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 rounded-xl border border-edvanta-border bg-edvanta-cream p-3.5 text-xs leading-5 text-slate-500">
                Es una orientación educativa inicial, no reemplaza asesoría laboral ni académica personalizada. Ver{' '}
                <Link to="/descargo-medico" target="_blank" className="font-semibold text-edvanta-blue hover:underline">descargo</Link>.
              </p>
              <button type="button" onClick={start} className="btn-edvanta mt-6 w-full">
                Comenzar diagnóstico
              </button>
            </div>
          )}

          {step >= 1 && step <= 4 && (
            <div>
              <div className="mb-5 flex items-center gap-1.5" aria-hidden="true">
                {[1, 2, 3, 4].map(index => (
                  <span key={index} className={`h-1.5 flex-1 rounded-full ${index <= step ? 'bg-edvanta-blue' : 'bg-slate-200'}`} />
                ))}
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-edvanta-blue">Pregunta {step} de 4</p>
              <h3 className="mt-2 font-display text-xl font-extrabold text-edvanta-deep">{questionTitle(step)}</h3>
              {step === 3 && <p className="mt-1.5 text-sm text-slate-500">Puedes elegir varias áreas.</p>}

              <div className="mt-5 grid gap-2.5">{renderOptions()}</div>

              <div className="mt-6 flex items-center justify-between">
                <button type="button" onClick={back} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-edvanta-deep">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M11 6l-6 6 6 6" /></svg>
                  Atrás
                </button>
                <button type="button" onClick={next} disabled={step === 3 && areas.length === 0}
                  className="inline-flex items-center gap-2 rounded-xl bg-edvanta-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-edvanta-bluedark disabled:cursor-not-allowed disabled:opacity-50">
                  {step === 4 ? 'Ver mi orientación' : 'Continuar'}
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" /></svg>
                </button>
              </div>
            </div>
          )}

          {step === 5 && resultado && (
            <div>
              <p className="eyebrow-edvanta mb-1">Resultado gratuito</p>
              <h3 className="font-display text-2xl font-extrabold text-edvanta-deep">Tu orientación inicial</h3>

              <div className="mt-5 rounded-xl border border-edvanta-blue/30 bg-edvanta-light p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-edvanta-blue">Área con mayor afinidad</p>
                <p className="mt-1 font-display text-xl font-extrabold text-edvanta-deep">{resultado.areaRecomendada}</p>
              </div>

              <div className="mt-5">
                <p className="text-sm font-bold text-edvanta-deep">Competencias que podrías comenzar a desarrollar</p>
                <ul className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
                  {resultado.competencias.map(skill => (
                    <li key={skill} className="flex items-start gap-2 rounded-lg border border-edvanta-border bg-white px-3 py-2 text-sm text-slate-700">
                      <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-edvanta-blue" />
                      {skill}
                    </li>
                  ))}
                </ul>
                <p className="mt-2.5 text-xs leading-5 text-slate-400">
                  Cada competencia se conectará con cursos seleccionados de Edutin, Udemy, Coursera y edX (próxima fase).
                </p>
              </div>

              <div className="mt-5 rounded-xl border border-edvanta-border bg-edvanta-cream p-4">
                <p className="text-sm font-bold text-edvanta-deep">Primer paso recomendado</p>
                <p className="mt-1 text-sm font-semibold text-edvanta-blue">{resultado.primerPaso}</p>
                {resultado.siguientesPasos?.length > 0 && (
                  <>
                    <p className="mt-4 text-sm font-bold text-edvanta-deep">Después podrías continuar con</p>
                    <ul className="mt-1.5 flex flex-wrap gap-1.5">
                      {resultado.siguientesPasos.map(paso => (
                        <li key={paso} className="rounded-full border border-edvanta-border bg-white px-3 py-1 text-xs font-semibold text-slate-600">{paso}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* Conversión a cuenta */}
              <div className="mt-6 rounded-xl border border-edvanta-blue/30 bg-white p-4">
                <p className="font-display text-base font-extrabold text-edvanta-deep">¿Quieres guardar tu orientación?</p>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">
                  Crea tu cuenta gratuita en Edvanta para guardar tu ruta, cursos, recursos y progreso profesional.
                </p>
                {isAuthenticated && user ? (
                  savedMessage ? (
                    <p className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-800">
                      <CheckIcon className="h-4 w-4" /> {savedMessage}
                    </p>
                  ) : (
                    <button type="button" onClick={saveToProfile} disabled={saving}
                      className="btn-edvanta mt-3 w-full disabled:opacity-60">
                      {saving ? 'Guardando...' : 'Guardar orientación en mi perfil'}
                    </button>
                  )
                ) : (
                  <Link to="/cuenta?modo=registro&next=%2Fapp%2Fonboarding" onClick={onClose} className="btn-edvanta mt-3 w-full">
                    Crear mi cuenta gratis
                  </Link>
                )}
              </div>

              <a
                href={EDVANTA_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('community_clicked', { origin: 'orientacion_resultado' })}
                className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-edvanta-border bg-white px-4 py-3 text-sm font-semibold text-edvanta-deep transition hover:border-edvanta-blue"
              >
                Unirme a la comunidad QF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
