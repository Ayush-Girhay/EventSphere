const User = require("../models/User");
const Event = require("../models/Event");
const Media = require("../models/Media");

exports.getStats = async (req, res) => {
  try {
    const totalUsers =
      await User.countDocuments();

    const totalEvents =
      await Event.countDocuments();

    const totalUploads =
      await Media.countDocuments();

    const publicUploads =
      await Media.countDocuments({
        visibility: "public",
      });

    const privateUploads =
      await Media.countDocuments({
        visibility: "private",
      });

    const mostLikedImage =
        await Media.findOne().sort({
            likes: -1,
        });

        const mostFavoritedImage =
        await Media.findOne().sort({
            favorites: -1,
        });

    const events =
  await Event.find();

let totalRegistrations = 0;

let topEvent = null;

const today =
  new Date();

events.forEach((event) => {

  const registrations =
    event.registeredUsers?.length || 0;

  totalRegistrations +=
    registrations;

  const eventDate =
    new Date(event.date);

  const oneDayAfter =
    new Date(eventDate);

  oneDayAfter.setDate(
    oneDayAfter.getDate() + 1
  );

  if (today > oneDayAfter) {
    return;
  }

  const topRegistrations =
    topEvent
      ? topEvent.registeredUsers?.length || 0
      : 0;

  if (
    !topEvent ||
    registrations > topRegistrations
  ) {
    topEvent = event;
  }
});

    res.json({
      totalUsers,
      totalEvents,
      totalUploads,
      publicUploads,
      privateUploads,
      totalRegistrations,

      mostLikedImage:
       mostLikedImage
  ? {
      filename:
        mostLikedImage.filename,
      likes:
        mostLikedImage.likes,
      url:
        mostLikedImage.url,
    }
  : null,

  mostFavoritedImage:
  mostFavoritedImage
    ? {
        filename:
          mostFavoritedImage.filename,
        favorites:
          mostFavoritedImage.favorites,
        url:
          mostFavoritedImage.url,
      }
    : null,

      topEvent: topEvent
  ? {
      title: topEvent.title,
      registrations:
  topEvent.registeredUsers?.length || 0,
      poster: topEvent.poster,
      date: topEvent.date,
    }
  : null,

  
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Failed to fetch stats",
    });
  }
};