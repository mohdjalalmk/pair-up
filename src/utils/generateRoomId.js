const crypto = require("crypto");
const generateRoomId = (userA, userB) => {
  const sorted = [userA, userB].sort().join("-");
  return crypto.createHash("sha256").update(sorted).digest("hex");
};

module.exports = { generateRoomId };
