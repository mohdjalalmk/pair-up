const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());
require("dotenv").config();

const { router: authRouter } = require("./routes/auth");
const { router: profileRouter } = require("./routes/profile");
const { router: requestRouter } = require("./routes/request");
const { router: userRouter } = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Connected to the pairup cluster");
    app.listen(process.env.PORT, () => {
      console.log("server is running");
    });
  })
  .catch((err) => {
    console.log("Error connecting to database:" + err.message);
  });
