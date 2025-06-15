const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, password, email } = req.body;
  if (!firstName || firstName.length < 3) {
    throw new Error("Invalid First Name");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a secure password");
  }
};

const validateEditProfileData = (req) => {
  const ALLOWED_EDIT_FIELDS = [
    "age",
    "gender",
    "description",
    "skills",
    "firstName",
    "lastName",
    "photoUrl"
  ];

  const isEditAllowed = Object.keys(req.body).every((key) =>
    ALLOWED_EDIT_FIELDS.includes(key)
  );
  console.log("edit allowed",isEditAllowed);
  
  if (!isEditAllowed) {
    throw new Error("Edit restricted for some fields");
  }
  const { firstName, photoUrl } = req.body;
  if (firstName && firstName.length < 3) {
    console.log("jete");
    
    throw new Error("Invalid First Name");
  } else if (photoUrl && !validator.isURL(photoUrl)) {
    console.log("heer");
    
    throw new Error("Invalid photo URL");
  }
};

module.exports = { validateSignUpData, validateEditProfileData };
