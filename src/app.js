const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./helpers/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    //Validating the body

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

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Invalid credentials!");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials!");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // Create a token
      const token = jwt.sign({ _id: user._id }, "$pair-$up-$token-$dev"); // secret for creating token

      // Add the token to cookie

      // send the cookie/response to user
      res.cookie("token", token);
      res.send("Login successfull");
    } else {
      res.status(400).send("Invalid credentials!");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(400).send("Invalid token");
    }
    const decoded = await jwt.verify(token, "$pair-$up-$token-$dev");
    const { _id } = decoded;
    const user = await User.findById(_id);
    if (!user) {
      res.status(400).send("No user found");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("Error fetching user:" + error.message);
  }
});

// GET an user from db

app.get("/user", async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong" + error.message);
  }
});

// GET All user

app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    if (!user.length) {
      res.status(404).send("No users");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong" + error.message);
  }
});

// Delete user

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findOneAndDelete({ _id: userId });
    res.send("User deleted successfully ");
  } catch (error) {
    res.status(400).send("Something went wrong" + error.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;

  try {
    //  check validation
    const NOT_ALLOWED_FIELEDS = ["email"];
    const keys = Object.keys(data);
    const isUpdatedRestricted = keys.some((k) =>
      NOT_ALLOWED_FIELEDS.includes(k)
    );
    if (isUpdatedRestricted) {
      return res
        .status(400)
        .send("Update not allowed for restricted fields like email");
    }
    // updating
    await User.findOneAndUpdate({ _id: userId }, data, { runValidators: true });
    res.send("User details successfully updated");
  } catch (error) {
    res.status(400).send("Something went wrong" + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Connected to the pairup cluster");
    app.listen(3000, () => {
      console.log("server is running");
    });
  })
  .catch((err) => {
    console.log("Error connecting to database:" + err.message);
  });
