import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useCart } from "../context/CartContext"
import { ToastContainer, toast } from 'react-toastify';

export default function Wishlist() {
   const notifyForCart = () => toast("Added to Cart!");
   const notifyForWishlist = () => toast("Removed from Wishlist")

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, isInCart } = useCart();


  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch("https://bookbythewindow-backend-x2aq.vercel.app/api/wishlist");
        const data = await res.json();
        setWishlist(data);
        localStorage.setItem("wishlist", JSON.stringify(data));
        window.dispatchEvent(new Event("wishlist:updated"));
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (bookId) => {
    try {
      await fetch(`https://bookbythewindow-backend-x2aq.vercel.app/api/wishlist/${bookId}`, {
        method: "DELETE",
      });

      setWishlist((prev) => {
       const updated = prev.filter((book) => book._id !== bookId)
      localStorage.setItem("wishlist", JSON.stringify(updated));


      window.dispatchEvent(new Event("wishlist:updated"));
      return updated;
    });

    } catch (err) {
      console.error("Failed to remove book:", err);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h4>Loading your wishlist...</h4>
      </div>
    );
  }

  return (
    <div className="container py-3 mt-3">
      <h2 className="mb-4">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="row g-4">
          {wishlist.map((book) => (
            <div key={book._id} className="col-md-3">
              <div className="card h-100 shadow-sm">
                <div className="position-relative">
                  <img
                    src={book.coverImageUrl}
                    className="card-img-top"
                    alt={book.title}
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <div
                    className="position-absolute top-0 end-0 p-2"
                    style={{ cursor: "pointer", fontSize: "1.5rem", color: "red" }}
                    onClick={() => {
                      removeFromWishlist(book._id)
                      notifyForWishlist();
                    }
                    }
                  >
                    <FaHeart />
                  </div>
                  <ToastContainer position="bottom-right" />
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text text-muted">{book.author}</p>
                  <p className="fw-bold">₹{book.price}</p>
                  <button className="btn btn-dark mt-auto"   onClick={() => {
    if (!isInCart(book._id)) {
      addToCart(book); 
      notifyForCart();
    }
  }}>
  {isInCart(book._id) ? "Added to Cart" : "Add to Cart"}
                  </button>
                  <ToastContainer position="bottom-right" autoClose={2000}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
