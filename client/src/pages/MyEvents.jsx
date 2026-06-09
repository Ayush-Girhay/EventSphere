import {
  useEffect,
  useState,
} from "react";

import axios from "axios";
import html2canvas from "html2canvas";

import {
  QRCodeCanvas,
} from "qrcode.react";

function MyEvents() {
  const [events, setEvents] =
    useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const downloadQR = async (
  eventId,
  eventTitle
) => {
  const qr =
    document.getElementById(
      `qr-${eventId}`
    );

  const canvas =
    await html2canvas(qr);

  const link =
    document.createElement("a");

  link.download =
    `${eventTitle}-QR.png`;

  link.href =
    canvas.toDataURL();

  link.click();
};

  const fetchEvents =
    async () => {
      const res =
        await axios.get(
          "http://localhost:5000/api/users/registrations",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "token"
              )}`,
            },
          }
        );

      setEvents(
        res.data.events
      );
    };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">
        🎫 My Registered Events
      </h1>

      {events.map((event) => {

  const isCompleted =
    new Date() >
    new Date(event.date);

  return (
        <div
          key={event._id}
          className="bg-slate-800 p-6 rounded-xl"
        >
          <h2 className="text-2xl font-bold">
            {event.title}
          </h2>

          <p>
            📍 {event.location}
          </p>

          <p>
            📅 {event.date}
          </p>

          {!isCompleted ? (
  <>
    <div
      id={`qr-${event._id}`}
      className="mt-4 bg-white inline-block p-4 rounded"
    >
      <QRCodeCanvas
        value={JSON.stringify({
          eventId: event._id,
          userId:
            localStorage.getItem(
              "userId"
            ),
          event: event.title,
        })}
        size={180}
      />
    </div>

    <button
      className="mt-4 ml-4 bg-cyan-600 px-4 py-2 rounded"
      onClick={() =>
        downloadQR(
          event._id,
          event.title
        )
      }
    >
      Download QR
    </button>
  </>
) : (
  <div className="mt-4">
    <p className="text-green-400 font-bold text-lg">
      ✅ Event Completed
    </p>
    <p className="text-slate-400">
      QR code is no longer available.
    </p>
  </div>
)}

        </div>
      );
})}
    </div>
  );
}

export default MyEvents;