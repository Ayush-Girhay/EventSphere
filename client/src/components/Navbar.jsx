import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";
import toast from "react-hot-toast";

function Navbar() {
  const role =
    localStorage.getItem("role");

  const [unreadCount, setUnreadCount] =
    useState(0);

    const [menuOpen, setMenuOpen] =
  useState(false);

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/notifications/count",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      setUnreadCount(res.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    socket.on(
      "notification",
      (data) => {
        toast.success(data.message);

        fetchUnreadCount();
      }
    );

    return () => {
      socket.off("notification");
    };
  }, []);

  return (
  <nav className="bg-slate-800 border-b border-slate-700">
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

      <Link
  to="/"
  className="
    text-2xl
    font-bold
    text-cyan-400
    hover:text-cyan-300
    transition
  "
>
  EventSphere
</Link>
<div className="flex items-center gap-4">

  <Link
    to="/notifications"
    className="
      relative
      text-xl
      hover:text-cyan-400
    "
  >
    🔔

    {unreadCount > 0 && (
      <span
        className="
          absolute
          -top-2
          -right-3
          bg-red-600
          text-white
          text-xs
          px-2
          rounded-full
        "
      >
        {unreadCount}
      </span>
    )}
  </Link>

  <div
    className="
      bg-slate-700
      px-3
      py-1
      rounded-lg
      font-semibold
    "
  >
    👤 {role}
  </div>

  <button
    onClick={() =>
      setMenuOpen(!menuOpen)
    }
    className="
      text-3xl
      hover:text-cyan-400
    "
  >
    ☰
  </button>

</div>

      <div
        className={`
          fixed
          top-0
          right-0
          h-full
          w-80
          bg-slate-900
          shadow-2xl
          z-50
          p-6
          transition-transform
          duration-300
          ${
            menuOpen
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            ☰ MENU
          </h2>

          <button
            onClick={() =>
              setMenuOpen(false)
            }
            className="text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4">

          <Link to="/">
            🏠 Dashboard
          </Link>

          <Link to="/gallery">
            🖼 Gallery
          </Link>

          {(
            role === "Admin" ||
            role === "Photographer" ||
            role === "Event Coordinator"
          ) && (
            <Link to="/upload">
              📤 Upload
            </Link>
          )}

          <Link to="/profile">
            👤 Profile
          </Link>

          <Link
  to="/tagged-photos"
  className="hover:text-cyan-400"
>
  👤 My Tagged Photos
</Link>

          <Link to="/my-events">
            🎫 My Events
          </Link>

          {role === "Admin" && (
            <Link to="/admin">
              ⚙️ Admin
            </Link>
          )}

          {(
            role === "Admin" ||
            role === "Event Coordinator"
          ) && (
            <Link to="/scan">
              🎫 Scan QR
            </Link>
          )}

          <hr className="border-slate-700" />

          <Link to="/login">
            🔑 Login
          </Link>

          <Link to="/register">
            📝 Register
          </Link>

          <hr className="border-slate-700" />

          <button
            className="bg-red-600 hover:bg-red-700 py-2 rounded-lg"
            onClick={() => {
              localStorage.clear();
              window.location.href =
                "/login";
            }}
          >
            🚪 Logout
          </button>

        </div>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() =>
            setMenuOpen(false)
          }
        />
      )}

    </div>
  </nav>
);
}

export default Navbar;