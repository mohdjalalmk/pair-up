const { SESClient } = require("@aws-sdk/client-ses");

const sesClient = new SESClient({
  region: "ap-south-1", 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_SES,
    secretAccessKey: process.env.AWS_SECRET_KEY_SES,
  },
});

module.exports = sesClient;
