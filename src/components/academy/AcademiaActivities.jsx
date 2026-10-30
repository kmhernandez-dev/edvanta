import { useEffect, useState } from 'react';
import Icon from '../Icon';

function Activity({ activity, api, index, totalActivities, onSaved }) {
  const questions = activity.content?.questions || [];
  const [answers, setAnswers] = useState(activity.answers || {});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const allAnswered = questions.length > 0 && questions.every(question => answers[question.id]);

  useEffect(() => {
    setAnswers(activity.answers || {});
    setResult(null);
  }, [activity.id, activity.answers]);

  const submit = async (event) => {
    event.preventDefault();
    if (!allAnswered) return;
    setSubmitting(true);
    setError('');
    try {
      const data = await api(`/api/academia/activities/${activity.id}/submit`, {
        method: 'POST',
        body: JSON.stringify({ answers }),
      });
      setResult(data);
      onSaved?.(activity.id, data.submission, answers);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resultByQuestion = new Map((result?.results || []).map(item => [item.question_id, item]));
  const savedScore = result?.submission?.score ?? activity.score;
  const savedTotal = result?.submission?.total ?? activity.total;

  return (
    <form onSubmit={submit} className="rounded-lg border border-edvanta-border bg-white p-5 sm:p-7">
      <div className="flex flex-col justify-between gap-3 border-b border-edvanta-border pb-5 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-bold uppercase text-edvanta-blue">Práctica {index + 1} de {totalActivities}</p>
          <h2 className="mt-2 text-xl font-semibold text-edvanta-deep">{activity.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-edvanta-muted">{activity.description}</p>
        </div>
        {activity.content?.estimated_min && (
          <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-edvanta-muted">
            <Icon name="clock" className="h-4 w-4" /> {activity.content.estimated_min} min
          </span>
        )}
      </div>

      <div className="my-5 rounded-md border border-edvanta-mint bg-[#F0FAF9] p-4">
        <p className="text-sm font-semibold text-[#0B6670]">{activity.content?.case_title}</p>
        <p className="mt-2 text-sm leading-6 text-edvanta-deep">{activity.content?.case_text}</p>
        <p className="mt-3 inline-flex items-start gap-2 text-xs leading-5 text-edvanta-muted">
          <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-edvanta-tealdark" />
          Caso ficticio. No incluyas síntomas, diagnósticos, dosis ni resultados personales.
        </p>
      </div>

      <div className="space-y-7">
        {questions.map((question, questionIndex) => {
          const questionResult = resultByQuestion.get(question.id);
          return (
            <fieldset key={question.id}>
              <legend className="text-sm font-semibold leading-6 text-edvanta-deep">
                {questionIndex + 1}. {question.prompt}
              </legend>
              <div className="mt-3 grid gap-2">
                {question.options.map(option => {
                  const checked = answers[question.id] === option.value;
                  return (
                    <label
                      key={option.value}
                      className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm transition-colors ${checked ? 'border-edvanta-blue bg-edvanta-bg text-edvanta-bluedark' : 'border-edvanta-border text-edvanta-deep hover:border-edvanta-violet'}`}
                    >
                      <input
                        type="radio"
                        name={`${activity.id}-${question.id}`}
                        value={option.value}
                        checked={checked}
                        onChange={() => setAnswers(current => ({ ...current, [question.id]: option.value }))}
                        className="h-4 w-4 shrink-0 accent-edvanta-blue"
                      />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
              {questionResult && (
                <div className={`mt-3 flex gap-2 rounded-md px-3 py-2 text-xs leading-5 ${questionResult.correct ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'}`}>
                  <Icon name={questionResult.correct ? 'checkCircle' : 'activity'} className="mt-0.5 h-4 w-4 shrink-0" />
                  <span><strong>{questionResult.correct ? 'Correcto.' : 'Revisa esta idea.'}</strong> {questionResult.explanation}</span>
                </div>
              )}
            </fieldset>
          );
        })}
      </div>

      {error && <p role="alert" className="mt-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="mt-7 flex flex-col justify-between gap-3 border-t border-edvanta-border pt-5 sm:flex-row sm:items-center">
        <div className="text-xs text-edvanta-muted">
          {savedTotal ? (
            <span className="inline-flex items-center gap-2 font-semibold text-[#0B6670]"><Icon name="award" className="h-4 w-4" /> Último resultado: {savedScore} de {savedTotal}</span>
          ) : 'Responde todas las preguntas para recibir retroalimentación.'}
        </div>
        <button
          type="submit"
          disabled={!allAnswered || submitting}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-edvanta-blue px-5 text-sm font-semibold text-white hover:bg-edvanta-bluedark disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="checkCircle" className="h-5 w-5" /> {submitting ? 'Revisando...' : savedTotal ? 'Intentar nuevamente' : 'Revisar actividad'}
        </button>
      </div>
    </form>
  );
}

export default function AcademiaActivities({ activities, api, totalActivities = 4, onSaved }) {
  if (!activities?.length) return null;
  return (
    <section className="space-y-5" aria-label="Actividades prácticas">
      {activities.map((activity, index) => (
        <Activity
          key={activity.id}
          activity={activity}
          api={api}
          index={Number(activity.sort_order || index + 1) - 1}
          totalActivities={totalActivities}
          onSaved={onSaved}
        />
      ))}
    </section>
  );
}
