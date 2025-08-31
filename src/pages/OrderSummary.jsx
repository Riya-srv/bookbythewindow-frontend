import { useCart } from "../context/CartContext";
import { useState,useEffect } from "react";
import { Link } from "react-router-dom";

export default function OrderSummary() {
  const { order, cartTotal } = useCart();
  const [savedOrder, setSavedOrder] = useState(null);

    useEffect(() => {
    if (!order) {
      const localOrder = localStorage.getItem("lastOrder");
      if (localOrder) {
        setSavedOrder(JSON.parse(localOrder));
      }
    }
  }, [order]);

  const displayOrder = order || savedOrder;

  if (!displayOrder) {
    return <h2>No order found. Please place an order first.</h2>;
  }

  return (
    <div className="container my-3">
      <h1>Order Summary</h1>
      <div className="row">
        <div className="col-md-6">
        <ul className="list-group py-3">
        {displayOrder.books.map((item) => (
          <li key={item._id} className="list-group-item">
            <img src={item.coverImageUrl} alt={item.title} width="50" />
            <p><b>{item.title}</b> x {item.qty} – ₹{item.price * item.qty}</p>
          </li>
        ))}
      </ul>
        </div>
      </div>
      <h2>Total: ₹{displayOrder.total + 100}</h2>
      <div className="py-4">
        <Link to="/"><button className="btn btn-dark">Continue Shopping</button></Link>
      </div>
    </div>
  );
}

