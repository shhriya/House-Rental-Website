import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/SellerDetails.css";

function SellerDetails() {
  const { email } = useParams(); // email will be extracted from the URL
  const [sellerDetails, setSellerDetails] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/sellers?email=${email}`
        );
        setSellerDetails(response.data);
      } catch (err) {
        console.error("Error fetching seller details:", err);
        setError("Error fetching seller details. Please try again.");
      }
    };

    fetchSellerDetails();
  }, [email]);

  return (
    <div className="detailsContainer">
      <div className="seller-container">
        {error && <p>{error}</p>}

        {sellerDetails ? (
          <div>
            <h2>Seller Details</h2>
            <p>
              <strong>Name:</strong> {sellerDetails.seller.name}
            </p>
            <p>
              <strong>Email:</strong> {sellerDetails.seller.email}
            </p>

            <h3>Other Houses by this Seller:</h3>
            <ul className="house-list">
              {sellerDetails.houses.map((house) => (
                <li className="house-item" key={house._id}>
                  <h4>{house.houseName}</h4>
                  <p>Price: ${house.price}</p>
                  <img
                    src={`http://localhost:5000/uploads/${house.image}`}
                    alt={house.houseName}
                    width="200"
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Loading seller details...</p>
        )}
      </div>
      <button className="goBack" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  );
}

export default SellerDetails;
