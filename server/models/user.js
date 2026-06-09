const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
  type: String,
  required: true,
  unique: true,
},

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

   resetOTP: {
  type: String,
},

resetOTPExpires: {
  type: Date,
},

    role: {
      type: String,
      enum: [
              "Admin",
              "Event Coordinator",
              "Photographer",
              "Club Member",
              "Viewer",
            ],
      default: "Viewer",
    },

    profilePicture: {
      type: String,
      default: "",
    },

    
    registeredEvents: [
  {
    type:
      mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
],
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model(
  "User",
  userSchema
);