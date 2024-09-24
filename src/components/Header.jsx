import React from "react";

function Header() {
  return (
    <div className="header">
      <header style={head}>Welcome to the Rental System</header>
    </div>
  );
}

const head = {
  fontSize: "40px",
  fontWeight: 200,
  color: "white",
  textAlign: "center",
  padding: "20px 0",
  backgroundColor: "#00308F",
  borderBottom: "2px solid white",
};

export default Header;
