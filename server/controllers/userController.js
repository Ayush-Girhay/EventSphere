const User = require("../models/User");
const Event = require("../models/Event");
const Media = require("../models/Media");

exports.getProfile = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user.id
      ).select("-password");

    const totalUploads =
      await Media.countDocuments({
        uploadedBy: req.user.id,
      });

    const totalRegistrations =
      await Event.countDocuments({
        registeredUsers:
          req.user.id,
      });

    res.json({
      success: true,
      user,
      totalUploads,
      totalRegistrations,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch profile",
    });
  }
};

exports.getRegisteredEvents =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user.id
        ).populate(
          "registeredEvents"
        );

      res.json({
        success: true,
        events:
          user.registeredEvents,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch registrations",
      });
    }
  };

  const cloudinary =
  require("../config/cloudinary");

exports.uploadProfilePhoto =
  async (req, res) => {
    try {
      const file =
        req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message:
            "No image selected",
        });
      }

      const result =
        await cloudinary.uploader.upload(
          file.path,
          {
            folder:
              "eventsphere/profile",
          }
        );

      const user =
        await User.findByIdAndUpdate(
          req.user.id,
          {
            profilePicture:
              result.secure_url,
          },
          {
            new: true,
          }
        );

      res.json({
        success: true,
        user,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
      });
    }
  };