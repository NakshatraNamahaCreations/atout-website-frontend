import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import login from "../Images/login.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    address: "",
    password: "",
    image: null
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      // Redirect to the dashboard if the user is logged in
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", mobileNumber: "", address: "", password: "" , image: null });
    setErrors({});
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.name && !isLogin) newErrors.name = "Name is required";
    if (!formData.email && !isLogin) newErrors.email = "Email is required";
    if (!formData.mobileNumber) newErrors.mobileNumber = "Mobile number is required";
    else if (!phoneRegex.test(formData.mobileNumber)) newErrors.mobileNumber = "Invalid mobile number";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters long";
    if (!formData.address && !isLogin) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleAddAddress = async (userId, address) => {
  //   if (!userId) {
  //     console.error("User ID is not available");
  //     return;
  //   }
  //   try {
  //     const response = await axios.post(
  //       `https://api.atoutfashion.com/api/customers/addAddress/${userId}`, // Ensure the route matches
  //       { saved_address: address }
  //     );
  //     console.log("Address added successfully:", response.data);
  //   } catch (error) {
  //     console.error("Error adding address:", error.response ? error.response.data : error.message);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
        const formDataToSend = new FormData();
        formDataToSend.append("username", formData.name);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("mobilenumber", formData.mobileNumber);
        formDataToSend.append("password", formData.password);
        
        if (formData.address) {
            formDataToSend.append("saved_address", formData.address);
        }

        if (formData.image) {
            formDataToSend.append("image", formData.image); // Append the image file
        }

        if (isLogin) {
            // Login API Call
            const loginData = { mobilenumber: formData.mobileNumber, password: formData.password };
            const response = await axios.post("https://api.atoutfashion.com/api/customers/login", loginData);

            alert(response.data.message);

            // Save user data in localStorage
            localStorage.setItem("user", JSON.stringify(response.data.user));

            // Redirect to dashboard
            navigate("/dashboard");
        } else {
            // Register API Call with FormData (for image support)
            const response = await axios.post("https://api.atoutfashion.com/api/customers/register", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" } // Required for file upload
            });

            setSuccessMessage(response.data.message);

            // Save user data in localStorage
            localStorage.setItem("user", JSON.stringify(response.data.user));

            // Reset the form
            setFormData({ name: "", email: "", mobileNumber: "", address: "", password: "", image: null });

            const userId = response.data.user.id;

            // Add address after successful registration
            // if (userId && formData.address) {
            //     await handleAddAddress(userId, formData.address);
            // }

            // Switch to login mode
            setIsLogin(true);

            // Redirect to dashboard
            navigate("/dashboard");
        }
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        if (error.response && error.response.data) {
            setErrors({ server: error.response.data.message });
        }
    }
};


  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="row w-75">
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center border-end">
          {isLogin ? (
            <>
              <h2>Login</h2>
              <form className="w-75" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="mobile" className="form-label">Mobile Number</label>
                  <input type="text" className="form-control" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
                  {errors.mobileNumber && <p style={{ color: "red" }}>{errors.mobileNumber}</p>}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} />
                  {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
              </form>
              <div className="mt-3">
                <p>Not registered? <span onClick={handleToggle} style={{ color: "blue", cursor: "pointer" }}>Create an account</span></p>
              </div>
            </>
          ) : (
            <div style={{ marginTop: '25%' }}>
              <h2>Register</h2>
              {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
              {errors.server && <p style={{ color: "red" }}>{errors.server}</p>}
              <form className="w-75" onSubmit={handleSubmit}>
  {/* Registration Form */}
  <div className="mb-3 row">
    <div className="col-md-6">
      <label htmlFor="name" className="form-label">Name</label>
      <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />
      {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
    </div>
    <div className="col-md-6">
      <label htmlFor="email" className="form-label">Email</label>
      <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
      {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
    </div>
  </div>
  <div className="mb-3">
    <label htmlFor="mobile" className="form-label">Mobile Number</label>
    <input type="text" className="form-control" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
    {errors.mobileNumber && <p style={{ color: "red" }}>{errors.mobileNumber}</p>}
  </div>
  <div className="mb-3">
    <label htmlFor="address" className="form-label">Address</label>
    <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} />
    {errors.address && <p style={{ color: "red" }}>{errors.address}</p>}
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} />
    {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
  </div>
  <button type="submit" className="btn btn-success w-100">Register</button>
</form>

              <div className="mt-3">
                <p>Already have an account? <span onClick={handleToggle} style={{ color: "blue", cursor: "pointer" }}>Login</span></p>
              </div>
            </div>
          )}
        </div>
        <div className="col-md-6">
          <img src={login} alt="login" className="img-fluid" />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
