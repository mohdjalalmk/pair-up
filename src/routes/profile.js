const express = require("express");
const { userAuth } = require("../middlewares/auth");

const router = express.Router();

router.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(400).send("Error fetching user:" + error.message);
  }
});

module.exports = { router };
