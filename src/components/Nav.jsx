import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function Navbar() {
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  return (
    <nav className="bg-yellow-400 p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        
        {/* Left - Logo */}
        <Link to="/" className="text-xl font-bold text-black">
          BookByTheWindow
        </Link>

        {/* Center - Search */}
        <div className="flex-1 px-6">
          <input
            type="text"
            placeholder="Search"
            className="w-full max-w-md px-3 py-2 rounded-md border border-gray-300 focus:outline-none"
          />
        </div>

        {/* Right - Icons + Login */}
        <div className="flex items-center gap-6">
          <Link to="/wishlist" className="relative">
            <FaHeart size={22} />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-2">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative">
            <FaShoppingCart size={22} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-2">
                {cart.length}
              </span>
            )}
          </Link>

          <Link to="/profile">
            <FaUser size={22} />
          </Link>

          <button className="bg-black text-white px-4 py-1 rounded-md hover:bg-gray-800">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}
