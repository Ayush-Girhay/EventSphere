import { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow }
from "date-fns";

function Notifications() {
  const [notifications, setNotifications] =
    useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
  fetchNotifications();

  axios.put(
    "http://localhost:5000/api/notifications/read",
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          "token"
        )}`,
      },
    }
  );
}, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      setNotifications(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  

  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold">
        🔔 Notifications
      </h1>

      {notifications.map((n) => (
  <div
    key={n._id}
    className="bg-slate-800 p-4 rounded-xl"
  >
    <p>{n.message}</p>

    <p className="text-sm text-slate-400 mt-1">
      {formatDistanceToNow(
        new Date(n.createdAt),
        { addSuffix: true }
      )}
    </p>
  </div>
))}
    </div>
  );
}

export default Notifications;