import ProductLanding from '../../components/fst/landing/ProductLanding';
import { productLandings } from '../../data/productLandings';

const product = productLandings.find(item => item.slug === 'coleccion-tiroides');

export default function ColeccionTiroides() {
  return <ProductLanding product={product} />;
}
