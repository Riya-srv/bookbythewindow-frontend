import { NavLink,useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import searchIcon from "../assets/search.svg";
import wishlistIcon from "../assets/wishlist.svg";
import cartIcon from "../assets/cart.svg";

export default function Nav() {
  const { searchBook, setSearchBook } = useSearch();
    const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // stop page reload
    navigate("/"); // ensure home page loads with searchBook
  };

  return (
    <nav className="navbar navbar-expand-lg bg-warning">
      <div className="container py-2">
        <NavLink className="navbar-brand" to="/">BookByTheWindow</NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse">
          <span className="navbar-toggler-icon"></span>
        </button>
        <form
          className="d-flex mx-auto position-relative align-items-center"
          style={{ width: "30%" }}
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
        </form >
        <button className="btn btn-dark mx-2">Login</button>
        <img className="mx-2" src={wishlistIcon} alt="Wishlist" style={{ width: "18px", height: "18px" }} />
        <img className="mx-2" src={cartIcon} alt="Cart" style={{ width: "18px", height: "18px" }} />
      </div>
    </nav>
  );
}


