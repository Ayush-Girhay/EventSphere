const mongoose = require("mongoose");

const eventSchema =
  new mongoose.Schema(
    {
      title: String,

      location: String,

      date: String,

      registrations: {
        type: Number,
        default: 0,
      },
      poster: {
        type: String,
        default: "",
        },

      registeredUsers: [
        {
          type:
            mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],

      attendees: [
        {
            type:
            mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        ],

        capacity: {
        type: Number,
        default: 50,
        },

    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "Event",
  eventSchema
);