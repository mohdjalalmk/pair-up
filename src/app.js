const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./helpers/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

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
      const token = jwt.sign({ _id: user._id }, "$pair-$up-$token-$dev",{expiresIn:'1d'}); // secret for creating token

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

app.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(400).send("Error fetching user:" + error.message);
  }
});

// Delete user

// app.delete("/user", async (req, res) => {
//   const userId = req.body.userId;
//   try {
//     await User.findOneAndDelete({ _id: userId });
//     res.send("User deleted successfully ");
//   } catch (error) {
//     res.status(400).send("Something went wrong" + error.message);
//   }
// });

// app.patch("/user/:userId", async (req, res) => {
//   const userId = req.params.userId;
//   const data = req.body;

//   try {
//     //  check validation
//     const NOT_ALLOWED_FIELEDS = ["email"];
//     const keys = Object.keys(data);
//     const isUpdatedRestricted = keys.some((k) =>
//       NOT_ALLOWED_FIELEDS.includes(k)
//     );
//     if (isUpdatedRestricted) {
//       return res
//         .status(400)
//         .send("Update not allowed for restricted fields like email");
//     }
//     // updating
//     await User.findOneAndUpdate({ _id: userId }, data, { runValidators: true });
//     res.send("User details successfully updated");
//   } catch (error) {
//     res.status(400).send("Something went wrong" + error.message);
//   }
// });

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
