import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Gallery from "./pages/Gallery";
import UploadMedia from "./pages/UploadMedia";

import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import Notifications from "./pages/Notifications";
import socket from "./socket";
import { Toaster } from "react-hot-toast";
import MyEvents from "./pages/MyEvents";
import ScanQR from "./pages/ScanQR";
import MyTaggedPhotos
from "./pages/MyTaggedPhotos";
import ForgotPassword
from "./pages/ForgotPassword";

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6">
        <Routes>
          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

          <Route
  path="/tagged-photos"
  element={
    <MyTaggedPhotos />
  }
/>

          <Route
            path="/gallery"
            element={<Gallery />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/upload"
            element={<UploadMedia />}
          />

          

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/admin"
            element={<AdminPanel />}
          />

          <Route
            path="/notifications"
            element={<Notifications />}
          />

          <Route
          path="/my-events"
          element={<MyEvents />}
        />

        <Route
        path="/scan"
        element={<ScanQR />}
      />

        </Routes>
        
        <Toaster
          position="top-right"
        />

      </main>
    </div>
  );
}

export default App;