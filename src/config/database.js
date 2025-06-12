const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://jalalmohammed1818:K2nG2xVMIRLojbkV@pairupcluster.sd3azci.mongodb.net/pairup"
  );
};

module.exports = connectDB;
