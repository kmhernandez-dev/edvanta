import { useEffect, useState, useCallback } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getArticulo, gradientDe } from '../data/articulos';
import { getFeaturedCourse } from '../data/featuredCourses';
import AffiliateCourseButton from '../components/AffiliateCourseButton';
import { updatePageSeo } from '../utils/seo';
import { apiUrl } from '../config/api';

const MARCA = {
  fst:        { to: '/feliz-sin-tiroides', name: 'Feliz Sin Tiroides', accent: 'text-teal-600' },
  atenfarma:  { to: '/atenfarmaclinic',    name: 'AtenFarmaClinic',    accent: 'text-deepblue-700' },
  biblioteca: { to: '/',                   name: 'Edvanta', accent: 'text-navy-800' },
  edvanta:    { to: '/',                   name: 'Edvanta', accent: 'text-navy-800' },
};

function StudyTools({ slug }) {
  const [highlights, setHighlights] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`hl_${slug}`) || '[]'); } catch { return []; }
  });
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`notes_${slug}`) || '[]'); } catch { return []; }
  });
  const [noteText, setNoteText] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);

  const toggleHighlight = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const text = sel.toString().trim();
    if (!text) return;
    const exists = highlights.find(h => h.text === text);
    let updated;
    if (exists) {
      updated = highlights.filter(h => h.text !== text);
    } else {
      updated = [...highlights, { text, date: new Date().toISOString() }];
    }
    setHighlights(updated);
    localStorage.setItem(`hl_${slug}`, JSON.stringify(updated));
    sel.removeAllRanges();
  }, [highlights, slug]);

  const addNote = () => {
    if (!noteText.trim()) return;
    const updated = [...notes, { text: noteText.trim(), date: new Date().toISOString() }];
    setNotes(updated);
    localStorage.setItem(`notes_${slug}`, JSON.stringify(updated));
    setNoteText('');
  };

  const removeNote = (i) => {
    const updated = notes.filter((_, idx) => idx !== i);
    setNotes(updated);
    localStorage.setItem(`notes_${slug}`, JSON.stringify(updated));
  };

  const removeHighlight = (i) => {
    const updated = highlights.filter((_, idx) => idx !== i);
    setHighlights(updated);
    localStorage.setItem(`hl_${slug}`, JSON.stringify(updated));
  };

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={toggleHighlight}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold rounded-full border border-amber-200 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Subrayar selección
        </button>
        <button
          onClick={() => setShowHighlights(!showHighlights)}
          className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full border transition-colors ${
            showHighlights ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          📌 Subrayado ({highlights.length})
        </button>
        <button
          onClick={() => setShowNotes(!showNotes)}
          className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full border transition-colors ${
            showNotes ? 'bg-teal-100 text-teal-700 border-teal-300' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          📝 Notas ({notes.length})
        </button>
      </div>

      {showHighlights && (
        <div className="mb-4 p-4 bg-amber-50 rounded-2xl border border-amber-200">
          <h3 className="text-sm font-bold text-amber-800 mb-2">Tus subrayados</h3>
          {highlights.length === 0 ? (
            <p className="text-xs text-amber-600">Selecciona texto en el artículo y haz clic en "Subrayar selección".</p>
          ) : (
            <ul className="space-y-2">
              {highlights.map((h, i) => (
                <li key={i} className="flex items-start justify-between gap-2 text-sm text-amber-900 bg-amber-100/50 rounded-lg p-2">
                  <span className="flex-1">"{h.text.substring(0, 150)}{h.text.length > 150 ? '...' : ''}"</span>
                  <button onClick={() => removeHighlight(i)} className="text-amber-400 hover:text-red-500 shrink-0 text-xs">✕</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {showNotes && (
        <div className="mb-4 p-4 bg-teal-50 rounded-2xl border border-teal-200">
          <h3 className="text-sm font-bold text-teal-800 mb-2">Tus notas de estudio</h3>
          <div className="flex gap-2 mb-3">
            <input
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addNote()}
              placeholder="Escribe una nota o apunte..."
              className="flex-1 rounded-xl border border-teal-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
            <button onClick={addNote} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition-colors">
              Guardar
            </button>
          </div>
          {notes.length === 0 ? (
            <p className="text-xs text-teal-600">Tus apuntes aparecerán aquí. Se guardan en tu navegador.</p>
          ) : (
            <ul className="space-y-2">
              {notes.map((n, i) => (
                <li key={i} className="flex items-start justify-between gap-2 text-sm text-teal-900 bg-white rounded-lg p-2.5 border border-teal-100">
                  <div className="flex-1">
                    <p>{n.text}</p>
                    <p className="text-[10px] text-teal-400 mt-1">{new Date(n.date).toLocaleString('es-CO')}</p>
                  </div>
                  <button onClick={() => removeNote(i)} className="text-teal-400 hover:text-red-500 shrink-0 text-xs">✕</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function ArticleComments({ slug }) {
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
      {msg && <div className="mb-4 p-3 bg-teal-50 border border-teal-200 rounded-xl text-sm text-teal-700">{msg}</div>}
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
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-xs font-bold text-teal-700">
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

export default function ArticuloPage() {
  const { slug } = useParams();
  const art = getArticulo(slug);
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('loading');

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  useEffect(() => {
    if (!art) return;
    setStatus('loading');
    fetch(art.mdPath)
      .then(r => r.ok ? r.text() : Promise.reject())
      .then(text => {
        const clean = text.replace(/^---[\s\S]*?---\s*/, '');
        setContent(clean);
        setStatus('ok');
      })
      .catch(() => setStatus('error'));
  }, [art]);

  useEffect(() => {
    if (!art) return;
    const canonical = `https://edvanta.co/articulos/${art.slug}`;
    const imageUrl = `https://edvanta.co${art.image}`;
    const isFst = art.marca === 'fst';
    const authorName = isFst ? 'Karla Hernández' : 'Edvanta';
    const authorType = isFst ? 'Person' : 'Organization';

    updatePageSeo({
      title: `${art.title} | Edvanta`,
      description: art.description,
      canonical,
      image: imageUrl,
      type: 'article',
      jsonLdId: `article-${art.slug}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          { '@type': 'Article', headline: art.title, description: art.description, image: imageUrl,
            author: { '@type': authorType, name: authorName },
            datePublished: art.date, dateModified: art.updated || art.date,
            publisher: { '@type': 'Organization', name: 'Edvanta', url: 'https://edvanta.co' },
            mainEntityOfPage: { '@type': 'WebPage', '@id': canonical } },
          { '@type': 'BreadcrumbList', itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://edvanta.co/' },
            { '@type': 'ListItem', position: 2, name: 'Artículos', item: 'https://edvanta.co/articulos' },
            { '@type': 'ListItem', position: 3, name: art.title, item: canonical }] },
        ],
      },
    });
  }, [art]);

  if (!art) return <Navigate to="/" replace />;
  const marca = MARCA[art.marca] || MARCA.biblioteca;
  const isFst = art.marca === 'fst';
  const isEdvanta = art.marca === 'edvanta' || art.marca === 'biblioteca';
  const relatedCourse = art.courseSlug ? getFeaturedCourse(art.courseSlug) : null;

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link to={marca.to} className="text-sm font-bold text-navy-950">{marca.name}</Link>
          <div className="flex items-center gap-3">
            <Link to="/articulos" className="text-xs text-gray-400 hover:text-teal-600">← Biblioteca</Link>
            <Link to={marca.to} className={`text-sm font-medium ${marca.accent} hover:underline`}>← {marca.name}</Link>
          </div>
        </div>
      </header>

      <div className={`bg-gradient-to-br ${gradientDe(art.marca)} text-white`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/80 mb-3">{art.category}</p>
          <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-4">{art.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/85">
            <span>{isEdvanta ? 'Edvanta · Equipo editorial' : 'Karla Hernández · Química Farmacéutica'}</span>
            <span>·</span>
            <span>{art.readingTime} de lectura</span>
          </div>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <StudyTools slug={art.slug} />

        {status === 'loading' && <p className="text-gray-400 py-10 text-center">Cargando artículo…</p>}
        {status === 'error' && <p className="text-red-500 py-10 text-center">No se pudo cargar el artículo.</p>}
        {status === 'ok' && (
          <div className="prose prose-lg max-w-none prose-headings:text-deepblue-900 prose-headings:font-bold prose-a:text-teal-700 prose-strong:text-navy-900 prose-table:text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}

        {isEdvanta && relatedCourse && (
          <div className="mt-10 rounded-lg border border-gray-200 bg-slate-50 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-600">Curso recomendado</p>
            <h2 className="mt-2 text-xl font-bold text-navy-950">{relatedCourse.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{relatedCourse.shortDescription}</p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Link to={`/cursos/${relatedCourse.slug}`} className="btn-secondary text-sm">Ver página del curso</Link>
              <AffiliateCourseButton course={relatedCourse} sourceSection="article_page" articleSlug={art.slug} className="text-sm">
                Inscribirme gratis
              </AffiliateCourseButton>
            </div>
          </div>
        )}

        <div className="mt-12 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-xs text-amber-800 leading-relaxed">
            {isFst
              ? 'Este contenido es educativo e informativo y no reemplaza la consulta, diagnóstico ni tratamiento de un profesional de salud. No modifiques tu medicación sin indicación médica.'
              : 'Este contenido es educativo e informativo. Edvanta organiza rutas de aprendizaje y puede incluir enlaces afiliados a plataformas educativas.'}
          </p>
        </div>

        <ArticleComments slug={art.slug} />

        <div className="mt-8 text-center">
          <Link to={marca.to} className="btn-teal text-sm px-6 py-2.5">Ver más de {marca.name}</Link>
        </div>
      </article>
    </div>
  );
}
