const Event = require("../models/Event");
const cloudinary = require("../config/cloudinary");
const User = require("../models/User");
const transporter =
  require("../config/mailer");

// Create Event
exports.createEvent = async (
  req,
  res
) => {
  try {
    const {
      title,
      location,
      date,
      capacity,
    } = req.body;

    let posterUrl = "";

    if (req.file) {
      const result =
        await cloudinary.uploader.upload(
          req.file.path,
          {
            folder:
              "eventsphere/events",
          }
        );

      posterUrl =
        result.secure_url;
    }

    const event =
      await Event.create({
        title,
        location,
        date,
        capacity,
        poster: posterUrl,
      });

    res.status(201).json({
      success: true,
      event,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to create event",
    });
  }
};

// Get All Events
exports.getEvents = async (
  req,
  res
) => {
  try {
    const events =
      await Event.find();

    res.json({
      success: true,
      events,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch events",
    });
  }
};

// Register For Event
exports.registerEvent = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const userId =
      req.user.id;

    const event =
      await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message:
          "Event not found",
      });
    }

    const today =
  new Date();

today.setHours(
  0,
  0,
  0,
  0
);

const eventDate =
  new Date(event.date);

eventDate.setHours(
  0,
  0,
  0,
  0
);

if (eventDate < today) {
  return res.status(400).json({
    success: false,
    message:
      "Registration closed",
  });
}

    if (
      event
        .registeredUsers
        .length >=
      event.capacity
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Registration Full",
      });
    }

    const alreadyRegistered =
      event.registeredUsers.some(
        (user) =>
          user.toString() ===
          userId
      );

    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message:
          "You have already registered",
      });
    }

    event.registeredUsers.push(
      userId
    );

    event.registrations =
      event.registeredUsers.length;

    await event.save();

    const user =
      await User.findById(
        userId
      );

    if (
      !user.registeredEvents.some(
        (e) =>
          e.toString() ===
          event._id.toString()
      )
    ) {
      user.registeredEvents.push(
        event._id
      );

      await user.save();

      await transporter.sendMail({
  from:
    process.env.EMAIL_USER,

  to: user.email,

  subject:
    "Event Registration Confirmed",

  html: `
    <h2>
      Registration Successful
    </h2>

    <p>
      Hello ${user.name},
    </p>

    <p>
      You have successfully
      registered for:
    </p>

    <h3>
      ${event.title}
    </h3>

    <p>
      Location:
      ${event.location}
    </p>

    <p>
      Date:
      ${event.date}
    </p>

    <p>
      Thank you for using
      EventSphere.
    </p>
  `,
});
    }

    if (global.io) {
      global.io.emit(
        "eventRegistered",
        {
          eventId:
            event._id,
          registrations:
            event
              .registeredUsers
              .length,
        }
      );
    }

    res.json({
      success: true,
      registrations:
        event.registrations,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Registration failed",
    });
  }
};

// Delete Event
exports.deleteEvent = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    const event =
      await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message:
          "Event not found",
      });
    }

    await Event.findByIdAndDelete(
      id
    );

    res.json({
      success: true,
      message:
        "Event deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Delete failed",
    });
  }
};

// Update Event
exports.updateEvent = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    const {
      title,
      location,
      date,
      capacity,
    } = req.body;

    const event =
      await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message:
          "Event not found",
      });
    }

    event.title =
      title;
    event.location =
      location;
    event.date =
      date;
    event.capacity =
      capacity;

    await event.save();

    res.json({
      success: true,
      event,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Update failed",
    });
  }
};

// Mark Attendance
exports.markAttendance =
  async (req, res) => {
    try {

      if (
        req.user.role !== "Admin" &&
        req.user.role !==
          "Event Coordinator"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Access denied",
        });
      }
      const {
        eventId,
        userId,
      } = req.body;

      const event =
        await Event.findById(
          eventId
        );

      if (!event) {
        return res.status(404).json({
          success: false,
          message:
            "Event not found",
        });
      }

      const alreadyMarked =
        event.attendees.some(
          (u) =>
            u.toString() ===
            userId
        );

      if (alreadyMarked) {
        return res.status(400).json({
          success: false,
          message:
            "Attendance already marked",
        });
      }

      event.attendees.push(
        userId
      );

      await event.save();

      res.json({
        success: true,
        attendees:
          event.attendees.length,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Attendance failed",
      });
    }
  };