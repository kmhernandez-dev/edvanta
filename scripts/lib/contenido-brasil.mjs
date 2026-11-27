/**
 * ============================================================
 *  contenido-brasil.mjs — Las páginas de Edvanta Brasil (/br) en HTML
 *  estático, en portugués
 *
 *  nginx solo sirve las direcciones que tienen su .html prerenderizado
 *  (location / → try_files $uri.html … =404). Sin esto, /br y sus
 *  páginas daban 404 aunque la app las tuviera. Publicado el 27-nov-2026
 *  por decisión de Karla («Publícala así»).
 *
 *  El texto es el mismo que muestran src/pages/brasil/*. Los artículos
 *  van con noindex mientras su traducción no esté aprobada (igual que en
 *  la app); cursos y guías son una lista de interés, sin precios ni cobro.
 *
 *  Lo usa scripts/seo-rutas-fijas.mjs; prerenderizar-paginas.mjs lee
 *  `idioma` y `alternos` para escribir lang, og:locale y hreflang.
 * ============================================================
 */
import { BRASIL_ARTIGOS_SEMENTE, BRASIL_CURSOS, BRASIL_GUIAS } from '../../src/data/brasil.js';

const esc = (t) => String(t ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const IDIOMA = 'pt-BR';
const base = { seccion: 'Edvanta Brasil', seccionUrl: '/br', idioma: IDIOMA, inicio: ['Edvanta Brasil', '/br'], volver: 'Voltar ao início' };

const CATALOGOS = {
  artigos: { titulo: 'Artigos em português', descricao: 'Conteúdo sobre medicamentos, saúde, qualidade e prática farmacêutica.', itens: BRASIL_ARTIGOS_SEMENTE, espanhol: '/articulos', acao: 'Ler artigo' },
  cursos: { titulo: 'Cursos para o Brasil', descricao: 'Formação farmacêutica aplicada, organizada por área profissional.', itens: BRASIL_CURSOS, espanhol: '/cursos', acao: 'Ver detalhes' },
  guias: { titulo: 'Guias práticos', descricao: 'Materiais para estudar, revisar e aplicar conhecimentos farmacêuticos.', itens: BRASIL_GUIAS, espanhol: '/guias', acao: 'Ver detalhes' },
};

const item = (tipo, i, acao) => `<li><a href="/br/${tipo}/${esc(i.slug)}">${esc(i.titulo)}</a> (${esc(i.categoria)}): ${esc(i.descricao || i.resumo)}${i.estado ? ` <em>${esc(i.estado)}</em>` : ''} <a href="/br/${tipo}/${esc(i.slug)}">${esc(acao)}</a></li>`;

/** Todas las rutas de /br para RUTAS_FIJAS. */
export function rutasBrasil() {
  const rutas = [];
  rutas.push({
    ...base,
    ruta: '/br',
    titulo: 'Edvanta Brasil | Educação farmacêutica em português',
    descripcion: 'Artigos, cursos e guias em português para farmacêuticos, estudantes, pacientes e instituições no Brasil.',
    h1: 'Educação farmacêutica para aprender, aplicar e avançar.',
    tipo: 'CollectionPage',
    alternos: { 'es-CO': '/' },
    contenido: `<section><p>Conteúdo em português do Brasil para quem cuida de medicamentos, qualidade, pacientes e decisões regulatórias. Fontes verificáveis e linguagem clara.</p></section>${
      Object.entries(CATALOGOS).map(([tipo, c]) => `<section><h2><a href="/br/${tipo}">${esc(c.titulo)}</a></h2><p>${esc(c.descricao)}</p><ul>${c.itens.map((i) => `<li><a href="/br/${tipo}/${esc(i.slug)}">${esc(i.titulo)}</a></li>`).join('')}</ul></section>`).join('')
    }<p><a href="/">Edvanta em espanhol</a></p>`,
  });
  for (const [tipo, c] of Object.entries(CATALOGOS)) {
    rutas.push({
      ...base,
      ruta: `/br/${tipo}`,
      titulo: `${c.titulo} | Edvanta Brasil`,
      descripcion: c.descricao,
      h1: c.titulo,
      tipo: 'CollectionPage',
      alternos: { 'es-CO': c.espanhol },
      contenido: `<section><ul>${c.itens.map((i) => item(tipo, i, c.acao)).join('')}</ul></section><p><a href="/br">Edvanta Brasil</a></p>`,
    });
  }
  for (const tipo of ['cursos', 'guias']) {
    for (const i of CATALOGOS[tipo].itens) {
      const lista = i.modulos || [i.resumo, `Material pensado para ${String(i.paraQuem || '').toLowerCase()}`, 'Edição em português do Brasil'];
      rutas.push({
        ...base,
        ruta: `/br/${tipo}/${i.slug}`,
        titulo: `${i.titulo} | Edvanta Brasil`,
        descripcion: i.resumo,
        h1: i.titulo,
        tipo: 'WebPage',
        alternos: { 'es-CO': i.origem },
        contenido: `<section><p><strong>${esc(i.categoria)}</strong> · ${esc(i.estado)}</p><h2>${tipo === 'cursos' ? 'Conteúdo planejado' : 'O que você encontrará'}</h2><ul>${lista.map((t) => `<li>${esc(t)}</li>`).join('')}</ul><h2>Para quem</h2><p>${esc(i.publico || i.paraQuem)}</p><p>A lista de interesse mede a demanda e avisa quando a edição brasileira estiver pronta. Nenhuma cobrança é feita nesta etapa.</p><p><a href="${esc(i.origem)}">Ver referência em espanhol</a> · <a href="/br/${tipo}">${tipo === 'cursos' ? 'Todos os cursos' : 'Todos os guias'}</a></p></section>`,
      });
    }
  }
  for (const a of BRASIL_ARTIGOS_SEMENTE) {
    const aprovada = a.revisao === 'aprovada';
    rutas.push({
      ...base,
      ruta: `/br/artigos/${a.slug}`,
      titulo: `${a.titulo} | Edvanta Brasil`,
      descripcion: a.descricao,
      h1: a.titulo,
      tipo: 'Article',
      // Igual que la app: sin traducción aprobada, no se indexa.
      robots: aprovada ? null : 'noindex,follow',
      alternos: { 'es-CO': a.origem },
      contenido: `<section><p><strong>${esc(a.categoria)}</strong></p>${aprovada ? '' : '<p>Tradução editorial em revisão. Esta página ainda não é indexada pelos buscadores.</p>'}<p><a href="${esc(a.origem)}">Ver original em espanhol</a> · <a href="/br/artigos">Todos os artigos</a></p></section>`,
    });
  }
  return rutas;
}
