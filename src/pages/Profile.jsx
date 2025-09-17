import { useState,useEffect } from "react";
import { Link } from "react-router-dom"
import profileIcon from "../assets/profile.svg";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';


export default function Profile() {
  const { cart, cartTotal, setOrder, setCart } = useCart();
  const navigate = useNavigate();
  const notifyForUserAddress = () => toast("Please select a user/address.");

  const user = {
    name: "Riya Srivastava",
    email: "riya@gmail.com",
    avatar: profileIcon,
    phone: "9865987657",
    joined: "January 2024",
  };

  //const [addresses, setAddresses] = useState([{ id: 1, label: "Home", name: "Riya Srivastava", phone: "7434960809", details: "13, JP Nagar, Blr"}]);

  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem("addresses");
    return saved
      ? JSON.parse(saved)
      : [{ id: 1, label: "Home", name: "Riya Srivastava", phone: "7434960809", details: "13, JP Nagar, Blr" }];
  });

  const [newAddress, setNewAddress] = useState({ label: "", name: "", phone: "", details: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ label: "", name: "", phone: "", details: "" });

  useEffect(() => {
    localStorage.setItem("addresses", JSON.stringify(addresses));
  }, [addresses]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (newAddress.label && newAddress.details && newAddress.name && newAddress.phone) {
      setAddresses((prev) => [...prev, { id: Date.now(), ...newAddress }]);
      setNewAddress({ label: "", name: "", phone: "", details: "" });
      setIsAdding(false);
    }
  };

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleEditStart = (address) => {
    setEditingId(address.id);
    setEditForm({ label: address.label, name: address.name, phone: address.phone, details: address.details });
  };

  const handleEditSubmit = (e, id) => {
    e.preventDefault();
    setAddresses((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...editForm } : a))
    );
    setEditingId(null);
  };

  const handleCheckout = async () => {
  try {
    if (!selectedAddress) {
      notifyForUserAddress();
      return;
    }

const chosenAddress = addresses.find((a) => a.id === selectedAddress);

const orderPayload = {
  id: Date.now(),
  userName: chosenAddress.name,
  date: new Date(),
  total: cartTotal,
  books: cart.map(item => ({
    bookId: item._id,
    title: item.title,
    price: Number(item.price),
    qty: item.qty || 1,
    coverImageUrl: item.coverImageUrl,
  })),
  address: chosenAddress.details, 
  total: cartTotal,
};

    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const updatedOrders = [...existingOrders, orderPayload];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    localStorage.setItem("lastOrder", JSON.stringify(orderPayload));
    localStorage.setItem("selectedUser", JSON.stringify(chosenAddress));
    
    
    setCart([]);
    localStorage.removeItem("cart");
    localStorage.setItem("cartClearedAfterCheckout", "true");
    navigate("/order-summary");

  } catch (err) {
    console.error(err);
    alert("Failed to place order.");
  }
};

const handleViewHistory = () => {
  if (!selectedAddress) {
    notifyForUserAddress();
    return;
  }
  navigate("/order-history");
};

  return (
    <div className="container my-5">
      <div className="d-flex flex-column align-items-center text-center mb-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="rounded-circle border border-3 border-warning"
          style={{ width: "140px", height: "140px", objectFit: "cover" }}
        />
        <h2 className="mt-3 fw-bold text-dark">{user.name}</h2>
        <p className="text-muted">{user.email}</p>
        <p className="text-muted">{user.phone}</p>
      </div>

      <div className="mb-4">
        <h4 className="fw-semibold text-warning mb-3">Account Details</h4>
        <p className="mb-2"><strong>Joined:</strong> {user.joined}</p>
      </div>

      <div className="mb-4">
        <h4 className="fw-semibold text-warning mb-3 d-flex justify-content-between align-items-center">
          Saved Addresses
          <button
            className="btn btn-dark px-4 rounded-3 shadow-sm"
            onClick={() => setIsAdding(!isAdding)}
          >
            {isAdding ? "Cancel" : "+ Add Address"}
          </button>
        </h4>

        {isAdding && (
          <form
            className="card rounded-3 p-3 mb-3"
            onSubmit={handleAddSubmit}
          >
            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Label (e.g., Home, Office)"
                value={newAddress.label}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, label: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Full Name"
                value={newAddress.name}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, name: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-2">
              <input
                type="tel"
                className="form-control"
                placeholder="Phone Number"
                value={newAddress.phone}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, phone: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-2">
              <textarea
                className="form-control"
                placeholder="Full address"
                rows="2"
                value={newAddress.details}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, details: e.target.value })
                }
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-dark text-white fw-semibold btn-sm rounded-3 px-3"
            >
              Save Address
            </button>
          </form>
        )}

        <div className="row">
          {addresses.map((address) => (
            <div className="col-md-6 mb-3" key={address.id}>
              <div className="card rounded-3 p-3 h-100 d-flex flex-row align-items-start gap-2">
                <input
                  type="radio"
                  name="selectedAddress"
                  checked={selectedAddress === address.id}
                  onChange={() =>{ setSelectedAddress(address.id);
                    localStorage.setItem("selectedUser", JSON.stringify(address)); 
                    }
                  }
                  
                  required
                />
                <div className="flex-grow-1">
                  {editingId === address.id ? (
                    <form onSubmit={(e) => handleEditSubmit(e, address.id)}>
                      <label htmlFor="label"><strong>Label:</strong></label>
                      <input
                        type="text"
                        className="form-control mb-2"
                        value={editForm.label}
                        onChange={(e) =>
                          setEditForm({ ...editForm, label: e.target.value })
                        }
                        required
                      />
                      <label htmlFor="name"><strong>Name:</strong></label>
                      <input
                        type="text"
                        className="form-control mb-2"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        required
                      />
                      <label htmlFor="phone"><strong>Phone:</strong></label>
                      <input
                        type="tel"
                        className="form-control mb-2"
                        value={editForm.phone}
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                        required
                      />
                      <label htmlFor="address"><strong>Address:</strong></label>
                      <textarea
                        className="form-control mb-2"
                        rows="2"
                        value={editForm.details}
                        onChange={(e) =>
                          setEditForm({ ...editForm, details: e.target.value })
                        }
                        required
                      />
                      <div className="d-flex gap-2">
                        <button
                          type="submit"
                          className="btn btn-dark btn-sm rounded-3"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-dark btn-sm rounded-3"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h5 className="fw-bold text-dark">{address.label}</h5>
                      <p className="mb-1"><strong>Name:</strong> {address.name}</p>
                      <p className="mb-1"><strong>Phone:</strong> {address.phone}</p>
                      <p className="text-muted"><strong>Address:</strong>{address.details}</p>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-dark btn-sm rounded-3"
                          onClick={() => handleEditStart(address)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-dark btn-sm rounded-3"
                          onClick={() => handleDelete(address.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <button
          className="btn btn-dark px-4 mx-2 rounded-3 shadow-sm"
          onClick={handleCheckout} >
          Checkout
        </button>
        <button
          className="btn btn-dark px-4 mx-2 rounded-3 shadow-sm"
          onClick={handleViewHistory}>
          View Order History
        </button>
      </div>
      <ToastContainer
      position="top-right"
      autoClose={2000}
      theme="colored"
    />
    </div>
  );
}



