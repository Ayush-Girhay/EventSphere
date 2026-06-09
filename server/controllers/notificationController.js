const Notification = require("../models/Notification");

exports.getNotifications = async (
  req,
  res
) => {
  try {
    const notifications =
      await Notification.find({
        user: req.user.id,
      }).sort({
        createdAt: -1,
      });

    res.json(notifications);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Failed to fetch notifications",
    });
  }
};

exports.getUnreadCount = async (
  req,
  res
) => {
  try {
    const count =
      await Notification.countDocuments({
        user: req.user.id,
        isRead: false,
      });

    res.json({ count });
  } catch (error) {
    res.status(500).json({
      message: "Failed",
    });
  }
};

exports.markAllRead = async (
  req,
  res
) => {
  try {
    await Notification.updateMany(
      {
        user: req.user.id,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed",
    });
  }
};