const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    age: {
      type: Number,
      min: [18, "Age must be at least 18"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      // match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
      validate: [validator.isStrongPassword, "Not a strong password"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: "Gender must be male, female, or others",
      },
    },
    photoUrl: {
      type: String,
      validate: [validator.isURL, "Invalid photo url"],
    },
    description: {
      type: String,
      default: "Whatsapp devs!",
    },
    skills: {
      type: [String],
      validate: {
        validator: function (value) {
          return value.length <= 10;
        },
        message: "You can add a maximum of 10 skills only",
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const userId = this._id;
  const token = await jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.isValidPassword = async function (passwordFromUser) {
  const passwordHash = this.password;
  const isPasswordValid = await bcrypt.compare(passwordFromUser, passwordHash);
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
