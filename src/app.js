const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const userObject = {
    firstName: "Lamiya",
    lastName: "Kannoth",
    email: "lamiya@gmail.com",
    password: "lamiya@123",
  };

  try {
    const user = new User(userObject);

    await user.save();
    res.send("User added succesfully");
  } catch (error) {
    res.status(400).send("Error saving user", error.message);
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
    console.log("Error connecting to database:", err.message);
  });
