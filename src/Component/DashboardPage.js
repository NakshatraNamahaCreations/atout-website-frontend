import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faEdit, faShoppingBag, faHeart } from "@fortawesome/free-solid-svg-icons";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobilenumber: "",
    addresses: [],
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        username: storedUser.username,
        email: storedUser.email,
        mobilenumber: storedUser.mobilenumber,
        addresses: storedUser.saved_address || [],
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleEditToggle = () => setEditMode(!editMode);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "address") {
      setFormData((prevState) => {
        const updatedAddresses = [...prevState.addresses];
        updatedAddresses[index] = { ...updatedAddresses[index], address: value };
        return { ...prevState, addresses: updatedAddresses };
      });
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        username: formData.username,
        email: formData.email,
        mobilenumber: formData.mobilenumber,
        saved_address: formData.addresses.map((addr) => ({ address: addr.address })),
      };

      const response = await axios.put(
        `https://api.atoutfashion.com/api/customers/update/${user.id}`,
        updatedUser
      );

      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      setEditMode(false);
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all stored data
    sessionStorage.clear(); // Clear session storage if used
    navigate("/"); // Redirect to home or login page
    window.location.reload(); // Refresh the page to apply changes
  };
  

  return (
    <div className="container py-4" style={{ fontFamily: "'Poppins', sans-serif", marginTop: "5%" }}>
      {user ? (
        <div className="row justify-content-center">
          {/* Sidebar Section */}
          <div className="col-md-4">
            <div className="card shadow-sm p-4 text-center" style={{ background: "#FAF3EB", borderRadius: "12px" }}>
              <h5 className="fw-bold">{user.username}</h5>
              <p className="text-muted">{user.email}</p>

              {/* Navigation Buttons */}
              <div className="d-grid gap-2">
                <button onClick={handleEditToggle} className="btn btn-light btn-sm text-dark">
                  <FontAwesomeIcon icon={faEdit} className="me-2" />
                  {editMode ? "Cancel" : "Edit Profile"}
                </button>
                <button onClick={() => navigate("/orders")} className="btn btn-light btn-sm text-dark">
                  <FontAwesomeIcon icon={faShoppingBag} className="me-2" />
                  Orders
                </button>
                <button onClick={() => navigate("/wishlist")} className="btn btn-light btn-sm text-dark">
                  <FontAwesomeIcon icon={faHeart} className="me-2" />
                  Wishlist
                </button>
                <button onClick={handleLogout} className="btn btn-light btn-sm text-dark">
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="col-md-8">
            {editMode ? (
              <form onSubmit={handleSubmit} className="card shadow-sm p-4" style={{ borderRadius: "12px" }}>
                <h6 className="fw-bold">Edit Profile</h6>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Mobile</label>
                  <input
                    type="text"
                    className="form-control"
                    name="mobilenumber"
                    value={formData.mobilenumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-dark w-100">
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="card shadow-sm p-4" style={{ borderRadius: "12px" }}>
                <h6 className="fw-bold">Profile Information</h6>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item border-0">
                    <strong>Username:</strong> {user.username}
                  </li>
                  <li className="list-group-item border-0">
                    <strong>Email:</strong> {user.email}
                  </li>
                  <li className="list-group-item border-0">
                    <strong>Mobile:</strong> {user.mobilenumber}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center mt-5">
          <p>Loading user profile...</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
