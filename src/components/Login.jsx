import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import RentalMain from "./RentalMain";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      console.log("Login response:", response.data);
      if (response.data === "Invalid credentials") {
        setError("Invalid email or password. Please try again.");
      } else if (response.data.specification === "Seller") {
        localStorage.setItem("sellerEmail", email);
        navigate("/seller-main");
      } else if (response.data.specification === "Buyer") {
        navigate("/buyer-main");
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Error during login");
      setError("An error occurred during login. Please try again.");
    }
  };
  return (
    <div className="container">
      <RentalMain />
      <form className="formDiv" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account?{" "}
        <Link className="signlink" to="/register">
          Sign Up
        </Link>
      </p>
    </div>
  );
}

export default Login;
