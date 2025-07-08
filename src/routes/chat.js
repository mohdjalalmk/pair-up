const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Chat = require("../models/chat");
const router = express.Router();
const ConnectionRequest = require("../models/connectionRequest");

router.get("/chat/:targetUserId", userAuth, async (req, res) => {
  let userId = req.user;
  let targetUserId = req.params.targetUserId;

  try {
    const connectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: fromUserId, toUserId: toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
      status: "accepted",
    });

    if (!connectionRequest) {
      res.status(400).json({ message: "Connection request not exist" });
    }
    const chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    });
    if (!chat) {
      return res.json({
        message: [],
      });
    }
    res.json(chat);
  } catch (error) {
    res.status(400).send("Error finding chat: " + error.message);
  }
});

module.exports = router;
