import { useState } from 'react';
import { interventionTemplates, documentDisclaimer } from '../../data/atenfarma-clinic';

export default function InterventionGenerator({ caseName, problems, medications }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [content, setContent] = useState({});
  const [generated, setGenerated] = useState('');

  const handleGenerate = () => {
    if (!selectedTemplate) return;

    const template = interventionTemplates.find(t => t.id === selectedTemplate);
    let text = '';

    switch (selectedTemplate) {
      case 'soap':
        text = `NOTA SOAP - INTERVENCIÓN FARMACÉUTICA
========================================
Caso: ${caseName}
Fecha: ${new Date().toLocaleDateString('es-CO')}

SUBJETIVO
${content.subjetivo || '[Describir lo referido por el paciente o cuidador]'}

OBJETIVO
${content.objetivo || '[Incluir resultados de laboratorio, signos vitales, medicamentos]'}
Medicamentos actuales: ${medications.filter(m => m.status === 'Activo').map(m => `${m.active} ${m.dose} ${m.unit} ${m.frequency}`).join(', ') || 'N/A'}

ANÁLISIS
${content.analisis || '[Análisis farmacoterapéutico: indicación, efectividad, seguridad, adherencia]'}
Problemas identificados: ${problems.map(p => p.problem).join('; ') || 'N/A'}

PLAN
${content.plan || '[Intervenciones propuestas, seguimiento, educación]'}

---
${documentDisclaimer}`;
        break;

      case 'carta-intervencion':
        text = `CARTA DE INTERVENCIÓN FARMACÉUTICA
=====================================
Fecha: ${new Date().toLocaleDateString('es-CO')}

Para: ${content.destinatario || '[Nombre del prescriptor]'}
Paciente: ${caseName}

HALLAZGOS
${content.hallazgos || '[Describir los hallazgos de la evaluación farmacoterapéutica]'}

RECOMENDACIÓN
${content.recomendacion || '[Recomendación específica con fundamento]'}

FUNDAMENTO
${content.fundamento || '[Evidencia o referencia que respalda la recomendación]'}

Q.F. ${content.firma || '[Nombre del químico farmacéutico]'}
Contacto: ${content.contacto || '[Correo / teléfono]'}

---
${documentDisclaimer}`;
        break;

      case 'recomendacion':
        text = `RECOMENDACIÓN AL PRESCRIPTOR
============================
Fecha: ${new Date().toLocaleDateString('es-CO')}

Para: ${content.para || '[Prescriptor]'}
Paciente: ${caseName}

Problema identificado: ${content.problema || problems.map(p => p.problem).join('; ') || 'N/A'}

Recomendación: ${content.recomendacion || '[Recomendación específica]'}

Evidencia: ${content.evidencia || '[Referencia]'}

Contacto: ${content.contacto || '[Q.F. responsable]'}

---
${documentDisclaimer}`;
        break;

      case 'informe-conciliacion':
        text = `INFORME DE CONCILIACIÓN DE MEDICAMENTOS
========================================
Caso: ${caseName}
Fecha: ${new Date().toLocaleDateString('es-CO')}

MEDICACIÓN PREVIA
${content.previa || '[Listar medicación antes del ingreso/transición]'}

PRESCRIPCIÓN ACTUAL
${content.actual || '[Listar prescripción vigente]'}

DISCREPANCIAS
${content.discrepancias || '[Describir cada discrepancia encontrada]'}

RECOMENDACIONES
${content.recomendaciones || '[Acciones sugeridas para cada discrepancia]'}

MEDICACIÓN CONCILIADA
${content.conciliada || '[Listado final conciliado]'}

---
${documentDisclaimer}`;
        break;

      case 'educacion-paciente':
        text = `GUÍA DE EDUCACIÓN PARA EL PACIENTE
===================================
Caso: ${caseName}
Fecha: ${new Date().toLocaleDateString('es-CO')}

MEDICAMENTO: ${content.medicamento || '[Nombre del medicamento]'}
INDICACIÓN: ${content.indicacion || '[Para qué sirve]'}
MODO DE USO: ${content.uso || '[Cómo, cuándo y cuánto tomar]'}
PRECAUCIONES: ${content.precauciones || '[Qué evitar, qué vigilar]'}
SIGNOS DE ALARMA: ${content.alarma || '[Cuándo consultar]'}

---
${documentDisclaimer}`;
        break;

      default:
        text = `INTERVENCIÓN FARMACÉUTICA
========================
Caso: ${caseName}
Fecha: ${new Date().toLocaleDateString('es-CO')}

${content.general || '[Contenido de la intervención]'}

---
${documentDisclaimer}`;
    }

    setGenerated(text);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generated).then(() => {
      alert('Contenido copiado al portapapeles.');
    });
  };

  const printDocument = () => {
    const win = window.open('', '_blank', 'width=800,height=600');
    win.document.write(`<pre style="font-family: monospace; font-size: 12px; line-height: 1.5; padding: 20px; white-space: pre-wrap;">${generated}</pre>`);
    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-deepblue-900">Generador de intervenciones</h3>
      <p className="text-xs text-gray-500">Selecciona una plantilla, completa los campos y genera un borrador editable.</p>

      {/* Template selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {interventionTemplates.map(t => (
          <button
            key={t.id}
            onClick={() => { setSelectedTemplate(t.id); setGenerated(''); setContent({}); }}
            className={`text-left p-3 rounded-xl border transition-all ${
              selectedTemplate === t.id
                ? 'border-deepblue-500 bg-deepblue-50'
                : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <p className="text-xs font-semibold text-deepblue-900 mb-0.5">{t.name}</p>
            <p className="text-[10px] text-gray-500 leading-tight">{t.description}</p>
          </button>
        ))}
      </div>

      {/* Content fields */}
      {selectedTemplate && !generated && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-deepblue-900">
            {interventionTemplates.find(t => t.id === selectedTemplate)?.name}
          </h4>
          {interventionTemplates.find(t => t.id === selectedTemplate)?.sections.map(section => {
            const key = section.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '');
            return (
              <div key={section}>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">{section}</label>
                <textarea
                  value={content[key] || ''}
                  onChange={e => setContent(c => ({ ...c, [key]: e.target.value }))}
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 resize-none"
                  placeholder={`[${section}]`}
                />
              </div>
            );
          })}
          <button
            onClick={handleGenerate}
            className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-deepblue-800 hover:bg-deepblue-900 rounded-lg transition-colors"
          >
            Generar borrador
          </button>
        </div>
      )}

      {/* Generated document */}
      {generated && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <button onClick={copyToClipboard} className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copiar
            </button>
            <button onClick={printDocument} className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Imprimir
            </button>
            <button onClick={() => setGenerated('')} className="text-xs text-gray-500 hover:text-gray-700">Editar</button>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <pre className="text-xs text-gray-700 font-mono whitespace-pre-wrap leading-relaxed">{generated}</pre>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
            <p className="text-[11px] text-amber-700">{documentDisclaimer}</p>
          </div>
        </div>
      )}
    </div>
  );
}
