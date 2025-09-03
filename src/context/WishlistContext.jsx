import { createContext, useContext, useState, useEffect } from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // Fetch wishlist on load
  useEffect(() => {
    fetch("https://bookbythewindow-backend-x2aq.vercel.app/api/wishlist")
      .then((res) => res.json())
      .then((items) => {
        setWishlist(items || []);
        localStorage.setItem("wishlist", JSON.stringify(items || []));
      })
      .catch((err) => console.error("Failed to load wishlist:", err));
  }, []);

  // Toggle add/remove wishlist
  const toggleWishlist = async (book) => {
    const existingItem = wishlist.find((item) => item.bookId === book._id);

    if (existingItem) {
      // Remove from Wishlist
      try {
        const res = await fetch(
          `https://bookbythewindow-backend-x2aq.vercel.app/api/wishlist/${existingItem._id}`,
          { method: "DELETE" }
        );
        if (res.ok) {
          setWishlist((prev) => {
            const updated = prev.filter((i) => i.bookId !== book._id);
            localStorage.setItem("wishlist", JSON.stringify(updated));
            return updated;
          });
        }
      } catch (err) {
        console.error("Failed to remove from wishlist:", err);
      }
    } else {
      // Add to Wishlist
      try {
        const res = await fetch("https://bookbythewindow-backend-x2aq.vercel.app/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookId: book._id,
            title: book.title,
            author: book.author,
            price: book.price,
            coverImageUrl: book.coverImageUrl,
          }),
        });
        if (res.ok) {
          const saved = await res.json();
          setWishlist((prev) => {
            const updated = [...prev, saved];
            localStorage.setItem("wishlist", JSON.stringify(updated));
            return updated;
          });
        }
      } catch (err) {
        console.error("Failed to add to wishlist:", err);
      }
    }
  };

const addToWishlist = (book) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.bookId === book._id);
      if (!exists) {
        const updated = [...prev, { ...book, bookId: book._id }];
        localStorage.setItem("wishlist", JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  const removeFromWishlist = (bookId) => {
    setWishlist((prev) => {
      const updated = prev.filter((item) => item.bookId !== bookId);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    });
  };


  const isInWishlist = (id) =>
  wishlist.some((item) => item.bookId === id || item._id === id);

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, isInWishlist, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
