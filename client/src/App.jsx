import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import OrderSuccess from './pages/OrderSuccess';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ToastProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/order-success" element={<OrderSuccess />} />
          </Routes>
          <Footer />
        </ToastProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
