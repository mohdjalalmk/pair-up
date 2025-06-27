const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../models/blacklistedToken");

const USER_DETAILS = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "description",
  "photoUrl",
];
const router = express.Router();

router.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: user._id,
      status: "interested",
    }).populate("fromUserId", USER_DETAILS);
    if (!connectionRequests.length) {
      return res.status(400).json({ message: "No connection requests found" });
    }
    res.json({ data: connectionRequests });
  } catch (error) {
    res.status(400).json({ message: "Error " + error.message });
  }
});

router.get("/user/requests/accepted", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectedRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      status: "accepted",
    })
      .populate("fromUserId", USER_DETAILS)
      .populate("toUserId", USER_DETAILS);
    if (!connectedRequest.length) {
      return res.status(400).json({ message: "No connected request found" });
    }
    const data = connectedRequest.map((user) => {
      const otherUser = user.toUserId._id.equals(loggedInUser._id)
        ? user.fromUserId
        : user.toUserId;
      return {
        _id: otherUser._id,
        firstName: otherUser.firstName,
        lastName: otherUser.lastName,
        age: otherUser.age,
        gender: otherUser.gender,
        description: otherUser.description,
      };
    });
    res.json({
      message: "Data fetched succesfully",
      data,
    });
  } catch (error) {
    return res.status(400).json({ message: "Error " + error.message });
  }
});

router.get("/user/feed", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const page = req.query.page || 1;
    // set restriction on limit
    const limit = req.query.limit > 25 ? 25 : req.query.limit || 10;
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: user._id }, { toUserId: user._id }],
    });

    const hideUsers = new Set();
    connectionRequest.map((connectedUser) => {
      hideUsers.add(connectedUser.fromUserId);
      hideUsers.add(connectedUser.toUserId);
    });
    const feedUsers = await User.find({
      _id: { $nin: Array.from(hideUsers) },
    })
      .select(USER_DETAILS)
      .skip(skip)
      .limit(limit);
    res.json({ message: "Feed data successfully fetched", data: feedUsers });
  } catch (error) {
    res.status(400).json({ error: "Error: " + error.message });
  }
});

router.delete("/user/delete", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    const decoded = jwt.verify(token, "$pair-$up-$token-$dev");
    const expiryDate = new Date(decoded.exp * 1000);

    await BlacklistedToken.create({ token, expiresAt: expiryDate });
    await User.findByIdAndDelete(user._id);
    res.json({ message: "User account deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error: " + error.message });
  }
});

module.exports = { router };
