import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";


function Dashboard() {
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [events, setEvents] = useState([]);
    const [editingId, setEditingId] =useState(null);
    const [message, setMessage] = useState("");
    const [poster, setPoster] = useState(null);
    const [capacity, setCapacity] =
  useState("");
  const [loading, setLoading] =
  useState(false);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalUploads: 0,
    publicUploads: 0,
    privateUploads: 0,
    totalRegistrations: 0,
    mostLikedImage: null,
    mostFavoritedImage: null,
    topEvent: null,
  });


  const role = localStorage.getItem("role");
  const getDaysLeft = (eventDate) => {
  const today = new Date();

  const target = new Date(eventDate);

  const diff =
    target.getTime() -
    today.getTime();

  return Math.ceil(
    diff / (1000 * 60 * 60 * 24)
  );
};

const getTimeRemaining = (
  eventDate
) => {
  const now = new Date();

  const target =
    new Date(eventDate);

  const diff =
    target.getTime() -
    now.getTime();

  if (diff <= 0) {
    return "Event Started";
  }

  const days = Math.floor(
    diff /
      (1000 * 60 * 60 * 24)
  );

  const hours = Math.floor(
    (diff %
      (1000 *
        60 *
        60 *
        24)) /
      (1000 * 60 * 60)
  );

  const minutes =
    Math.floor(
      (diff %
        (1000 *
          60 *
          60)) /
        (1000 * 60)
    );

  if (days > 0) {
    return `${days}d ${hours}h left`;
  }

  return `${hours}h ${minutes}m left`;
};

  const fetchEvents = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/events"
    );

    setEvents(res.data.events);
  };

  const fetchStats = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/stats"
    );

    setStats(res.data);
  };

useEffect(() => {
  fetchEvents();
  fetchStats();

  socket.on(
    "eventRegistered",
    () => {
      fetchEvents();
      fetchStats();
    }
  );

  const getDaysLeft = (date) => {
  const eventDate =
    new Date(date);

  const today =
    new Date();

  return Math.ceil(
    (eventDate - today) /
      (1000 * 60 * 60 * 24)
  );
};

  return () => {
    socket.off(
      "eventRegistered"
    );
  };
}, []);

  const createEvent = async () => {
  try {
    setLoading(true);

    const formData =
      new FormData();

    formData.append(
      "title",
      title
    );

    formData.append(
      "location",
      location
    );

    formData.append(
      "date",
      date
    );

    formData.append(
      "capacity",
      capacity
    );

    if (poster) {
      formData.append(
        "poster",
        poster
      );
    }

    await axios.post(
      "http://localhost:5000/api/events",
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "token"
          )}`,
        },
      }
    );

    setTitle("");
    setLocation("");
    setDate("");
    setPoster(null);

    fetchEvents();
    fetchStats();

  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

  const updateEvent = async () => {
    await axios.put(
  `http://localhost:5000/api/events/${editingId}`,
  {
    title,
    location,
    date,
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem(
        "token"
      )}`,
    },
  }
);

    setEditingId(null);

    setTitle("");
    setLocation("");
    setDate("");

    fetchEvents();
  };

  const chartData = [
  {
    name: "Users",
    value: stats.totalUsers,
  },
  {
    name: "Events",
    value: stats.totalEvents,
  },
  {
    name: "Uploads",
    value: stats.totalUploads,
  },
  {
    name: "Registrations",
    value: stats.totalRegistrations,
  },
];

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">
        🎉 EventSphere Dashboard
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-800 p-5 rounded-xl">
          <h3>👤 Users</h3>
          <h2 className="text-3xl font-bold">
            {stats.totalUsers}
          </h2>
        </div>

        <div className="bg-slate-800 p-5 rounded-xl">
          <h3>📅 Events</h3>
          <h2 className="text-3xl font-bold">
            {stats.totalEvents}
          </h2>
        </div>

        <div className="bg-slate-800 p-5 rounded-xl">
          <h3>🖼 Uploads</h3>
          <h2 className="text-3xl font-bold">
            {stats.totalUploads}
          </h2>
        </div>

        <div className="bg-slate-800 p-5 rounded-xl">
          <h3>🌍 Public</h3>
          <h2 className="text-3xl font-bold">
            {stats.publicUploads}
          </h2>
        </div>

        <div className="bg-slate-800 p-5 rounded-xl">
          <h3>🔒 Private</h3>
          <h2 className="text-3xl font-bold">
            {stats.privateUploads}
          </h2>
        </div>

        <div className="bg-slate-800 p-5 rounded-xl">
          <h3>👥 Registrations</h3>
          <h2 className="text-3xl font-bold">
            {stats.totalRegistrations}
          </h2>
        </div>
      </div>
     
    <div className="grid md:grid-cols-3 gap-4">

  {stats.topEvent && (
    <div className="bg-slate-800 p-5 rounded-xl">
      <h2 className="text-2xl font-bold mb-4">
        🏆 Top Event
      </h2>

     <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-5 rounded-xl shadow-lg">

  {stats.topEvent.poster && (
    <img
      src={stats.topEvent.poster}
      alt=""
      className="w-full h-48 object-cover rounded-lg mb-4"
    />
  )}

  <h3 className="text-3xl font-bold">
    {stats.topEvent.title}
  </h3>

  <p className="mt-3 text-lg">
    👥 Registrations:
    {" "}
    {stats.topEvent.registrations}
  </p>

{(() => {

  const eventDate =
    new Date(
      stats.topEvent.date
    );

  const today =
    new Date();

  const oneDayAfter =
    new Date(eventDate);

  oneDayAfter.setDate(
    oneDayAfter.getDate() + 1
  );

  if (
    today > oneDayAfter
  ) {
    return null;
  }

  return today >
    eventDate ? (
    <p className="mt-2 text-lg font-bold text-green-400">
      ✅ Event Completed
    </p>
  ) : (
    <p className="mt-2 text-lg font-bold text-cyan-300">
      ⏰{" "}
      {getTimeRemaining(
        stats.topEvent.date
      )}
    </p>
  );

})()}

  <div className="mt-4">
    <span className="bg-black/20 px-3 py-1 rounded-full text-sm">
      #1 Most Popular Event
    </span>
  </div>

</div>


    </div>
  )}

  {stats.mostLikedImage && (
    <div className="bg-slate-800 p-5 rounded-xl">
      <h2 className="text-xl font-bold mb-3">
        📸 Most Liked Image
      </h2>

      <div className="bg-slate-900 rounded-lg p-2 mb-3">
        <img
          src={stats.mostLikedImage.url}
          alt=""
          className="w-full h-64 object-contain rounded-lg"
        />
      </div>

      <p className="truncate">
        {stats.mostLikedImage.filename}
      </p>

      <p className="mt-2">
        ❤️ {stats.mostLikedImage.likes}
      </p>
    </div>
  )}

  {stats.mostFavoritedImage && (
    <div className="bg-slate-800 p-5 rounded-xl">
      <h2 className="text-xl font-bold mb-3">
        ⭐ Top Favorite Image
      </h2>

      <div className="bg-slate-900 rounded-lg p-2 mb-3">
        <img
          src={stats.mostFavoritedImage.url}
          alt=""
          className="w-full h-64 object-contain rounded-lg"
        />
      </div>

      <p className="truncate">
        {stats.mostFavoritedImage.filename}
      </p>

      <p className="mt-2">
        ⭐ {stats.mostFavoritedImage.favorites}
      </p>
    </div>
  )}

</div>

    {role === "Admin" && (

      <div className="bg-slate-800 p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">
          {editingId
            ? "Edit Event"
            : "Create Event"}
        </h2>

        <div className="grid md:grid-cols-4 gap-4">
          <input
            className="p-3 rounded-lg bg-slate-700"
            placeholder="Event Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <input
            className="p-3 rounded-lg bg-slate-700"
            placeholder="Location"
            value={location}
            onChange={(e) =>
              setLocation(
                e.target.value
              )
            }
          />

          <input
            type="date"
            className="p-3 rounded-lg bg-slate-700"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
          />

          <input
  type="number"
  className="p-3 rounded-lg bg-slate-700"
  placeholder="Max Registrations"
  value={capacity}
  onChange={(e) =>
    setCapacity(e.target.value)
  }
/>

          <div>
  <label className="block mb-2 font-semibold">
    Event Poster
  </label>

            <input
                id="poster"
                type="file"
                hidden
                onChange={(e) =>
                setPoster(e.target.files[0])
                }
            />

            <label
                htmlFor="poster"
                className="cursor-pointer bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-lg inline-block"
            >
                📸 Add Poster
            </label>

            {poster && (
                <p className="mt-2 text-sm text-green-400">
                Selected: {poster.name}
                </p>
            )}
            </div>

        </div>
    

       <button
  disabled={loading}
  className={`
    mt-4
    px-6
    py-3
    rounded-lg
    ${
      loading
        ? "bg-gray-600 cursor-not-allowed"
        : "bg-cyan-600 hover:bg-cyan-700"
    }
  `}
  onClick={
    editingId
      ? updateEvent
      : createEvent
  }
>
  {loading
    ? "Creating..."
    : editingId
    ? "Save Changes"
    : "Create Event"}
</button>
          
      </div>
)}


      {message && (
        <div className="bg-red-600 p-4 rounded-xl">
          {message}
        </div>
      )}

      <div>
        <h2 className="text-3xl font-bold mb-4">
          📅 Events
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {events.map((event) => {

  const eventDate =
    new Date(event.date);

  const today =
    new Date();

  const oneDayAfter =
    new Date(eventDate);

  oneDayAfter.setDate(
    oneDayAfter.getDate() + 1
  );

  const isCompleted =
    today > eventDate;

  const shouldHide =
    today > oneDayAfter;

  if (shouldHide) {
    return null;
  }

  return (
    <div
      key={event._id}
      className="bg-slate-800 p-5 rounded-xl"
    >

            {event.poster && (
                <img
                    src={event.poster}
                    alt=""
                    className="w-full h-48 object-cover rounded-lg mb-3"
                />
                )}

              <h3 className="text-xl font-bold">
                {event.title}
              </h3>

              <p>
                📍
                {" "}
                {event.location}
              </p>

              <p>
                📅
                {" "}
                {event.date}
              </p>

            {!isCompleted ? (
  <p className="font-semibold text-cyan-300">
    ⏰{" "}
    {getTimeRemaining(
      event.date
    )}
  </p>
) : (
  <p className="text-green-400 font-bold">
    ✅ Event Completed
  </p>
)}

              <p>
                👥 Registered:
                {" "}
                {event.registeredUsers?.length || 0}
                /
                {event.capacity}
                </p>

              <p>
                ✅ Attended:
                {event.attendees?.length || 0}
                </p>

              <div className="flex gap-2 mt-4 flex-wrap">
               {!isCompleted && (
  <button
    className="bg-green-600 px-4 py-2 rounded"
    onClick={async () => {
      try {
        await axios.post(
          `http://localhost:5000/api/events/register/${event._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "token"
              )}`,
            },
          }
        );

        setMessage("");
        fetchEvents();
      } catch (
        error
      ) {
        setMessage(
          error
            .response
            ?.data
            ?.message ||
            "Registration failed"
        );
      }
    }}
  >
    Register
  </button>
)}

    

                {role === "Admin" && (
  <button
    className="bg-yellow-600 px-4 py-2 rounded"
    onClick={() => {
      setEditingId(event._id);
      setTitle(event.title);
      setLocation(event.location);
      setDate(event.date);
    }}
  >
    Edit
  </button>
)}

                {role === "Admin" && (
  <button
    className="bg-red-600 px-4 py-2 rounded"
    onClick={async () => {
      
        await axios.delete(
  `http://localhost:5000/api/events/${event._id}`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem(
        "token"
      )}`,
    },
  }
);

      fetchEvents();
      fetchStats();
    }}
  >
    Delete
  </button>
)}
              </div>
                        </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;