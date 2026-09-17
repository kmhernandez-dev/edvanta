/** Nombres, iconos y ayudas de los bloques de una clase. */
import {
  AlignLeft, FileText, FolderDown, GalleryHorizontal, Heading, Image, Link2, Megaphone, Music, PanelTop,
  Presentation, Video,
} from 'lucide-react';

export const BLOCK_META = {
  encabezado: { label: 'Encabezado', icon: Heading, description: 'Título de una sección dentro de la clase.' },
  texto: { label: 'Texto', icon: AlignLeft, description: 'Párrafos, listas, citas y enlaces.' },
  imagen: { label: 'Imagen', icon: Image, description: 'Una imagen con texto alternativo y leyenda.' },
  galeria: { label: 'Galería', icon: GalleryHorizontal, description: 'Varias imágenes en cuadrícula o carrusel.' },
  video: { label: 'Video', icon: Video, description: 'Archivo de video o enlace de YouTube o Vimeo.' },
  audio: { label: 'Audio', icon: Music, description: 'Explicación o pódcast en audio, con transcripción.' },
  pdf: { label: 'Documento PDF', icon: FileText, description: 'Visor de PDF dentro de la clase.' },
  presentacion: { label: 'Presentación', icon: Presentation, description: 'Diapositivas en PDF, Google Slides o Canva.' },
  archivos: { label: 'Archivos descargables', icon: FolderDown, description: 'Formatos, plantillas y material para descargar.' },
  infografia: { label: 'Infografía', icon: PanelTop, description: 'Imagen ampliable con su descripción completa.' },
  enlace: { label: 'Enlace externo', icon: Link2, description: 'Tarjeta que abre otra página en una pestaña nueva.' },
  destacado: { label: 'Recuadro destacado', icon: Megaphone, description: 'Nota importante, advertencia o consejo.' },
};

export const CALLOUT_TONES = [
  { value: 'info', label: 'Información' },
  { value: 'importante', label: 'Importante' },
  { value: 'advertencia', label: 'Advertencia' },
  { value: 'consejo', label: 'Consejo' },
];

// Formatos que acepta cada bloque al subir archivos.
export const BLOCK_ACCEPT = {
  imagen: ['png', 'jpg', 'jpeg', 'webp', 'gif'],
  galeria: ['png', 'jpg', 'jpeg', 'webp', 'gif'],
  infografia: ['png', 'jpg', 'jpeg', 'webp', 'gif'],
  video: ['mp4', 'm4v', 'mov', 'webm'],
  audio: ['mp3', 'm4a', 'wav', 'ogg'],
  pdf: ['pdf'],
  presentacion: ['pdf'],
};

/** Contenido inicial de un bloque nuevo. */
export function emptyBlockData(type) {
  switch (type) {
    case 'encabezado': return { text: '', level: 2 };
    case 'texto': return { html: '' };
    case 'imagen': return { fileId: null, alt: '', decorative: false, caption: '', size: 'normal' };
    case 'galeria': return { items: [], layout: 'cuadricula' };
    case 'video': return { source: 'archivo', fileId: null, url: '', title: '', transcriptHtml: '' };
    case 'audio': return { fileId: null, title: '', transcriptHtml: '' };
    case 'pdf': return { fileId: null, title: '', description: '' };
    case 'presentacion': return { source: 'archivo', fileId: null, url: '', title: '' };
    case 'archivos': return { title: '', items: [] };
    case 'infografia': return { fileId: null, alt: '', caption: '', longDescriptionHtml: '' };
    case 'enlace': return { url: '', title: '', description: '' };
    case 'destacado': return { tone: 'info', title: '', html: '' };
    default: return {};
  }
}
