import { useState } from 'react';

export default function ClinicalCalculator({ calculator }) {
  const [values, setValues] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (id, value) => {
    setValues(prev => ({ ...prev, [id]: value }));
    setError('');
  };

  const calculate = () => {
    setError('');
    setResult(null);

    // Validate all required fields
    for (const field of calculator.fields) {
      const val = values[field.id];
      if (val === undefined || val === '') {
        setError(`Completa el campo: ${field.label}`);
        return;
      }
      if (field.type === 'number') {
        const num = parseFloat(val);
        if (isNaN(num) || num < (field.min || 0) || num > (field.max || Infinity)) {
          setError(`${field.label} debe estar entre ${field.min || 0} y ${field.max || '∞'} ${field.unit}`);
          return;
        }
      }
    }

    try {
      let res = null;
      let interpretation = '';

      switch (calculator.id) {
        case 'cockcroft-gault': {
          const age = parseFloat(values.age);
          const weight = parseFloat(values.weight);
          const cr = parseFloat(values.creatinine);
          const isFemale = values.sex === 'Femenino';
          let clCr = ((140 - age) * weight) / (72 * cr);
          if (isFemale) clCr *= 0.85;
          res = clCr.toFixed(1);
          interpretation = clCr >= 90 ? 'Función renal normal o aumentada.' :
            clCr >= 60 ? 'Disminución leve de la función renal.' :
            clCr >= 30 ? 'Disminución moderada de la función renal.' :
            clCr >= 15 ? 'Disminución severa de la función renal.' :
            'Fallo renal.';
          break;
        }
        case 'bsa': {
          const height = parseFloat(values.height);
          const weight = parseFloat(values.weight);
          const bsa = Math.sqrt((height * weight) / 3600);
          res = bsa.toFixed(2);
          interpretation = `Superficie corporal estimada: ${res} m².`;
          break;
        }
        case 'ideal-weight': {
          const height = parseFloat(values.height);
          const weight = parseFloat(values.weight);
          const isFemale = values.sex === 'Femenino';
          const k = isFemale ? 2.5 : 4;
          const idealWeight = (height - 100) - ((height - 150) / k);
          const adjustedWeight = idealWeight + 0.4 * (weight - idealWeight);
          res = {
            ideal: idealWeight.toFixed(1),
            adjusted: adjustedWeight.toFixed(1),
          };
          interpretation = weight > idealWeight * 1.2
            ? `Peso real > 120% del peso ideal. Considere usar peso ajustado: ${res.adjusted} kg.`
            : `Peso real dentro del rango del peso ideal. Use peso real: ${weight} kg.`;
          break;
        }
        default:
          setError('Calculadora no implementada.');
          return;
      }

      setResult({ value: res, interpretation });
    } catch (e) {
      setError('Error en el cálculo. Verifica los valores ingresados.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="text-sm font-bold text-deepblue-900 mb-1">{calculator.name}</h3>
      <p className="text-xs text-gray-500 mb-4 font-mono bg-gray-50 rounded-lg p-2">{calculator.formula}</p>

      <div className="space-y-3 mb-4">
        {calculator.fields.map(field => (
          <div key={field.id}>
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">
              {field.label} {field.unit && `(${field.unit})`}
            </label>
            {field.type === 'select' ? (
              <select
                value={values[field.id] || ''}
                onChange={e => handleChange(field.id, e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
              >
                <option value="">Seleccionar</option>
                {field.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={values[field.id] || ''}
                onChange={e => handleChange(field.id, e.target.value)}
                min={field.min}
                max={field.max}
                step={field.step || 1}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={calculate}
        className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-deepblue-800 hover:bg-deepblue-900 rounded-lg transition-colors mb-4"
      >
        Calcular
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-4">
          <p className="text-xs font-semibold text-teal-800 mb-1">Resultado:</p>
          {typeof result.value === 'object' ? (
            <div className="space-y-1">
              <p className="text-sm font-bold text-deepblue-900">Peso ideal: {result.value.ideal} kg</p>
              <p className="text-sm font-bold text-deepblue-900">Peso ajustado: {result.value.adjusted} kg</p>
            </div>
          ) : (
            <p className="text-lg font-bold text-deepblue-900">{result.value} {calculator.fields[0]?.unit === 'cm' ? 'm²' : 'mL/min'}</p>
          )}
          <p className="text-[11px] text-teal-700 mt-1">{result.interpretation}</p>
        </div>
      )}

      {/* Warnings */}
      <div className="space-y-2 mb-3">
        <p className="text-[10px] font-semibold text-gray-500">Población de aplicación:</p>
        <p className="text-[10px] text-gray-500">{calculator.population}</p>
      </div>
      <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 space-y-1">
        <p className="text-[10px] font-semibold text-amber-700">Advertencias y limitaciones:</p>
        {calculator.warnings.map((w, i) => (
          <p key={i} className="text-[10px] text-amber-700">- {w}</p>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-gray-400 space-y-0.5">
        <p>Fuente: {calculator.source}</p>
        <p>Revisión: {calculator.lastReviewed}</p>
      </div>
    </div>
  );
}
