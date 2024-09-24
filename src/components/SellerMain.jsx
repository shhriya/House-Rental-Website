import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Seller.css";

function SellerMain() {
  const [houseName, setHouseName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const sellerEmail = localStorage.getItem("sellerEmail");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("houseName", houseName);
    formData.append("location", location);
    formData.append("price", price);
    formData.append("email", sellerEmail);
    if (image) formData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:5000/add-house",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setError("");
      alert(response.data.message);
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred while adding the house."
      );
    }
  };

  return (
    <div className="sellerDiv">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <h2>Add House Details</h2>
          <div>
            <label>House Name:</label>
            <input
              type="text"
              value={houseName}
              onChange={(e) => setHouseName(e.target.value)}
            />
          </div>
          <div>
            <label>Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div>
            <label>Image:</label>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Add House</button>
        </form>
      </div>
      <button onClick={() => navigate("/my-houses")}>View My Houses</button>
    </div>
  );
}

export default SellerMain;
