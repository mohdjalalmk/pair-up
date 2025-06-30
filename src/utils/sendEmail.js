const sesClient = require("./sesClient");
const { SendEmailCommand } = require("@aws-sdk/client-ses");

// The verified "From" address stays constant
const FROM_EMAIL = "mohammedjalal1818@gmail.com";


async function sendEmail(toAddress, subject, body) {
  const params = {
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8",
      },
      Body: {
        Text: {
          Data: body,
          Charset: "UTF-8",
        },
      },
    },
    Source: FROM_EMAIL,
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log("✅ Email sent! Message ID:", response.MessageId);
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
}

module.exports = { sendEmail };
