/**
 * ============================================================
 *  /hoja-de-vida/crear — La herramienta, sola
 *
 *  La landing (/hoja-de-vida) explica y muestra los diseños; aquí
 *  solo está el editor, con su propia barra y sin nada más que
 *  distraiga. `?diseno=moderno` abre la herramienta con ese diseño.
 * ============================================================
 */

import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import EditorHojaDeVida from '../components/empleo/EditorHojaDeVida';
import { updatePageSeo } from '../utils/seo';

export default function HojaDeVidaCrear() {
  const [params] = useSearchParams();

  useEffect(() => {
    updatePageSeo({
      title: 'Crear mi hoja de vida | Edvanta',
      description: 'Sube tu hoja de vida anterior en PDF o Word, o empieza de cero. Elige entre diez diseños, revisa tu puntaje ATS y descárgala en PDF.',
      canonical: 'https://edvanta.co/hoja-de-vida/crear',
    });
  }, []);

  return (
    <main>
      <EditorHojaDeVida disenoInicial={params.get('diseno') || ''} />
    </main>
  );
}
