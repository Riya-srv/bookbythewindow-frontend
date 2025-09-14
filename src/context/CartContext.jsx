import { createContext, useState, useEffect, useContext } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState(null);

useEffect(() => {
  const isCleared = localStorage.getItem("cartClearedAfterCheckout");
  const stored = localStorage.getItem("cart");

  if (isCleared) {
    setCart([]); 
    localStorage.removeItem("cart");
    localStorage.removeItem("cartClearedAfterCheckout");
    return; 
  }
  if (stored && JSON.parse(stored).length > 0) {
    setCart(JSON.parse(stored));
    fetch("https://bookbythewindow-backend-x2aq.vercel.app/api/cart")
      .then((res) => res.json())
      .then((data) => {
        setCart(data.cart || []);
        localStorage.setItem("cart", JSON.stringify(data.cart));
      })
      .catch((err) => console.error("Error fetching cart:", err));
  } else {
    setCart([]);
    localStorage.setItem("cart", JSON.stringify([]));
  }
}, []);


    // Update quantity
  const updateQuantity = (id, qty) => {
    fetch(`https://bookbythewindow-backend-x2aq.vercel.app/api/cart/${id}`, {
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
  useEffect(() => {
  console.log("Cart updated:", cart);
}, [cart]);
  

  // Add item to cart
  const addToCart = (book) => {
  const isCleared = localStorage.getItem("cartClearedAfterCheckout");

  if (isCleared) {
    const newCart = [{
      bookId: book._id,
      title: book.title,
      price: book.price,
      qty: 1,
      coverImageUrl: book.coverImageUrl,
      _id: book._id, 
    }];
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    localStorage.removeItem("cartClearedAfterCheckout");
    return; 
  }

      const existingItem = cart.find((item) => item.bookId === book._id);
  if (existingItem) {
    // Increment qty by 1 using updateQuantity (reuse your logic)
    updateQuantity(existingItem._id, existingItem.qty + 1);
  } else{
    fetch("https://bookbythewindow-backend-x2aq.vercel.app/api/cart", 
      {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookId: book._id,
        title: book.title,
        price: book.price,
        qty: 1,
        coverImageUrl: book.coverImageUrl,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setCart(data.cart); 
      })
      .catch((err) => console.error("Error adding to cart:", err));
    }
  };



  // Remove from cart
const removeFromCart = async (id) => {
  try {
    const res = await fetch(`https://bookbythewindow-backend-x2aq.vercel.app/api/cart/${id}`, {
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
