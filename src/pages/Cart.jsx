import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate,Link } from "react-router-dom"

const Cart = () => {
  const notifyForCart = () => toast("Removed from Cart!");
  const { cart, removeFromCart, updateQuantity, setCart, setOrder } = useCart();
  const { toggleWishlist, isInWishlist, addToWishlist } = useWishlist();
  const navigate = useNavigate();

const moveToWishlist = async (book) => {
if (!isInWishlist(book._id) && !isInWishlist(book.bookId)) {
  await toggleWishlist(book); 
}
removeFromCart(book._id);
  };


  const totalPrice = cart.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (item.qty || 1),
    0
  );
  const delivery = 100;
  const finalAmount = totalPrice + delivery;



  return (
    <div className="container mt-4">
      <h3>My Cart ({cart.length})</h3>
            {cart.length === 0 ? (
        <div className="mt-5">
          <p>There's nothing in your cart. Let's add some books.</p>
          <Link to="/wishlist">
            <button className="btn btn-dark mt-3">
              Add Books from Wishlist
            </button>
          </Link>
        </div>
      ) : (
      <div className="row">
        <div className="col-md-8">
          {cart.map((item) => (
            <div key={item._id} className="card mb-3 p-3 d-flex flex-row align-items-center">
              <img src={item.coverImageUrl} alt={item.title} width="120"   
              onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/book-placeholder.png";
          }}/>
              <div className="ms-3">
                <h5>{item.title}</h5>
                <p>₹{item.price}</p>

                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => updateQuantity(item._id, item.qty - 1)}
                    disabled={item.qty <= 1}
                  >
                    -
                  </button>
                  <span className="mx-2">{item.qty}</span>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => updateQuantity(item._id, item.qty + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="mt-2">
                  <button
                    className="btn btn-dark btn-sm me-2 mb-2"
                    onClick={() =>{ 
                      removeFromCart(item._id);
                      notifyForCart();
                    }
                    }
                  >
                    Remove
                  </button>
                  
                  <button className="btn btn-dark btn-sm me-2 mb-2" onClick={() => moveToWishlist(item)}>
                    Move to Wishlist
                  </button>
                  <ToastContainer position="bottom-right" autoClose={2000}/>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="col-md-4">
          <div className="card p-3">
            <h5>Price Details</h5>
            <hr />
            <p>Price ({cart.length} items): ₹{totalPrice}</p>
            <p>Delivery Charges: ₹{delivery}</p>
            <hr />
            <h5>Total Amount: ₹{finalAmount}</h5>
            <Link to="/profile"><button className="btn btn-success w-100">Place Order</button></Link>
          </div>
        </div>
      </div>
      )}
    </div>
        
  );
};

export default Cart;
