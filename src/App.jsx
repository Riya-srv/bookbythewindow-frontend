import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import GenreBooks from "./pages/GenreBooks";
import BookDetails from "./pages/BookDetails";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart"
import Profile from "./pages/Profile"
import OrderSummary from "./pages/OrderSummary"
import OrderHistory from "./pages/OrderHistory"
import "bootstrap/dist/css/bootstrap.min.css";
import { SearchProvider } from "./context/SearchContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

export default function App() {
  return (
    <Router>
      <CartProvider>
        <WishlistProvider>
      <SearchProvider>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/genre/:genreName" element={<GenreBooks />} />
          <Route path="/books/:bookId" element={<BookDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/order-summary" element={<OrderSummary />} />
          <Route path="/order-history" element={<OrderHistory />} />
        </Routes>
      </SearchProvider>
      </WishlistProvider>
      </CartProvider>
    </Router>
  );
}

