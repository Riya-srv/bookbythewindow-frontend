import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import { useWishlist } from "../context/WishlistContext"; 
import { useCart } from "../context/CartContext"; 
import searchIcon from "../assets/search.svg";
import wishlistIcon from "../assets/wishlist.svg";
import cartIcon from "../assets/cart.svg";
import profileIcon from "../assets/profile.svg"

export default function Nav() {
  const { searchBook, setSearchBook } = useSearch();
  const { wishlist } = useWishlist(); 
  const { cart } = useCart(); 
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchBook.trim()) {
      navigate("/genre/all");
    }
  };

  return (
    <nav className="navbar bg-warning">
      <div className="container py-2">
        
        <NavLink className="navbar-brand" to="/">BookByTheWindow</NavLink>

        {/* Search Bar */}
        <form
          className="d-flex mx-auto position-relative align-items-center"
          style={{ width: "400px" }}
          onSubmit={handleSubmit}
        >
          <img
            src={searchIcon}
            alt="Search"
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "16px",
              height: "16px",
              opacity: 0.6,
            }}
          />
          <input
            className="form-control ps-5 me-4"
            type="search"
            placeholder="Search"
            value={searchBook}
            onChange={(e) => setSearchBook(e.target.value)}
          />
        </form>
        <div className="d-flex align-items-center ms-auto">
        <button className="btn btn-dark mx-2">Login</button>

        {/* Wishlist with count */}
        <Link to="/wishlist" className="position-relative mx-2">
          <img src={wishlistIcon} alt="Wishlist" style={{ width: "18px", height: "18px" }} />
          {wishlist.length > 0 && (
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: "10px" }}
            >
              {wishlist.length}
            </span>
          )}
        </Link>

        {/* Cart with count */}
        <Link to="/cart" className="position-relative mx-2">
          <img src={cartIcon} alt="Cart" style={{ width: "18px", height: "18px" }} />
          {cart.length > 0 && (
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: "10px" }}
            >
              {cart.length}
            </span>
          )}
        </Link>
         <Link to="/profile" className="position-relative mx-2">
          <img src={profileIcon} alt="Profile" style={{ width: "18px", height: "18px" }} />

            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: "10px" }}
            >

            </span>

        </Link>
        </div>
      </div>
    </nav>
  );
}

