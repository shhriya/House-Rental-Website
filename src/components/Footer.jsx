import React from "react";

function Footer() {
  return (
    <div className="footer" style={footerStyle}>
      <footer>&copy; 2024 MY Rental Website - All rights reserved</footer>
    </div>
  );
}

const footerStyle = {
  fontSize: "16px",
  color: "white",
  textAlign: "center",
  padding: "10px 0",
  backgroundColor: "#00308F",
  borderTop: "2px solid white",
  position: "fixed",
  bottom: 0,
  width: "100%",
};

export default Footer;
