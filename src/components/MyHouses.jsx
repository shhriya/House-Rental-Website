import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/MyHouses.css";

function MyHouses() {
  const [houses, setHouses] = useState([]);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [houseName, setHouseName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const sellerEmail = localStorage.getItem("sellerEmail");

  const navigate = useNavigate();

  const fetchHouses = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/houses/${sellerEmail}`
      );
      setHouses(response.data);
    } catch (err) {
      console.error("Error fetching houses:", err.message);
      setError("An error occurred while fetching houses.");
    }
  }, [sellerEmail]);

  useEffect(() => {
    fetchHouses();
  }, [fetchHouses]);

  const deleteHouse = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/house/${id}`);
      alert("House deleted successfully");
      fetchHouses(); // Fetch the houses again to refresh the list
    } catch (err) {
      console.error("Error deleting house:", err.message);
      setError("An error occurred while deleting the house.");
    }
  };

  const updateHouse = async (id) => {
    const formData = new FormData();
    formData.append("houseName", houseName);
    formData.append("location", location);
    formData.append("price", price);
    if (image) formData.append("image", image);

    try {
      await axios.put(`http://localhost:5000/house/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("House updated successfully");
      setIsEditing(null); // Exit editing mode
      fetchHouses(); // Fetch the houses again to refresh the list
    } catch (err) {
      console.error("Error updating house:", err.message);
      setError("An error occurred while updating the house.");
    }
  };

  return (
    <div class="houseContainer">
      <div className="container">
        <h2>My Houses</h2>
        {houses.length > 0 ? (
          <ul className="house-list">
            {houses.map((house) => (
              <li className="house-item" key={house._id}>
                {isEditing === house._id ? (
                  <div className="edit-mode">
                    <h3>Edit House</h3>
                    <input
                      type="text"
                      defaultValue={house.houseName}
                      onChange={(e) => setHouseName(e.target.value)}
                    />
                    <input
                      type="text"
                      defaultValue={house.location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                    <input
                      type="number"
                      defaultValue={house.price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                    <input
                      type="file"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                    <button onClick={() => updateHouse(house._id)}>
                      Save Changes
                    </button>
                    <button onClick={() => setIsEditing(null)}>Cancel</button>
                  </div>
                ) : (
                  <div>
                    <h3>{house.houseName}</h3>
                    <p>Location: {house.location}</p>
                    <p>Price: ${house.price}</p>
                    {house.image && (
                      <img
                        src={`http://localhost:5000/uploads/${house.image}`}
                        alt={house.houseName}
                        width="200"
                      />
                    )}
                    <button
                      className="editButton"
                      onClick={() => setIsEditing(house._id)}
                    >
                      Update
                    </button>
                    <button
                      className="deleteButton"
                      onClick={() => deleteHouse(house._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No houses found.</p>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
      <button className="goBack" onClick={() => navigate("/seller-main")}>
        Go Back
      </button>
    </div>
  );
}

export default MyHouses;
