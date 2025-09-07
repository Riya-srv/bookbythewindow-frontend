import { useParams,Link } from "react-router-dom";
import useFetch from "../../useFetch";
import FilterBar from "../components/FilterBar";
import { useState } from "react";
import { useSearch } from "../context/SearchContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useEffect } from "react";
import { useCart } from "../context/CartContext"
import { useWishlist } from "../context/WishlistContext";
import { ToastContainer, toast } from 'react-toastify';


export default function GenreBooks() {
  const notifyForCart = () => toast("Added to Cart!");
  const notifyForWishlist = () => toast("Added to Wishlist")
  const notifyForWishlistRemove = () => toast("Removed from Wishlist")

  const { searchBook } = useSearch(); // get search term from Search Context
  const { addToCart, isInCart, updateQuantity, cart } = useCart(); // get addToCart and isInCart from Cart Context
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const [minRating, setMinRating] = useState("");
  const [maxPrice, setMaxPrice] = useState(500);
  const [sortOrder, setSortOrder] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setMinRating("");
    setMaxPrice(500);
    setSortOrder("");
  };

  const { genreName } = useParams();
  const { data, loading, error } = useFetch(
    `https://bookbythewindow-backend-x2aq.vercel.app/api/books/genre/${genreName}`
  );
  const books = data?.data?.books || [];

  const filteredBooks = books.filter((book) => {
  const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(book.category);

    const ratingMatch = !minRating || book.rating >= minRating;

    const priceMatch = book.price <= maxPrice;

    const searchMatch =
      !searchBook ||
      book.title.toLowerCase().includes(searchBook.toLowerCase());

    return categoryMatch && ratingMatch && priceMatch && searchMatch;
  });

  if (sortOrder === "asc") {
    filteredBooks.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "desc") {
    filteredBooks.sort((a, b) => b.price - a.price);
  }


  return (
    <section className="container my-4">
      <div className="row">
        {/* Sidebar */}
        <aside className="col-md-3">
          <FilterBar
            genreName={genreName}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            minRating={minRating}
            setMinRating={setMinRating}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            clearFilters={clearFilters}
          />
        </aside>

        <div className="col-md-9">
          {loading && <p>Loading...</p>}
          {error && <p>Something went wrong.</p>}
          <div className="row">
            {filteredBooks.map((book) => (
              <div className="col-md-4 mb-4" key={book._id}>   
                <div className="card h-100">

                  <div
                 className="position-absolute top-0 end-0 p-2"
                 style={{ cursor: "pointer", fontSize: "1.5rem" }}
                 onClick={() => 
                  {
                    toggleWishlist(book);
                      if (isInWishlist(book._id)) {
                          notifyForWishlistRemove();
                      } else {
                          notifyForWishlist();
                      }

                  }}
              >
                   {isInWishlist(book._id) ? <FaHeart style={{ color: "red" }}/> : <FaRegHeart style={{ color: "black" }}/>}
                </div> 
                <Link to={`/books/${book._id}`} className="text-decoration-none text-dark">
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="card-img-top"
                    style={{ height: "300px", objectFit: "cover" }}
                  />
                </Link>
                  <div className="card-body">
                    <h5 className="card-title">{book.title}</h5>
                    <p className="card-text text-muted">{book.author}</p>
                  </div>
                  <h6 className="text-center">₹{book.price}</h6>
                  <button className="btn btn-warning btn-sm w-100 mx-auto"
                  onClick={() => {if (!isInCart(book._id)) 
                    {
                      addToCart(book); 
                      notifyForCart();
                    } else
                      {
                          const cartItem = cart.find((item) => item.bookId == book._id);
                          const currentQty = cartItem ? cartItem.qty : 1;
                          updateQuantity(cartItem._id, currentQty + 1);
                          notifyForCart();
                    }}}>
                  {isInCart(book._id) ? "Added to Cart" : "Add to Cart"}
                  </button>
                  <ToastContainer position="bottom-right" autoClose={2000}/>
                </div>
                
                </div>
            ))}
            {!loading && filteredBooks.length === 0 && (
              <p className="m-3 p-3 align-items-center">No books found for selected category.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


