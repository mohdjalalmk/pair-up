const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const http = require("http");
const app = express();
app.use(express.json());
app.use(cookieParser());
require("../src/utils/cronjobs");
const { initializeSocket } = require("./utils/socket");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    // console.log("Connected to the pairup cluster");
    server.listen(process.env.PORT, () => {
      // console.log("server is running");
    });
  })
  .catch((err) => {
    // console.log("Error connecting to database:" + err.message);
  });
