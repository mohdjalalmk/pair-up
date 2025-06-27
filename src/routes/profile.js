const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../helpers/validation");
const User = require("../models/user");

const router = express.Router();

router.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(400).send("Error fetching user:" + error.message);
  }
});

router.patch("/profile/edit", userAuth, async (req, res) => {
  try {    
    validateEditProfileData(req);
    await User.findOneAndUpdate({ _id: req.user._id }, req.body, {
      runValidators: true,
    });

    res.json({ message: "Details updated successfully" });
  } catch (error) {
    res.status(400).send("Invalid edit request: " + error.message);
  }
});

module.exports = { router };
