import ProductLanding from '../../components/fst/landing/ProductLanding';
import { productLandings } from '../../data/productLandings';

const product = productLandings.find(item => item.slug === 'diario-emociones-hipotiroidismo');

export default function DiarioHipo() {
  return <ProductLanding product={product} />;
}
