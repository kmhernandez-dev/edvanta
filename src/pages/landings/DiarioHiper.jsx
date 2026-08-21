import ProductLanding from '../../components/fst/landing/ProductLanding';
import { productLandings } from '../../data/productLandings';

const product = productLandings.find(item => item.slug === 'diario-emociones-hipertiroidismo');

export default function DiarioHiper() {
  return <ProductLanding product={product} />;
}
