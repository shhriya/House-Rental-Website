import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [fname, setFirstName] = useState("");
  const [lname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [specification, setSpecification] = useState("Buyer");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmpassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/register", {
        fname,
        lname,
        email,
        password,
        confirmpassword,
        specification,
      });

      console.log("Registration response:", response.data);

      if (response.data === "User already exists") {
        setError("User already exists. Please try another email.");
      } else {
        if (response.data.specification === "Seller") {
          navigate("/seller-main");
        } else if (response.data.specification === "Buyer") {
          navigate("/buyer-main");
        } else {
          setError("Unexpected response from server.");
        }
      }
    } catch (err) {
      console.error(
        "Error during registration:",
        err.response ? err.response.data : err.message
      );
      setError("An error occurred during registration. Please try again.");
    }
  };
  return (
    <form className="formDiv" onSubmit={handleSubmit}>
      <h2>Register</h2>
      <div>
        <label>First Name:</label>
        <input
          type="text"
          value={fname}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div>
        <label>Last Name:</label>
        <input
          type="text"
          value={lname}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmpassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <div>
        <label>Specification:</label>
        <select
          value={specification}
          onChange={(e) => setSpecification(e.target.value)}
        >
          <option value="Buyer">Buyer</option>
          <option value="Seller">Seller</option>
        </select>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
