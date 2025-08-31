import { createContext, useState, useEffect, useContext } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState(null);

  // Fetch cart on load
  useEffect(() => {
    fetch("http://localhost:3000/api/cart")
      .then((res) => res.json())
      .then((data) => {
        setCart(data.cart || []);
      })
      .catch((err) => console.error("Error fetching cart:", err));
  }, []);

  // Add item to cart
  const addToCart = (book) => {
    fetch("http://localhost:3000/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookId: book._id,
        title: book.title,
        price: book.price,
        qty: book.qty,
        coverImageUrl: book.coverImageUrl,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setCart(data.cart || []); 
      })
      .catch((err) => console.error("Error adding to cart:", err));
  };

  // Update quantity
  const updateQuantity = (id, qty) => {
    fetch(`http://localhost:3000/api/cart/${id}`, {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qty }),
    })
      .then((res) => res.json())
      .then((data) => { 
        if (data.updatedItem) {
        setCart((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, qty: data.updatedItem.qty } : item
          )
        );
      } else if (data.cart) {
        // If backend returns full cart
        setCart(data.cart);
      }})
      .catch((err) => console.error("Error updating quantity:", err));
  };

  // Remove from cart
const removeFromCart = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/cart/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to remove item");

    setCart((prev) => prev.filter((item) => item._id !== id)); // ✅ use _id
  } catch (error) {
    console.error("Error removing item:", error);
  }
};

// to check if book is already in Cart
const isInCart = (bookId) => cart.some((item) => item.bookId === bookId);

const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, isInCart, cartTotal, order, setOrder, setCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
