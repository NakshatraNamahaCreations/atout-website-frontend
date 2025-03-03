import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobilenumber: "",
    addresses: [],
    image: null,
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
        image: storedUser.image || null,
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleEditToggle = () => {
    setEditMode((prevState) => !prevState);
  };

  const handleChange = (e, index) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      setFormData((prevState) => ({
        ...prevState,
        image: e.target.files[0],
      }));
    } else if (name === "address") {
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
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("mobilenumber", formData.mobilenumber);
      formDataToSend.append("saved_address", JSON.stringify(formData.addresses.map(addr => ({ address: addr.address }))));

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await axios.put(
        `https://api.atoutfashion.com/api/customers/update/${user.id}`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      setEditMode(false);
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="container py-5 "style={{marginTop:'5%'}} >
      {user ? (
        <div className="row">
          <div className="col-md-4">
            <div className="card profile-card shadow-lg text-center p-4">
              <img
                src={user.image ? `https://api.atoutfashion.com${user.image}` : "https://via.placeholder.com/150"}
                alt="Profile"
                className="rounded-circle mx-auto mb-3"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
              <h5 className="card-title">{user.username}</h5>
              <p className="text-muted">{user.email}</p>
              <p className="text-muted">{user.mobilenumber}</p>
              <button onClick={handleEditToggle} className="btn btn-primary mt-3 w-50 m-auto">
                {editMode ? "Cancel" : "Edit Profile"}
              </button>
              <button className="btn btn-success mt-2 w-50 m-auto" onClick={() => navigate("/orders")} style={{backgroundColor:'#c07676'}}>My Orders</button>
              <button className="btn btn-warning mt-2 w-50 m-auto" onClick={() => navigate("/wishlist")}>Wishlist</button>
            </div>
          </div>

          <div className="col-md-8">
            {/* <h3 className="mb-4">Your Profile Details</h3> */}
            {editMode ? (
              <form onSubmit={handleSubmit} className="card p-4 shadow-lg">
                <div className="mb-3">
                  <label className="form-label">Profile Image</label>
                  <input type="file" className="form-control" name="image" onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mobile Number</label>
                  <input type="text" className="form-control" name="mobilenumber" value={formData.mobilenumber} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Addresses</label>
                  {formData.addresses.length > 0 ? (
                    formData.addresses.map((addr, index) => (
                      <input key={index} type="text" className="form-control mb-2" name="address" value={addr.address} onChange={(e) => handleChange(e, index)} />
                    ))
                  ) : (
                    <p>No addresses available</p>
                  )}
                </div>
                <button type="submit" className="btn btn-success w-50 m-auto mt-3">Update Profile</button>
              </form>
            ) : (
              <div className="mt-4">
                <h5 className="mb-3">Profile Information</h5>
                <ul className="list-group">
                  <li className="list-group-item"><strong>Username:</strong> {user.username}</li>
                  <li className="list-group-item"><strong>Email:</strong> {user.email}</li>
                  <li className="list-group-item"><strong>Mobile Number:</strong> {user.mobilenumber}</li>
                  <li className="list-group-item"><strong>Addresses:</strong>
                    {user.saved_address?.length ? (
                      <ul>{user.saved_address.map((addr, index) => <li key={index}>{addr.address}</li>)}</ul>
                    ) : "Not available"}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center mt-5"><p>Loading user profile...</p></div>
      )}
    </div>
  );
};

export default DashboardPage;
