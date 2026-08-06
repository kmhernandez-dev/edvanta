import { useState } from 'react';
import { INTERVENTION_TEMPLATES } from '../../data/atenfarma-demo';
import ProfessionalDisclaimer from './ProfessionalDisclaimer';

export default function InterventionTemplate({ caseData }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [content, setContent] = useState({});
  const [generated, setGenerated] = useState(false);

  const template = INTERVENTION_TEMPLATES.find(t => t.id === selectedTemplate);

  const handleGenerate = () => {
    setGenerated(true);
  };

  const handleContentChange = (section, value) => {
    setContent(prev => ({ ...prev, [section]: value }));
  };

  const getFullText = () => {
    if (!template) return '';
    return template.sections.map(s => {
      const sectionContent = content[s] || `[${s} — pendiente de completar]`;
      return `${s.toUpperCase()}\n${sectionContent}\n`;
    }).join('\n');
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(getFullText());
  };

  return (
    <div className="space-y-4">
      {!selectedTemplate ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {INTERVENTION_TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTemplate(t.id)}
              className="text-left p-4 border border-gray-200 rounded-xl hover:border-deepblue-300 hover:shadow-sm transition-all"
            >
              <p className="text-xs font-semibold text-deepblue-900 mb-1">{t.name}</p>
              <p className="text-[10px] text-gray-500">{t.description}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-deepblue-900">{template.name}</h3>
              <p className="text-[10px] text-gray-500">{template.description}</p>
            </div>
            <button
              onClick={() => { setSelectedTemplate(null); setGenerated(false); setContent({}); }}
              className="text-xs text-gray-500 hover:text-gray-700 min-h-[44px] px-3"
            >
              Cambiar plantilla
            </button>
          </div>

          <div className="space-y-3">
            {template.sections.map(section => (
              <div key={section} className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider">{section}</label>
                <textarea
                  value={content[section] || ''}
                  onChange={e => handleContentChange(section, e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-deepblue-500 resize-y"
                  placeholder={`Redacte la sección ${section.toLowerCase()}...`}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleGenerate}
              className="px-4 py-2 bg-deepblue-800 hover:bg-deepblue-900 text-white text-xs font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-deepblue-500 min-h-[44px]"
            >
              Generar borrador
            </button>
            {generated && (
              <>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors min-h-[44px]"
                >
                  Copiar contenido
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors min-h-[44px]"
                >
                  Imprimir
                </button>
              </>
            )}
          </div>

          {generated && (
            <div className="border border-gray-200 rounded-xl p-4 bg-white">
              <ProfessionalDisclaimer compact />
              <pre className="mt-3 text-[11px] text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{getFullText()}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
