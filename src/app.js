const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());
const { router: authRouter } = require("./routes/auth");
const { router: profileRouter } = require("./routes/profile");
const { router: requestRouter } = require("./routes/request");
const { router: userRouter } = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
