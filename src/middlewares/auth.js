const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BlacklistedToken = require("../models/blacklistedToken");

const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ error: "Token is blacklisted" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    delete user.password;

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Invalid or expired token");
  }
};

module.exports = { userAuth };
