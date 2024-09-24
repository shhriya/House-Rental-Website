import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Buyer.css";

function BuyerMain() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchHouses = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("http://localhost:5000/houses");
      setHouses(response.data);
    } catch (err) {
      console.error("Error fetching houses:", err);
      setError("Error fetching houses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredHouses = houses.filter((house) =>
    house.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <h2>Available Houses</h2>

      <button onClick={fetchHouses}>
        {loading ? "Loading..." : "Fetch Houses"}
      </button>
      <input
        type="text"
        placeholder="Search by location"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {error && <p>{error}</p>}

      <ul className="house-list">
        {filteredHouses.length > 0 ? (
          filteredHouses.map((house) => (
            <li className="house-item" key={house._id}>
              <h3>{house.houseName}</h3>
              <p>Location: {house.location}</p>
              <p>Price: ${house.price}</p>
              <img
                src={`http://localhost:5000/uploads/${house.image}`}
                alt={house.houseName}
                width="200"
              />
              <button
                onClick={() => navigate(`/seller-details/${house.email}`)}
              >
                I'm interested
              </button>
            </li>
          ))
        ) : (
          <p>No houses found for the searched location</p>
        )}
      </ul>
    </div>
  );
}

export default BuyerMain;
