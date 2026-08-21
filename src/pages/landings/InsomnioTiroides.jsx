import ProductLanding from '../../components/fst/landing/ProductLanding';
import { productLandings } from '../../data/productLandings';

const product = productLandings.find(item => item.slug === 'insomnio-tiroides');

export default function InsomnioTiroides() {
  return <ProductLanding product={product} />;
}
