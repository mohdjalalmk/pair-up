const validator = require("validator")

 const validateSignUpData = (req) => {
  const { firstName, password, email } = req.body;
  if (!firstName || firstName.length < 3) {
    throw new Error("Invalid First Name");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }else if (!validator.isStrongPassword(password)){
    throw new Error("Please enter a secure password")
  }
};

module.exports = {validateSignUpData}
