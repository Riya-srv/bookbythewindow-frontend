import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("https://bookbythewindow-backend-x2aq.vercel.app/api/orders");
        if (!response.ok) throw new Error("Failed to fetch orders");
        
        const data = await response.json();
        setOrders(data.orders || []); // { orders } from backend
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading your orders...</p>;
  if (error) return <p className="text-danger text-center mt-4">Error: {error}</p>;

  return (
    <div className="container mt-4">
      <h3>Order History</h3>
      <hr />

      {orders.length === 0 ? (
        <div className="text-center mt-5">
          <p className="fs-5">No order found. Please place an order first.</p>
          <Link to="/wishlist">
            <button className="btn btn-primary mt-3">Add Books from Wishlist</button>
          </Link>
        </div>
      ) : (
        <div className="list-group">
          {orders.map((order) => (
            <div key={order._id} className="list-group-item mb-3 rounded">
              <div className="d-flex justify-content-between">
                <h5>Order ID: {order._id}</h5>
                <span className=" m-2 p-2 btn btn-success">Completed</span>
              </div>
              <p className="mb-1 text-muted">
                <b>Date:</b> {new Date(order.date).toLocaleDateString()}
              </p>
              <p><b>Total Amount:</b> ₹{order.total}</p>

              <h6>Books:</h6>
              <ul className="list-group">
                {order.books.map((book, idx) => (
                  <li key={idx} className="list-group-item">
                    <img src={book.coverImageUrl} alt={book.title} width="50" />
                    {book.title} (x{book.qty}) - ₹{book.price * book.qty}
                  </li>
                ))}
              </ul>
              <p><b>Delivery Address:</b> {order.address}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
