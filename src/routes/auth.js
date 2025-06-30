const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../helpers/validation");
const validator = require("validator");
const BlacklistedToken = require("../models/blacklistedToken");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/auth");
const { sendEmail } = require("../utils/sendEmail");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const {
      firstName,
      lastName,
      email,
      password,
      skills,
      age,
      gender,
      description,
      photoUrl,
    } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      age,
      gender,
      skills,
      photoUrl,
      description,
    });

    await user.save();

    const token = await user.getJWT();

    const userObj = user.toObject();
    delete userObj.password;
    await sendEmail(
      email,
      "Welcome to Pair UP",
      `Hi ${
        firstName + " " + lastName
      },\n\nThanks for joining Pair UP! We're thrilled to have you.\nStart exploring and connecting now.\n\nCheers,\nTeam Pair UP`
    );
    res.status(201).json({
      message: "Signup successful",
      token,
      user: userObj,
    });
  } catch (error) {
    res.status(400).send("Error saving user: " + error.message);
  }
});

router.post("/login", async (req, res) => {
  console.log("hitting");

  try {
    const email = req.body.email.toLowerCase().trim();
    const password = req.body.password;
    console.log("email", email, password);

    if (!validator.isEmail(email)) {
      throw new Error("Invalid credentials!");
    }

    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
      throw new Error("Invalid credentials!");
    }

    const isPasswordValid = await user.isValidPassword(password);
    console.log(isPasswordValid);

    if (isPasswordValid) {
      const token = await user.getJWT();
      console.log("response successful");

      const userObj = user.toObject();
      delete userObj.password;

      res.status(200).json({
        message: "Login successful",
        token,
        user: userObj,
      });
    } else {
      res.status(400).json({ error: "Invalid credentials!" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

router.post("/logout", userAuth, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const expiryDate = new Date(decoded.exp * 1000);

    await BlacklistedToken.create({ token, expiresAt: expiryDate });

    res.status(200).json({ message: "Logged out and token invalidated." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Logout failed" });
  }
});

module.exports = { router };
