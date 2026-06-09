import { io } from "socket.io-client";

const socket = io(
  "https://eventsphere-mkp6.onrender.com//"
);

export default socket;