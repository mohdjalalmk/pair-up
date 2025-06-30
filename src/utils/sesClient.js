// sesClient.js
const { SESClient } = require("@aws-sdk/client-ses");

const sesClient = new SESClient({
  region: "ap-south-1", // Replace with your SES region
  credentials: {
    accessKeyId: "AKIAQJHF2UUNEGTJP6GU",
    secretAccessKey: "lcSZYxWB1dIXLJU77rHW5Z7IflPhf+Klgp7Y3GDx",
  },
});

module.exports = sesClient;
