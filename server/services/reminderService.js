const cron = require("node-cron");
const Event = require("../models/Event");
const User = require("../models/User");
const transporter =
  require("../config/mailer");

const startReminderService =
  () => {
    cron.schedule(
      "0 9 * * *",
      async () => {
        try {
          console.log(
            "Checking reminders..."
          );

          const tomorrow =
            new Date();

          tomorrow.setDate(
            tomorrow.getDate() +
              1
          );

          const targetDate =
            tomorrow
              .toISOString()
              .split("T")[0];

          const events =
            await Event.find({
              date:
                targetDate,
            }).populate(
              "registeredUsers"
            );

          for (const event of events) {
            for (const user of event.registeredUsers) {
              await transporter.sendMail(
                {
                  from:
                    process.env.EMAIL_USER,

                  to:
                    user.email,

                  subject:
                    "Event Reminder",

                  html: `
                  <h2>⏰ Event Reminder</h2>

                  <p>
                    Hello ${user.name},
                  </p>

                  <p>
                    Your event starts tomorrow.
                  </p>

                  <h3>
                    ${event.title}
                  </h3>

                  <p>
                    📍 ${event.location}
                  </p>

                  <p>
                    📅 ${event.date}
                  </p>

                  <p>
                    See you there!
                  </p>
                `,
                }
              );

              console.log(
                `Reminder sent to ${user.email}`
              );
            }
          }
        } catch (error) {
          console.log(
            "Reminder Error:",
            error
          );
        }
      }
    );
  };

module.exports =
  startReminderService;
