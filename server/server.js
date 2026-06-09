require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const eventRoutes = require("./routes/eventRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const statsRoutes = require("./routes/statsRoutes");

const notificationRoutes =
require("./routes/notificationRoutes");

const startReminderService =
  require(
    "./services/reminderService"
  );


const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

app.use("/api/stats", statsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.use(
  "/api/notifications",
  notificationRoutes
);


app.get("/", (req, res) => {
  res.send(
    "EventSphere Backend Running"
  );
});

app.get("/test-upload", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "uploads",
      "1780616497129-_cristiano_ronaldo.jpg"
    )
  );
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    startReminderService();

    const server =
      http.createServer(app);

   const io = new Server(server, {
  cors: {
    origin:
      process.env.CLIENT_URL || "*",
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
    ],
  },
});

    global.io = io;

    io.on(
      "connection",
      (socket) => {
        console.log(
          "Socket Connected:",
          socket.id
        );

        socket.on(
          "disconnect",
          () => {
            console.log(
              "Socket Disconnected:",
              socket.id
            );
          }
        );
      }
    );

    server.listen(PORT, () => {
      console.log(
        `Server running on ${PORT}`
      );

      console.log(
        "__dirname =",
        __dirname
      );
    });
  } catch (error) {
    console.log(
      "Failed to start server"
    );
    console.log(error);
  }
};

startServer();