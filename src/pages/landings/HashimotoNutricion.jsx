import ProductLanding from '../../components/fst/landing/ProductLanding';
import { productLandings } from '../../data/productLandings';

const product = productLandings.find(item => item.slug === 'hashimoto-nutricion');

export default function HashimotoNutricion() {
  return <ProductLanding product={product} />;
}
