import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { ToastContainer, toast } from "react-toastify";
import { useWishlist } from "../context/WishlistContext";
import "react-toastify/dist/ReactToastify.css";

export default function Wishlist() {
  const notifyForCart = () => toast("Added to Cart!");
  const notifyForWishlistRemove = () => toast("Removed from Wishlist");

  const [loading, setLoading] = useState(true);
  const { addToCart, isInCart, updateQuantity, cart } = useCart();
  const { wishlist, setWishlist } = useWishlist(); 

  const getBookId = (book) => book.bookId || book._id;

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch(
          "https://bookbythewindow-backend-x2aq.vercel.app/api/wishlist"
        );
        const data = await res.json();

                const normalized = data.map((book) => ({
          ...book,
          bookId: getBookId(book),
        }));

        setWishlist(normalized);
        localStorage.setItem("wishlist", JSON.stringify(normalized));
        window.dispatchEvent(new Event("wishlist:updated"));
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [setWishlist]);

  const removeFromWishlist = async (bookId) => {
    try {
      await fetch(
        `https://bookbythewindow-backend-x2aq.vercel.app/api/wishlist/${bookId}`,
        {
          method: "DELETE",
        }
      );

      setWishlist((prev) => {
        const updated = prev.filter((book) => getBookId(book) !== bookId);
        localStorage.setItem("wishlist", JSON.stringify(updated));
        window.dispatchEvent(new Event("wishlist:updated"));
        return updated;
      });

      notifyForWishlistRemove();
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
                    style={{ cursor: "pointer", fontSize: "1.5rem" }}
                    onClick={() => removeFromWishlist(book._id)}
                  >
                    <FaHeart style={{ color: "red" }} />
                  </div>
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text text-muted">{book.author}</p>
                  <p className="fw-bold">₹{book.price}</p>
                  <button
                    className="btn btn-dark mt-auto"
                    onClick={() => {if (!isInCart(book.bookId)) 
                    {
                      addToCart(book); 
                      notifyForCart();
                    } else
                      {
                          const cartItem = cart.find((item) => item.bookId === book.bookId);
                          const currentQty = cartItem ? cartItem.qty : 1;
                          updateQuantity(cartItem.bookId, currentQty + 1);
                          notifyForCart();
                    }}}>
                    "Add to Cart"
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer position="bottom-right" autoClose={2000} />
    </div>
  )}