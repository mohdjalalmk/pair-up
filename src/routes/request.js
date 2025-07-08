const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const router = express.Router();

router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const allowedStatus = ["interested", "ignored"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status type " + status });
    }
    const isUserExist = await User.findById(toUserId);
    if (!isUserExist) {
      throw new Error("User doesn't exist");
    }
    const existConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existConnectionRequest) {
      throw new Error("Connection request already exist");
    }
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    const data = await connectionRequest.save();
    res.json({
      message:
        status === "interested"
          ? `Connection request successfully made`
          : `Rejection request successfully made`,
      data,
    });
  } catch (error) {
    res.send("Error: " + error.message);
  }
});

router.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const status = req.params.status;
      const requestId = req.params.requestId;
      const ALLOWED_STATUS = ["accepted", "rejected"];
      if (!ALLOWED_STATUS.includes(status)) {
        return res.status(400).json({ message: status + "is it allowed" });
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: user._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection request not found" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "Connection request is " + status, data });
    } catch (error) {
      res.status(400).send("Error " + error.message);
    }
  }
);

module.exports = router;
