const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../helpers/validation");
const validator = require("validator");

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
    res.send("User added succesfully");
  } catch (error) {
    res.status(400).send("Error saving user: " + error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Invalid credentials!");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials!");
    }
    const isPasswordValid = await user.isValidPassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token);
      res.send("Login successfull");
    } else {
      res.status(400).send("Invalid credentials!");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/logout", async (req, res) => {
    try {
      // Clear the cookie named 'token'
      res.clearCookie("token");
      res.send("Logged out successfully");
    } catch (error) {
      res.status(500).send("Something went wrong during logout");
    }
  });
  

module.exports = { router };
