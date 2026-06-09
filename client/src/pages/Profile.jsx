import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [profile, setProfile] =
    useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await axios.get(
            "https://eventsphere-mkp6.onrender.com/api/users/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        setProfile(res.data);
      } catch (error) {
        console.log(error);
      }
    };

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <h2 className="text-2xl">
          Loading Profile...
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-slate-800 rounded-2xl p-8 shadow-xl">

        {/* Profile Header */}
        <div className="flex flex-col items-center">

        <div className="relative">

  {profile.user.profilePicture ? (
    <img
      src={
        profile.user.profilePicture
      }
      alt=""
      className="
      w-36
      h-36
      rounded-full
      object-cover
      border-4
      border-cyan-500
      "
    />
  ) : (
    <div
      className="
      w-36
      h-36
      rounded-full
      bg-gradient-to-r
      from-cyan-500
      to-blue-600
      flex
      items-center
      justify-center
      text-6xl
      font-bold
      "
    >
      {profile.user.name
        ?.charAt(0)
        ?.toUpperCase()}
    </div>
  )}

</div>

<label
  className="
    mt-4
    px-5
    py-2
    bg-cyan-600
    hover:bg-cyan-700
    rounded-xl
    cursor-pointer
    font-semibold
    transition
  "
>
  📷 Add Profile Photo

  <input
    type="file"
    accept="image/*"
    hidden
    onChange={async (e) => {

      const file =
        e.target.files[0];

      if (!file) return;

      const formData =
        new FormData();

      formData.append(
        "image",
        file
      );

      try {

        await axios.post(
          "https://eventsphere-mkp6.onrender.com/api/users/profile-photo",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "token"
              )}`,
            },
          }
        );

        fetchProfile();

      } catch (error) {
        console.log(error);
      }
    }}
  />
</label>

          <h1 className="text-5xl font-bold mt-4">
            {profile.user.name}
          </h1>

          <p className="text-slate-400 text-lg">
            {profile.user.email}
          </p>

          <span
            className={`mt-4 px-6 py-2 rounded-full font-semibold ${
              profile.user.role ===
              "Admin"
                ? "bg-red-600"
                : profile.user.role ===
                  "Photographer"
                ? "bg-yellow-600"
                : profile.user.role ===
                  "Club Member"
                ? "bg-green-600"
                : "bg-cyan-600"
            }`}
          >
            {profile.user.role}
          </span>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-10">

          <div className="bg-slate-700 p-6 rounded-xl text-center">
            <h3 className="text-lg">
              📤 Uploads
            </h3>

            <p className="text-4xl font-bold mt-2">
              {profile.totalUploads}
            </p>
          </div>

          <div className="bg-slate-700 p-6 rounded-xl text-center">
            <h3 className="text-lg">
              🎫 Events Joined
            </h3>

            <p className="text-4xl font-bold mt-2">
              {profile.totalRegistrations}
            </p>
          </div>

          <div className="bg-slate-700 p-6 rounded-xl text-center">
            <h3 className="text-lg">
              🏷 Tagged Photos
            </h3>

            <p className="text-4xl font-bold mt-2">
              0
            </p>
          </div>

          <div className="bg-slate-700 p-6 rounded-xl text-center">
            <h3 className="text-lg">
              🎉 Joined
            </h3>

            <p className="text-lg font-bold mt-2">
              {new Date(
                profile.user.createdAt
              ).toLocaleDateString()}
            </p>
          </div>

        </div>

        {/* Quick Actions */}
        <div className="mt-12">

          <h2 className="text-3xl font-bold mb-6">
            Quick Actions
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            <button
              onClick={() =>
                (window.location.href =
                  "/gallery")
              }
              className="
                bg-cyan-600
                hover:bg-cyan-700
                p-6
                rounded-2xl
                text-lg
                font-semibold
                shadow-lg
                transition
                hover:scale-105
              "
            >
              🖼 Gallery
            </button>

            <button
              onClick={() =>
                (window.location.href =
                  "/my-events")
              }
              className="
                bg-cyan-600
                hover:bg-cyan-700
                p-6
                rounded-2xl
                text-lg
                font-semibold
                shadow-lg
                transition
                hover:scale-105
              "
            >
              🎫 My Events
            </button>

            <button
              onClick={() =>
                (window.location.href =
                  "/tagged-photos")
              }
              className="
                bg-cyan-600
                hover:bg-cyan-700
                p-6
                rounded-2xl
                text-lg
                font-semibold
                shadow-lg
                transition
                hover:scale-105
              "
            >
              🏷 Tagged Photos
            </button>

          </div>

        </div>

        {/* Recent Activity */}
        <div className="mt-12">

          <h2 className="text-3xl font-bold mb-6">
            Recent Activity
          </h2>

          <div className="bg-slate-700 p-6 rounded-2xl">

            <div className="space-y-4 text-lg">

              <div className="flex items-center gap-3">
                📤 Uploaded media
              </div>

              <div className="flex items-center gap-3">
                🎫 Joined event
              </div>

              <div className="flex items-center gap-3">
                🏷 Tagged in photo
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Profile;