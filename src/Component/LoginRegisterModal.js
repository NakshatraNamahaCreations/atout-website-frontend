import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const LoginRegisterModal = ({ setShowLoginPopup, setIsAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    address: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", mobileNumber: "", address: "", password: "" });
    setErrors({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.mobileNumber) newErrors.mobileNumber = "Mobile number is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!isLogin) {
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.address) newErrors.address = "Address is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isLogin) {
        const response = await axios.post("https://api.atoutfashion.com/api/customers/login", {
          mobilenumber: formData.mobileNumber,
          password: formData.password
        });

        alert(response.data.message);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setIsAuthenticated(true);
        setShowLoginPopup(false);
      } else {
        const response = await axios.post("https://api.atoutfashion.com/api/customers/register", formData);
        setSuccessMessage(response.data.message);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setIsAuthenticated(true);
        setShowLoginPopup(false);
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      if (error.response && error.response.data) {
        setErrors({ server: error.response.data.message });
      }
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{isLogin ? "Login" : "Register"}</h5>
            <button type="button" className="btn-close" onClick={() => setShowLoginPopup(false)}></button>
          </div>
          <div className="modal-body">
            {successMessage && <p className="text-success">{successMessage}</p>}
            {errors.server && <p className="text-danger">{errors.server}</p>}
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <input type="text" className="form-control mb-2" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
                  {errors.name && <p className="text-danger">{errors.name}</p>}
                  <input type="email" className="form-control mb-2" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                  {errors.email && <p className="text-danger">{errors.email}</p>}
                  <input type="text" className="form-control mb-2" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
                  {errors.address && <p className="text-danger">{errors.address}</p>}
                </>
              )}
              <input type="text" className="form-control mb-2" name="mobileNumber" placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleChange} />
              <input type="password" className="form-control mb-2" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
              <button type="submit" className="btn btn-primary w-100">{isLogin ? "Login" : "Register"}</button>
            </form>
            <p className="mt-2 text-center">
              {isLogin ? "Don't have an account?" : "Already have an account?"} <span onClick={handleToggle} className="text-primary" style={{ cursor: "pointer" }}>{isLogin ? "Sign up" : "Login"}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterModal;
