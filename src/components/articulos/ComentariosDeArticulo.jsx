/** Comentarios y preguntas de un artículo (API /api/article-comments). */
import { useEffect, useState } from 'react';
import { apiUrl } from '../../config/api';

export default function ArticleComments({ slug }) {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch(apiUrl(`/api/article-comments/${slug}`))
      .then(r => r.json())
      .then(d => setComments(d.comments || []))
      .catch(() => {});
  }, [slug]);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(apiUrl('/api/article-comments'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article_slug: slug, user_name: name.trim(), body: body.trim(), parent_id: replyTo }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments(prev => [...prev, data.comment]);
        setBody('');
        setReplyTo(null);
        setMsg('Comentario enviado.');
        setTimeout(() => setMsg(''), 4000);
      }
    } catch (e) { /* ignore */ }
    setSubmitting(false);
  };

  const topComments = comments.filter(c => !c.parent_id);
  const replies = comments.filter(c => c.parent_id);

  return (
    <div className="mt-12 border-t border-gray-200 pt-10">
      <h2 className="text-xl font-bold text-navy-950 mb-6">💬 Comentarios y preguntas</h2>
      {msg && <div className="mb-4 p-3 bg-edvanta-mint border border-teal-200 rounded-xl text-sm text-edvanta-tealdark">{msg}</div>}
      <form onSubmit={submit} className="mb-8 space-y-3">
        {replyTo && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Respondiendo</span>
            <button type="button" onClick={() => setReplyTo(null)} className="text-teal-600 hover:underline">Cancelar</button>
          </div>
        )}
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" required
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200" />
        <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Escribe tu comentario..." rows={3} required
          className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 resize-none" />
        <button type="submit" disabled={submitting || !name.trim() || !body.trim()}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors disabled:opacity-50">
          {submitting ? 'Enviando...' : 'Comentar'}
        </button>
      </form>
      {topComments.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No hay comentarios todavía. Sé el primero en comentar.</p>
      ) : (
        <div className="space-y-5">
          {topComments.map(comment => {
            const commentReplies = replies.filter(r => r.parent_id === comment.id);
            return (
              <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-xs font-bold text-edvanta-tealdark">
                    {comment.user_name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-navy-900">{comment.user_name}</span>
                    <span className="text-xs text-gray-400 ml-2">{new Date(comment.created_at).toLocaleDateString('es-CO')}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 ml-10">{comment.body}</p>
                <button onClick={() => setReplyTo(comment.id)} className="ml-10 mt-1.5 text-xs text-teal-600 hover:underline">Responder</button>
                {commentReplies.map(reply => (
                  <div key={reply.id} className="ml-10 mt-3 pl-4 border-l-2 border-teal-100">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-sand-100 flex items-center justify-center text-xs font-bold text-deepblue-600">
                        {reply.user_name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <span className="text-sm font-semibold text-navy-900">{reply.user_name}</span>
                      <span className="text-xs text-gray-400">{new Date(reply.created_at).toLocaleDateString('es-CO')}</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-8">{reply.body}</p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
