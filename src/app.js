const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send("User added succesfully");
  } catch (error) {
    res.status(400).send("Error saving user" + error.message);
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

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    await User.findOneAndUpdate({ _id: userId }, data);
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
