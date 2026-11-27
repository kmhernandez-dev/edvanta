import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock3, GraduationCap, Library, MessageCircle } from 'lucide-react';
import BrasilLayout from '../../components/brasil/BrasilLayout';
import { artigoBrasil, BRASIL_ARTIGOS_SEMENTE, BRASIL_CURSOS, BRASIL_GUIAS, cursoBrasil, guiaBrasil } from '../../data/brasil';
import { useBrasilSeo } from '../../lib/brasil/seo';
import { waLink } from '../../config/links';
import { trackEvent } from '../../utils/analytics';

const config = {
  artigos: { title: 'Artigos em português', description: 'Conteúdo sobre medicamentos, saúde, qualidade e prática farmacêutica.', icon: BookOpen },
  cursos: { title: 'Cursos para o Brasil', description: 'Formação farmacêutica aplicada, organizada por área profissional.', icon: GraduationCap },
  guias: { title: 'Guias práticos', description: 'Materiais para estudar, revisar e aplicar conhecimentos farmacêuticos.', icon: Library },
};

const data = { artigos: BRASIL_ARTIGOS_SEMENTE, cursos: BRASIL_CURSOS, guias: BRASIL_GUIAS };

export function BrasilCatalogo({ tipo }) {
  const meta = config[tipo];
  const items = data[tipo];
  const Icon = meta.icon;
  useBrasilSeo({ title: `${meta.title} | Edvanta Brasil`, description: meta.description, path: `/br/${tipo}`, espanhol: tipo === 'artigos' ? '/articulos' : `/${tipo === 'guias' ? 'guias' : 'cursos'}` });

  return (
    <BrasilLayout>
      <main>
        <section className="border-b border-edvanta-border bg-gradient-to-br from-[#F4FBF7] to-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <Link to="/br" className="inline-flex items-center gap-2 text-sm font-bold text-edvanta-blue"><ArrowLeft className="h-4 w-4" /> Edvanta Brasil</Link>
            <div className="mt-7 flex items-start gap-4"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-edvanta-teal shadow-sm"><Icon className="h-7 w-7" /></span><div><h1 className="font-display text-4xl font-black text-edvanta-deep sm:text-5xl">{meta.title}</h1><p className="mt-3 max-w-2xl text-lg leading-8 text-edvanta-muted">{meta.description}</p></div></div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const to = `/br/${tipo}/${item.slug}`;
              return (
                <article key={item.slug} className="flex h-full flex-col rounded-2xl border border-edvanta-border bg-white p-6 shadow-[0_1px_2px_rgba(23,34,59,.04)]">
                  <p className="text-xs font-extrabold uppercase tracking-[.12em] text-edvanta-tealdark">{item.categoria}</p>
                  <h2 className="mt-3 font-display text-xl font-bold leading-snug text-edvanta-deep">{item.titulo}</h2>
                  <p className="mt-3 text-sm leading-6 text-edvanta-muted">{item.descricao || item.resumo}</p>
                  {item.estado && <p className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#176B3A]"><Clock3 className="h-4 w-4" /> {item.estado}</p>}
                  <Link to={to} className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-edvanta-blue">{tipo === 'artigos' ? 'Ler artigo' : 'Ver detalhes'} <ArrowRight className="h-4 w-4" /></Link>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </BrasilLayout>
  );
}

export function BrasilArtigo() {
  const { slug = '' } = useParams();
  const artigo = artigoBrasil(slug);
  const [markdown, setMarkdown] = useState('');
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let alive = true;
    setErro(false);
    setMarkdown('');
    if (!artigo) return undefined;
    fetch(artigo.mdPath).then((response) => {
      if (!response.ok) throw new Error('Tradução indisponível');
      return response.text();
    }).then((text) => { if (alive) setMarkdown(text); }).catch(() => { if (alive) setErro(true); });
    return () => { alive = false; };
  }, [artigo]);

  const jsonLd = useMemo(() => artigo ? ({ '@context': 'https://schema.org', '@type': 'Article', headline: artigo.titulo, description: artigo.descricao, inLanguage: 'pt-BR', url: `https://edvanta.co/br/artigos/${artigo.slug}`, publisher: { '@type': 'Organization', name: 'Edvanta' } }) : null, [artigo]);
  useBrasilSeo({ title: `${artigo?.titulo || 'Artigo'} | Edvanta Brasil`, description: artigo?.descricao || 'Artigo da Edvanta Brasil.', path: `/br/artigos/${slug}`, espanhol: artigo?.origem || '/articulos', robots: artigo?.revisao === 'aprovada' ? 'index,follow' : 'noindex,follow', type: 'article', jsonLd });

  if (!artigo) return <BrasilLayout><main className="mx-auto max-w-3xl px-4 py-20"><h1 className="text-3xl font-bold">Artigo não encontrado</h1><Link to="/br/artigos" className="mt-6 inline-flex text-edvanta-blue">Voltar aos artigos</Link></main></BrasilLayout>;

  return (
    <BrasilLayout>
      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <Link to="/br/artigos" className="inline-flex items-center gap-2 text-sm font-bold text-edvanta-blue"><ArrowLeft className="h-4 w-4" /> Artigos</Link>
        <article className="mt-8">
          <p className="text-xs font-extrabold uppercase tracking-[.12em] text-edvanta-tealdark">{artigo.categoria}</p>
          <h1 className="mt-4 font-display text-4xl font-black leading-tight text-edvanta-deep sm:text-5xl">{artigo.titulo}</h1>
          <p className="mt-5 text-lg leading-8 text-edvanta-muted">{artigo.descricao}</p>
          {artigo.revisao !== 'aprovada' && <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">Tradução editorial em revisão. Esta página ainda não é indexada pelos buscadores.</div>}
          {erro ? <div className="mt-10 rounded-2xl border border-edvanta-border bg-edvanta-bg p-8"><p className="font-bold">A tradução deste artigo está sendo preparada.</p><p className="mt-2 text-sm text-edvanta-muted">Volte em breve ou consulte a versão original em espanhol.</p><a href={artigo.origem} className="ed-btn ed-btn--secondary mt-5">Ver original</a></div> : <div className="ed-prose mt-10"><ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown></div>}
        </article>
      </main>
    </BrasilLayout>
  );
}

export function BrasilProduto({ tipo }) {
  const { slug = '' } = useParams();
  const item = tipo === 'cursos' ? cursoBrasil(slug) : guiaBrasil(slug);
  const singular = tipo === 'cursos' ? 'Curso' : 'Guia';
  const description = item?.resumo || `${singular} da Edvanta Brasil.`;
  useBrasilSeo({ title: `${item?.titulo || singular} | Edvanta Brasil`, description, path: `/br/${tipo}/${slug}`, espanhol: item?.origem || `/${tipo === 'guias' ? 'guias' : 'cursos'}`, robots: 'index,follow' });

  if (!item) return <BrasilLayout><main className="mx-auto max-w-3xl px-4 py-20"><h1 className="text-3xl font-bold">{singular} não encontrado</h1><Link to={`/br/${tipo}`} className="mt-6 inline-flex text-edvanta-blue">Voltar ao catálogo</Link></main></BrasilLayout>;
  const interest = waLink(`Olá, equipe Edvanta. Quero entrar na lista de interesse de ${item.titulo} em português do Brasil.`);

  return (
    <BrasilLayout>
      <main>
        <section className="border-b border-edvanta-border bg-gradient-to-br from-[#F4FBF7] via-white to-edvanta-soft">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            <Link to={`/br/${tipo}`} className="inline-flex items-center gap-2 text-sm font-bold text-edvanta-blue"><ArrowLeft className="h-4 w-4" /> {tipo === 'cursos' ? 'Cursos' : 'Guias'}</Link>
            <p className="mt-8 text-xs font-extrabold uppercase tracking-[.14em] text-edvanta-tealdark">{item.categoria}</p>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-black leading-tight text-edvanta-deep sm:text-5xl">{item.titulo}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-edvanta-muted">{description}</p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#E8F6EE] px-4 py-2 text-sm font-bold text-[#176B3A]"><Clock3 className="h-4 w-4" /> {item.estado}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={interest} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('brasil_interest', { type: tipo, slug: item.slug })} className="ed-btn ed-btn--primary"><MessageCircle className="h-4 w-4" /> Entrar na lista de interesse</a>
              <a href={item.origem} className="ed-btn ed-btn--secondary">Ver referência em espanhol</a>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_.75fr]">
            <div>
              <h2 className="font-display text-2xl font-bold text-edvanta-deep">{tipo === 'cursos' ? 'Conteúdo planejado' : 'O que você encontrará'}</h2>
              <ul className="mt-6 space-y-3">
                {(item.modulos || [item.resumo, `Material pensado para ${item.paraQuem.toLowerCase()}`, 'Edição em português do Brasil']).map((text) => <li key={text} className="flex gap-3 text-sm leading-6 text-edvanta-muted"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-edvanta-teal" /> {text}</li>)}
              </ul>
            </div>
            <aside className="rounded-2xl border border-edvanta-border bg-edvanta-bg p-6"><p className="text-xs font-extrabold uppercase tracking-[.12em] text-edvanta-tealdark">Para quem</p><p className="mt-3 font-semibold leading-7 text-edvanta-deep">{item.publico || item.paraQuem}</p><p className="mt-5 text-sm leading-6 text-edvanta-muted">A lista de interesse mede a demanda e avisa quando a edição brasileira estiver pronta. Nenhuma cobrança é feita nesta etapa.</p></aside>
          </div>
        </section>
      </main>
    </BrasilLayout>
  );
}
