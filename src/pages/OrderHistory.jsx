import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = () => {
      setLoading(true);

      // Get selected user from localStorage
      const selectedUser = JSON.parse(localStorage.getItem("selectedUser"));
      const allOrders = JSON.parse(localStorage.getItem("orders")) || [];

      let filteredOrders = allOrders;

      if (selectedUser?.name) {
        filteredOrders = allOrders.filter(
          (order) => order.userName === selectedUser.name
        );
      }

      filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

      setOrders(filteredOrders);
      setLoading(false);
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
            <button className="btn btn-dark mt-3">Add Books from Wishlist</button>
          </Link>
        </div>
      ) : (
        <div className="list-group">
          {orders.map((order) => (
            <div key={order.id} className="list-group-item mb-3 rounded">
              <div className="d-flex justify-content-between">
                <h5>Order ID: {order.id}</h5>
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
