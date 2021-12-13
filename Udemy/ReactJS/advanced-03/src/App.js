import { useSelector } from 'react-redux';

import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';

function App() {
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  return (
    <Layout>
      {showCart && <Cart />}
      <Products />
    </Layout>
  );
}

/* 
  some things we want to do in this 
  buttons do something
  toggle cart
  adding to cart effect
  adding quantity and decreasing quantity
*/

export default App;
