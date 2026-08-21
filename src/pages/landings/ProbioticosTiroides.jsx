import ProductLanding from '../../components/fst/landing/ProductLanding';
import { productLandings } from '../../data/productLandings';

const product = productLandings.find(item => item.slug === 'probioticos-tiroides');

export default function ProbioticosTiroides() {
  return <ProductLanding product={product} />;
}
