import ProductLanding from '../../components/fst/landing/ProductLanding';
import { productLandings } from '../../data/productLandings';

const product = productLandings.find(item => item.slug === 'caida-cabello-tiroides');

export default function CaidaCabelloTiroides() {
  return <ProductLanding product={product} />;
}
