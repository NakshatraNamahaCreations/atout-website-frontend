import React, { useState, useEffect, useLayoutEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import login from "../Images/login.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    // address: "",
    password: "",
    image: null
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      
      navigate("/dashboard");

    }
  }, [navigate]);


    useLayoutEffect(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, []);

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", mobileNumber: "",  password: "" , image: null });
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
    // if (!formData.address && !isLogin) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
        const formDataToSend = new FormData();
        formDataToSend.append("username", formData.name);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("mobilenumber", formData.mobileNumber);
        formDataToSend.append("password", formData.password);
        
        // if (formData.address) {
        //     formDataToSend.append("saved_address", formData.address);
        // }

        if (formData.image) {
            formDataToSend.append("image", formData.image); // Append the image file
        }

        if (isLogin) {
           
            const loginData = { mobilenumber: formData.mobileNumber, password: formData.password };
            const response = await axios.post("https://api.atoutfashion.com/api/customers/login", loginData);

            alert(response.data.message);

         
            localStorage.setItem("user", JSON.stringify(response.data.user));


            navigate("/");
            setTimeout(() => {
                window.location.reload();
              }, 100);
        } else {
           
            const response = await axios.post("https://api.atoutfashion.com/api/customers/register", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" } 
            });

            setSuccessMessage(response.data.message);

     
            localStorage.setItem("user", JSON.stringify(response.data.user));

         
            setFormData({ name: "", email: "", mobileNumber: "",  password: "", image: null });

            const userId = response.data.user.id;

         

            
            setIsLogin(true);

           
            navigate("/");
            setTimeout(() => {
                window.location.reload();
              }, 100);
        }
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        if (error.response && error.response.data) {
            setErrors({ server: error.response.data.message });
        }
    }
};


  return (
    <div className="container d-flex justify-content-center align-items-center vh-100" style={{fontFamily:"'Poppins', sans-serif"}}>
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
              <div className="mb-3 position-relative">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-group">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-control" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                  />
                  <span className="input-group-text" onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
              </div>
              <button type="submit" className="btn  w-100" style={{backgroundColor:'#c88256'}}>Login</button>
            </form>
            <div className="mt-3">
              <p>Not registered? <span onClick={handleToggle} style={{ color: "#8b5635", cursor: "pointer", fontWeight:'bold' }}>Create an account</span></p>
            </div>
          </>
          ) : (
            <div style={{ marginTop: '' }}>
              <h2 style={{textAlign:'start', fontSize:'20px'}}>Register</h2>
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
  {/* <div className="mb-3">
    <label htmlFor="address" className="form-label">Address</label>
    <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} />
    {errors.address && <p style={{ color: "red" }}>{errors.address}</p>}
  </div> */}
  <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="form-control" 
                      name="password" 
                      value={formData.password} 
                      onChange={handleChange} 
                    />
                    <span className="input-group-text" onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
                </div>
  <button type="submit" className="btn btn-success w-100" style={{backgroundColor:''}}>Register</button>
</form>

              <div className="mt-3">
                <p>Already have an account? <span onClick={handleToggle} style={{ color: "#8b5635", cursor: "pointer" , fontWeight:'bold'}}>Login</span></p>
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
