const cron = require("node-cron");
const { startOfDay, endOfDay } = require("date-fns");
const User = require("../models/user");
const { sendEmail } = require("./sendEmail");

cron.schedule(
  "29  20 * * *",
  async () => {
    const today = new Date();
    const start = startOfDay(today);
    const end = endOfDay(today);
    const newUsers = await User.find({
      createdAt: {
        $gte: start,
        $lt: end,
      },
    });

    for (const user of newUsers) {
      try {
        const resp = await sendEmail(
          user.email,
          "Welcome to Pair UP",
          `Hi ${
            user.firstName + " " + user.lastName
          },\n\n Explore pair up by sending interest requests`
        );
      } catch (error) {
      }
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);
