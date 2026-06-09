import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import axios from "axios";

function ScanQR() {
  const [result, setResult] =
    useState(null);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">
        🎫 Scan Event Ticket
      </h1>

      <div className="max-w-md">
        <Scanner
          onScan={async (result) => {
            if (
              result &&
              result.length > 0
            ) {
              try {
                const data =
  JSON.parse(
    result[0].rawValue
  );

setResult(data);

await axios.post(
  "https://eventsphere-mkp6.onrender.com/api/events/attendance",
  {
    eventId:
      data.eventId,
    userId:
      data.userId,
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem(
        "token"
      )}`,
    },
  }
);

alert(
  "Attendance Marked ✅"
);
              } catch {
                alert(
                  "Invalid QR Code"
                );
              }
            }
          }}
        />
      </div>

      {result && (
        <div className="bg-green-700 p-6 rounded-xl">
          <h2 className="text-2xl font-bold">
            ✅ Valid Ticket
          </h2>

          <p className="mt-3">
            Event:
            {" "}
            {result.event}
          </p>

          <p>
            Event ID:
            {" "}
            {result.eventId}
          </p>
        </div>
      )}
    </div>
  );
}

export default ScanQR;