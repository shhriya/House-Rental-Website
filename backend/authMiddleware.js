const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) return res.status(401).json("No token, authorization denied");

  try {
    const decoded = jwt.verify(token, "your_jwt_secret"); // Replace with your actual secret
    req.user = decoded.user; // Assuming the token contains a user object
    next();
  } catch (err) {
    res.status(401).json("Token is not valid");
  }
};

module.exports = authMiddleware;
