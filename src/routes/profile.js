const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../helpers/validation");
const User = require("../models/user");
const { uploadImage } = require("../middlewares/upload");
const { v4: uuidv4 } = require("uuid");
const {
  s3,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("../utils/s3Client");

const router = express.Router();

const BUCKET_NAME = process.env.S3_PROFILE_BUCKET;

router.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user.toObject();
    user.isPremium =
      user.premiumExpiry && new Date(user.premiumExpiry) > new Date();

    res.status(200).json(user);
  } catch (error) {
    res.status(400).send("Error fetching user: " + error.message);
  }
});

router.patch(
  "/profile/edit",
  userAuth,
  uploadImage.single("photo"),
  async (req, res) => {
    const file = req.file;
    const user = req.user;
    try {
      validateEditProfileData(req);
      let photoUrl = "";
      if (file) {
        // delete existing photo
        if (user?.photoUrl) {
          const existingKey = user?.photoUrl.split(".amazonaws.com/")[1];
          if (existingKey) {
            const deleteCommand = new DeleteObjectCommand({
              Bucket: BUCKET_NAME,
              Key: existingKey,
            });

            await s3.send(deleteCommand);
          }
        }
        const newKey = `photo/${uuidv4()}-${file.originalname}`;

        const command = new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: newKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        });

        await s3.send(command);

        photoUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${newKey}`;
      }
      const updates = req.body;
      updates.photoUrl = photoUrl;
      await User.findOneAndUpdate({ _id: req.user._id }, updates, {
        runValidators: true,
      });

      res.json({ message: "Details updated successfully", data: updates });
    } catch (error) {
      res.status(400).send("Invalid edit request: " + error.message);
    }
  }
);

module.exports = router 
