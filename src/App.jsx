import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import GenreBooks from "./pages/GenreBooks";
import BookDetails from "./pages/BookDetails";
import Wishlist from "./pages/Wishlist";
import "bootstrap/dist/css/bootstrap.min.css";
import { SearchProvider } from "./context/SearchContext";

export default function App() {
  return (
    <Router>
      
      <SearchProvider>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/genre/:genreName" element={<GenreBooks />} />
          <Route path="/books/:bookId" element={<BookDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </SearchProvider>
    </Router>
  );
}

