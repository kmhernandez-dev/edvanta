import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import MedicationTable from '../components/atenfarma/MedicationTable';
import ClinicalAssessment from '../components/atenfarma/ClinicalAssessment';
import DrugProblemForm from '../components/atenfarma/DrugProblemForm';
import CarePlanBuilder from '../components/atenfarma/CarePlanBuilder';
import InterventionGenerator from '../components/atenfarma/InterventionGenerator';
import FollowUpTimeline from '../components/atenfarma/FollowUpTimeline';
import ClinicalCalculator from '../components/atenfarma/ClinicalCalculator';
import MethodologySelector from '../components/atenfarma/MethodologySelector';
import ProfessionalDisclaimer from '../components/atenfarma/ProfessionalDisclaimer';
import {
  workspaceNav,
  demoPatient,
  demoCases,
  methodologies,
  calculators,
  professionalDisclaimer,
  documentDisclaimer,
} from '../data/atenfarma-clinic';
import { updatePageSeo } from '../utils/seo';

const STORAGE_KEY = 'atenfarma_workspace_demo';

function loadDemoData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore */ }
  return {
    patient: { ...demoPatient },
    medications: [...demoPatient.medications],
    assessment: {},
    problems: [],
    carePlan: [],
    followUps: [],
    methodology: 'minnesota',
  };
}

function saveDemoData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) { /* ignore */ }
}

export default function AtenFarmaWorkspace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'panel';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [data, setData] = useState(() => loadDemoData());
  const [lastSaved, setLastSaved] = useState(new Date());

  // Auto-save
  useEffect(() => {
    saveDemoData(data);
    setLastSaved(new Date());
  }, [data]);

  // Update URL when tab changes
  useEffect(() => {
    if (activeTab !== 'panel') {
      setSearchParams({ tab: activeTab }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [activeTab, setSearchParams]);

  // SEO
  useEffect(() => {
    updatePageSeo({
      title: 'Workspace Clínico | AtenFarmaClinic',
      description: 'Entorno demostrativo para evaluación farmacoterapéutica, identificación de problemas, planes de cuidado e intervenciones farmacéuticas.',
      canonical: 'https://edvanta.co/atenfarmaclinic/workspace',
    });
  }, []);

  const resetDemoData = () => {
    if (!window.confirm('¿Restablecer los datos de demostración? Se perderán todos los cambios.')) return;
    localStorage.removeItem(STORAGE_KEY);
    setData({
      patient: { ...demoPatient },
      medications: [...demoPatient.medications],
      assessment: {},
      problems: [],
      carePlan: [],
      followUps: [],
      methodology: 'minnesota',
    });
  };

  const updateField = useCallback((key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
  }, []);

  const updatePatient = useCallback((field, value) => {
    setData(prev => ({
      ...prev,
      patient: { ...prev.patient, [field]: value },
    }));
  }, []);

  const updatePatientDemographics = useCallback((field, value) => {
    setData(prev => ({
      ...prev,
      patient: {
        ...prev.patient,
        demographics: { ...prev.patient.demographics, [field]: value },
      },
    }));
  }, []);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `caso-demo-${data.patient.id}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateReport = () => {
    const win = window.open('', '_blank', 'width=800,height=700');
    const p = data.patient;
    const meds = data.medications;
    const problems = data.problems;
    const plan = data.carePlan;
    const fus = data.followUps;
    const method = methodologies.find(m => m.id === data.methodology);

    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Informe - ${p.caseName}</title>
<style>body{font-family:system-ui,sans-serif;font-size:12px;line-height:1.6;max-width:800px;margin:0 auto;padding:20px;color:#1a1a2e}
h1{font-size:18px;border-bottom:2px solid #0d9488;padding-bottom:8px}
h2{font-size:14px;color:#0d9488;margin-top:20px}
table{width:100%;border-collapse:collapse;margin:10px 0}
th,td{border:1px solid #e2e8f0;padding:6px 8px;text-align:left}
th{background:#f1f5f9;font-weight:600}
.disclaimer{background:#fffbeb;border:1px solid #fcd34d;padding:10px;margin-top:20px;font-size:11px;color:#92400e}
</style></head><body>
<h1>Informe Clínico Farmacéutico</h1>
<p><strong>Caso:</strong> ${p.caseName}</p>
<p><strong>Estado:</strong> ${p.status} | <strong>Metodología:</strong> ${method?.name || 'N/A'}</p>
<p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-CO')} | <strong>Profesional:</strong> Q.F. [Nombre]</p>

<h2>Información del paciente</h2>
<p>Edad: ${p.demographics.age} | Sexo: ${p.demographics.sex} | Peso: ${p.demographics.weight} kg | Altura: ${p.demographics.height} cm</p>
<p>Motivo: ${p.demographics.reason}</p>

<h2>Medicamentos (${meds.length})</h2>
<table><tr><th>Principio activo</th><th>Indicación</th><th>Dosis</th><th>Frecuencia</th><th>Vía</th><th>Estado</th></tr>
${meds.map(m => `<tr><td>${m.active}</td><td>${m.indication}</td><td>${m.dose} ${m.unit}</td><td>${m.frequency}</td><td>${m.route}</td><td>${m.status}</td></tr>`).join('')}
</table>

<h2>Problemas identificados (${problems.length})</h2>
${problems.length > 0 ? `<table><tr><th>Problema</th><th>Categoría</th><th>Causa</th><th>Prioridad</th><th>Estado</th></tr>
${problems.map(pr => `<tr><td>${pr.problem}</td><td>${pr.category} ${pr.code || ''}</td><td>${pr.cause || ''}</td><td>${pr.priority}</td><td>${pr.status}</td></tr>`).join('')}
</table>` : '<p>No se han identificado problemas.</p>'}

<h2>Plan de cuidado (${plan.length})</h2>
${plan.length > 0 ? `<table><tr><th>Objetivo</th><th>Problema</th><th>Intervención</th><th>Estado</th></tr>
${plan.map(g => `<tr><td>${g.objective}</td><td>${g.problem}</td><td>${g.intervention || ''}</td><td>${g.status}</td></tr>`).join('')}
</table>` : '<p>No se ha definido un plan de cuidado.</p>'}

<h2>Seguimientos (${fus.length})</h2>
${fus.length > 0 ? `<table><tr><th>Fecha</th><th>Problema</th><th>Resultado</th><th>Estado</th></tr>
${fus.map(f => `<tr><td>${f.date}</td><td>${f.problem}</td><td>${f.clinicalResult || ''}</td><td>${f.status}</td></tr>`).join('')}
</table>` : '<p>No hay seguimientos registrados.</p>'}

<div class="disclaimer">
<p><strong>Aviso:</strong> ${documentDisclaimer}</p>
<p>${professionalDisclaimer}</p>
<p>Caso ficticio con fines exclusivamente educativos. No corresponde a ningún paciente real.</p>
</div>
</body></html>`;

    win.document.write(html);
    win.document.close();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'panel':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-deepblue-900">Panel de control</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <p className="text-[11px] font-semibold text-gray-500 mb-1">Casos activos</p>
                <p className="text-2xl font-bold text-deepblue-900">1</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <p className="text-[11px] font-semibold text-gray-500 mb-1">Medicamentos</p>
                <p className="text-2xl font-bold text-deepblue-900">{data.medications.length}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <p className="text-[11px] font-semibold text-gray-500 mb-1">Problemas</p>
                <p className="text-2xl font-bold text-amber-600">{data.problems.length}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <p className="text-[11px] font-semibold text-gray-500 mb-1">Seguimientos</p>
                <p className="text-2xl font-bold text-teal-600">{data.followUps.length}</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-deepblue-900 mb-3">Resumen del caso</h3>
                <div className="space-y-2 text-xs text-gray-600">
                  <p><span className="font-medium text-gray-500">Caso:</span> {data.patient.caseName}</p>
                  <p><span className="font-medium text-gray-500">Estado:</span> {data.patient.status}</p>
                  <p><span className="font-medium text-gray-500">Metodología:</span> {methodologies.find(m => m.id === data.methodology)?.name || 'N/A'}</p>
                  <p><span className="font-medium text-gray-500">Paciente:</span> {data.patient.demographics.age} años, {data.patient.demographics.sex}</p>
                  <p><span className="font-medium text-gray-500">Condiciones:</span> {data.patient.healthConditions.map(h => h.name).join(', ')}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-deepblue-900 mb-3">Acciones rápidas</h3>
                <div className="space-y-2">
                  <button onClick={() => setActiveTab('historia')} className="w-full text-left px-3 py-2 text-xs font-medium text-deepblue-700 bg-deepblue-50 hover:bg-deepblue-100 rounded-lg transition-colors">
                    Completar historia farmacoterapéutica
                  </button>
                  <button onClick={() => setActiveTab('evaluacion')} className="w-full text-left px-3 py-2 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors">
                    Evaluar farmacoterapia
                  </button>
                  <button onClick={() => setActiveTab('problemas')} className="w-full text-left px-3 py-2 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors">
                    Identificar problemas
                  </button>
                  <button onClick={generateReport} className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    Generar informe
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs text-amber-700">
                <span className="font-semibold">Modo demostrativo.</span> Los datos se almacenan localmente en tu navegador. Todos los casos son ficticios y educativos.
              </p>
            </div>
          </div>
        );

      case 'casos':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-deepblue-900">Casos clínicos demostrativos</h2>
            <p className="text-xs text-gray-500">Selecciona un caso para cargarlo en el workspace. Todos los casos son ficticios.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {demoCases.map(c => (
                <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-teal-200 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700">{c.setting}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">{c.level}</span>
                  </div>
                  <h3 className="text-sm font-bold text-deepblue-900 mb-2">{c.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">{c.summary}</p>
                  <p className="text-[10px] text-amber-600 mb-3">{c.disclaimer}</p>
                  <button
                    onClick={() => {
                      if (!window.confirm('¿Cargar este caso? Se reemplazarán los datos actuales.')) return;
                      setData(loadDemoData());
                    }}
                    className="w-full px-4 py-2 text-xs font-semibold text-white bg-deepblue-800 hover:bg-deepblue-900 rounded-lg transition-colors"
                  >
                    Cargar caso demo
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'historia':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-deepblue-900">Historia farmacoterapéutica</h2>
            <ProfessionalDisclaimer text="Todos los datos corresponden a un caso ficticio con fines educativos." compact />

            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
              <h3 className="text-sm font-bold text-deepblue-900">Información demográfica</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Edad</label>
                  <input type="number" value={data.patient.demographics.age} onChange={e => updatePatientDemographics('age', parseInt(e.target.value) || '')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Sexo</label>
                  <select value={data.patient.demographics.sex} onChange={e => updatePatientDemographics('sex', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200">
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Peso (kg)</label>
                  <input type="number" value={data.patient.demographics.weight} onChange={e => updatePatientDemographics('weight', parseFloat(e.target.value) || '')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Altura (cm)</label>
                  <input type="number" value={data.patient.demographics.height} onChange={e => updatePatientDemographics('height', parseFloat(e.target.value) || '')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Motivo de evaluación</label>
                <textarea value={data.patient.demographics.reason} onChange={e => updatePatientDemographics('reason', e.target.value)} rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 resize-none" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
              <h3 className="text-sm font-bold text-deepblue-900">Problemas de salud</h3>
              {data.patient.healthConditions.map((hc, i) => (
                <div key={hc.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                  <input value={hc.name} onChange={e => {
                    const updated = [...data.patient.healthConditions];
                    updated[i] = { ...updated[i], name: e.target.value };
                    setData(prev => ({ ...prev, patient: { ...prev.patient, healthConditions: updated } }));
                  }} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
                  <select value={hc.controlled} onChange={e => {
                    const updated = [...data.patient.healthConditions];
                    updated[i] = { ...updated[i], controlled: e.target.value };
                    setData(prev => ({ ...prev, patient: { ...prev.patient, healthConditions: updated } }));
                  }} className="border border-gray-200 rounded-lg px-2 py-2 text-xs">
                    <option value="Sí">Controlado</option>
                    <option value="Parcialmente">Parcial</option>
                    <option value="No">No controlado</option>
                  </select>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
              <h3 className="text-sm font-bold text-deepblue-900">Alergias y reacciones adversas</h3>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Alergias</label>
                <input value={data.patient.allergies.join(', ')} onChange={e => {
                  setData(prev => ({ ...prev, patient: { ...prev.patient, allergies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } }));
                }} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Reacciones adversas previas</label>
                <input value={data.patient.adverseReactions.join(', ')} onChange={e => {
                  setData(prev => ({ ...prev, patient: { ...prev.patient, adverseReactions: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } }));
                }} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
              <h3 className="text-sm font-bold text-deepblue-900">Resultados clínicos relevantes</h3>
              {data.patient.labResults.map((lr, i) => (
                <div key={i} className="grid grid-cols-4 gap-2 bg-gray-50 rounded-lg p-3">
                  <input value={lr.test} onChange={e => {
                    const updated = [...data.patient.labResults];
                    updated[i] = { ...updated[i], test: e.target.value };
                    setData(prev => ({ ...prev, patient: { ...prev.patient, labResults: updated } }));
                  }} className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs" placeholder="Prueba" />
                  <input value={lr.value} onChange={e => {
                    const updated = [...data.patient.labResults];
                    updated[i] = { ...updated[i], value: e.target.value };
                    setData(prev => ({ ...prev, patient: { ...prev.patient, labResults: updated } }));
                  }} className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs" placeholder="Valor" />
                  <input value={lr.unit} onChange={e => {
                    const updated = [...data.patient.labResults];
                    updated[i] = { ...updated[i], unit: e.target.value };
                    setData(prev => ({ ...prev, patient: { ...prev.patient, labResults: updated } }));
                  }} className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs" placeholder="Unidad" />
                  <input type="date" value={lr.date} onChange={e => {
                    const updated = [...data.patient.labResults];
                    updated[i] = { ...updated[i], date: e.target.value };
                    setData(prev => ({ ...prev, patient: { ...prev.patient, labResults: updated } }));
                  }} className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs" />
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
              <h3 className="text-sm font-bold text-deepblue-900">Adherencia y barreras</h3>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Adherencia</label>
                <textarea value={data.patient.adherence} onChange={e => updatePatient('adherence', e.target.value)} rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 resize-none" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Barreras</label>
                <input value={data.patient.barriers.join(', ')} onChange={e => {
                  setData(prev => ({ ...prev, patient: { ...prev.patient, barriers: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } }));
                }} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Objetivos del paciente</label>
                <textarea value={data.patient.patientGoals} onChange={e => updatePatient('patientGoals', e.target.value)} rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 resize-none" />
              </div>
            </div>
          </div>
        );

      case 'medicamentos':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-deepblue-900">Tabla de medicamentos</h2>
            <MedicationTable
              medications={data.medications}
              onUpdate={meds => updateField('medications', meds)}
            />
          </div>
        );

      case 'evaluacion':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-deepblue-900">Evaluación farmacoterapéutica</h2>
            <ClinicalAssessment
              medications={data.medications}
              assessment={data.assessment}
              onUpdate={val => updateField('assessment', val)}
            />
          </div>
        );

      case 'problemas':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-deepblue-900">Problemas farmacoterapéuticos</h2>
            <MethodologySelector
              selected={data.methodology}
              onChange={val => updateField('methodology', val)}
              methodologies={methodologies}
            />
            <DrugProblemForm
              methodology={data.methodology}
              problems={data.problems}
              onUpdate={val => updateField('problems', val)}
            />
          </div>
        );

      case 'plan':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-deepblue-900">Plan de cuidado</h2>
            <CarePlanBuilder
              problems={data.problems}
              carePlan={data.carePlan}
              onUpdate={val => updateField('carePlan', val)}
            />
          </div>
        );

      case 'intervenciones':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-deepblue-900">Generador de intervenciones</h2>
            <InterventionGenerator
              caseName={data.patient.caseName}
              problems={data.problems}
              medications={data.medications}
            />
          </div>
        );

      case 'seguimiento':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-deepblue-900">Seguimiento clínico</h2>
            <FollowUpTimeline
              followUps={data.followUps}
              onUpdate={val => updateField('followUps', val)}
            />
          </div>
        );

      case 'informes':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-deepblue-900">Generar informe</h2>
            <p className="text-xs text-gray-500">Genera un informe imprimible con el resumen del caso, medicamentos, hallazgos, problemas, plan de cuidado y seguimientos.</p>
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
              <div className="space-y-2 text-xs text-gray-600">
                <p><span className="font-medium">Caso:</span> {data.patient.caseName}</p>
                <p><span className="font-medium">Metodología:</span> {methodologies.find(m => m.id === data.methodology)?.name || 'N/A'}</p>
                <p><span className="font-medium">Medicamentos:</span> {data.medications.length}</p>
                <p><span className="font-medium">Problemas:</span> {data.problems.length}</p>
                <p><span className="font-medium">Plan de cuidado:</span> {data.carePlan.length} objetivos</p>
                <p><span className="font-medium">Seguimientos:</span> {data.followUps.length}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={generateReport} className="px-4 py-2 text-sm font-semibold text-white bg-deepblue-800 hover:bg-deepblue-900 rounded-lg transition-colors">
                  Generar informe imprimible
                </button>
                <button onClick={exportJSON} className="px-4 py-2 text-sm font-semibold text-teal-700 border border-teal-200 hover:bg-teal-50 rounded-lg transition-colors">
                  Exportar JSON
                </button>
              </div>
              <ProfessionalDisclaimer text={documentDisclaimer} compact />
            </div>
          </div>
        );

      case 'calculadoras':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-deepblue-900">Calculadoras clínicas</h2>
            <p className="text-xs text-gray-500">Herramientas de apoyo para cálculos farmacocinéticos y antropométricos. No sustituyen el juicio profesional.</p>
            <div className="grid lg:grid-cols-3 gap-4">
              {calculators.map(calc => (
                <ClinicalCalculator key={calc.id} calculator={calc} />
              ))}
            </div>
          </div>
        );

      case 'biblioteca':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-deepblue-900">Biblioteca</h2>
            <p className="text-xs text-gray-500">Recursos de apoyo para la práctica clínica. Contenido en desarrollo.</p>
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6C10 4.5 7 4 4 4.5v13C7 17 10 17.5 12 19m0-13c2-1.5 5-2 8-1.5v13c-3-.5-6 0-8 1.5m0-13v13" />
              </svg>
              <p className="text-sm text-gray-500">La biblioteca de protocolos y referencias estará disponible próximamente.</p>
              <Link to="/atenfarmaclinic#biblioteca" className="text-xs text-teal-600 hover:text-teal-700 mt-2 inline-block">
                Volver a recursos de formación
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-deepblue-900 text-white transform transition-transform lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Link to="/atenfarmaclinic" className="flex items-center gap-2">
            <img src="/img/port-logoatenfarmaclinic.jpg" alt="" className="w-7 h-7 rounded-lg object-contain bg-white" width="28" height="28" />
            <span className="text-sm font-bold">AtenFarmaClinic</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-white/60 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <nav className="p-3 space-y-0.5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 65px)' }}>
          {workspaceNav.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                activeTab === item.id
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d={
                  item.icon === 'chart' ? 'M5 19V11M10 19V5M15 19v-6M20 19V8M4 21h16' :
                  item.icon === 'beaker' ? 'M9 4h6M10 4v5l-4.5 8A2 2 0 0 0 7.3 20h9.4a2 2 0 0 0 1.8-3L14 9V4M7.5 14h9' :
                  item.icon === 'clipboard' ? 'M9 5h6a1 1 0 0 1 1 1v0a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v0a1 1 0 0 1 1-1Zm-1 1H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-2' :
                  item.icon === 'pill' ? 'M10.5 20.5 20 11a4.95 4.95 0 0 0-7-7l-9.5 9.5a4.95 4.95 0 0 0 7 7ZM8.5 6.5l9 9' :
                  item.icon === 'scale' ? 'M12 4v16M7 20h10M6 4h12M6 4 3 11h6L6 4Zm12 0-3 7h6l-3-7Z' :
                  item.icon === 'shield' ? 'M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Zm-2.5 8.5 1.8 1.8 3.7-3.8' :
                  item.icon === 'heart' ? 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z' :
                  item.icon === 'message' ? 'M4 5h16v11H9l-5 4V5Z' :
                  item.icon === 'clock' ? 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2' :
                  item.icon === 'list' ? 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01' :
                  'M12 6C10 4.5 7 4 4 4.5v13C7 17 10 17.5 12 19m0-13c2-1.5 5-2 8-1.5v13c-3-.5-6 0-8 1.5m0-13v13'
                } />
              </svg>
              {item.label}
            </button>
          ))}
          <div className="pt-3 mt-3 border-t border-white/10 space-y-1">
            <button onClick={resetDemoData} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors text-left">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
              Restablecer datos demo
            </button>
            <Link to="/atenfarmaclinic" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              Salir al sitio público
            </Link>
          </div>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 text-gray-500 hover:text-deepblue-900 rounded-lg hover:bg-gray-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-deepblue-900 truncate">{data.patient.caseName}</h1>
                <p className="text-[10px] text-gray-400">
                  {data.patient.status} · {methodologies.find(m => m.id === data.methodology)?.name?.split(' ')[0] || 'N/A'} · Guardado: {lastSaved.toLocaleTimeString('es-CO')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={generateReport} className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-teal-700 border border-teal-200 hover:bg-teal-50 rounded-lg transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Informe
              </button>
              <button onClick={exportJSON} className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">
                Exportar
              </button>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
