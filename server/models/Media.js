const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
   title: String,

caption: String,

tags: [String],

filename: String,

    url: String,

public_id: String,

    visibility: {
      type: String,
      default: "public",
    },

    uploadedBy: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    likes: {
      type: Number,
      default: 0,
    },

    favorites: {
      type: Number,
      default: 0,
    },

    likedBy: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    ],

    favoritedBy: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],

taggedUsers: [
  {
    type:
      mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],


    comments: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Media",
  mediaSchema
);