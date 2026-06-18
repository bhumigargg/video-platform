
import React, { useEffect, useState } from "react";

import API from "../api/axios";

import { io } from "socket.io-client";
import {
  FaVideo,
  FaUpload,
  FaShieldAlt,
} from "react-icons/fa";

const BACKEND_URL = "https://video-platform-dcx6.onrender.com";
const socket = io(BACKEND_URL);

const Dashboard = () => {

  const [videos, setVideos] = useState([]);
  const [menuOpen,
  setMenuOpen] =
  useState(false);
  const fetchVideos = async () => {

    try {

      const res = await API.get("/videos");

      setVideos(res.data.videos);

    } catch (error) {

      console.log(error);
    }
  };
  const handleLogout = () => {

  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem(
    "user"
  );

  window.location.href = "/";
};

  useEffect(() => {

    fetchVideos();

    socket.on(
      "processing-progress",
      (data) => {

        setVideos((prev) =>
          prev.map((video) =>
            video._id === data.videoId
              ? {
                  ...video,
                  progress: data.progress,
                }
              : video
          )
        );
      }
    );

    socket.on(
      "processing-complete",
      (data) => {

        setVideos((prev) =>
          prev.map((video) =>
            video._id === data.videoId
              ? {
                  ...video,
                  progress: 100,
                  sensitivity:
                    data.sensitivity,
                }
              : video
          )
        );
      }
    );

    return () => {
      socket.disconnect();
    };

  }, []);
  const user = JSON.parse(
  localStorage.getItem("user")
);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">

      <div className="mb-10">

  <div className="flex justify-between items-center mb-8">

    <div>

      <h1 className="text-4xl font-bold">
        Video Dashboard
      </h1>

      <p className="text-gray-400 mt-2">
        Manage and moderate videos
      </p>

    </div>

    <div className="flex gap-3">

      <div className="relative">

  <button
    onClick={() =>
      setMenuOpen(
        !menuOpen
      )
    }
    className="bg-blue-600 px-5 py-3 rounded-xl"
  >
    Menu ▼
  </button>

  {menuOpen && (

    <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-lg z-50">

      <a
        href="/upload"
        className="block px-4 py-3 hover:bg-gray-800"
      >
        Upload Video
      </a>

      {user?.role === "admin" && (

        <a
          href="/admin"
          className="block px-4 py-3 hover:bg-gray-800"
        >
          Admin Panel
        </a>

      )}

      <button
        onClick={handleLogout}
        className="block w-full text-left px-4 py-3 text-red-400 hover:bg-gray-800"
      >
        Logout
      </button>

    </div>

  )}

</div>

    </div>

  </div>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

    {/* stats cards here */}

  </div>

</div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

  <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
    <div className="flex items-center gap-2 text-gray-400">
  <FaVideo />
  <span>Total Videos</span>
</div>

    <h2 className="text-3xl font-bold">
      {videos.length}
    </h2>
  </div>

  <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
    <div className="flex items-center gap-2 text-green-400">
  <FaShieldAlt />
  <span>Safe Videos</span>
</div>

    <h2 className="text-3xl font-bold">
      {
        videos.filter(
          v =>
            v.sensitivity ===
            "safe"
        ).length
      }
    </h2>
  </div>

  <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
    <p className="text-red-400">
      Flagged Videos
    </p>

    <h2 className="text-3xl font-bold">
      {
        videos.filter(
          v =>
            v.sensitivity ===
            "flagged"
        ).length
      }
    </h2>
  </div>

  <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
    <div className="flex items-center gap-2 text-yellow-400">
  <FaUpload />
  <span>Processing</span>
</div>

    <h2 className="text-3xl font-bold">
      {
        videos.filter(
          v =>
            v.status ===
            "processing"
        ).length
      }
    </h2>
  </div>

</div>


      {videos.length === 0 ? (

        <div className="bg-gray-900 p-10 rounded-2xl text-center border border-gray-800">
          <h2 className="text-2xl font-semibold mb-2">
            No Videos Uploaded
          </h2>

          <p className="text-gray-400">
            Upload your first video.
          </p>
        </div>

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {videos.map((video) => (

            <div
              key={video._id}
              className="
              bg-gray-900
              rounded-3xl
              overflow-hidden
              border border-gray-800
              hover:border-blue-500
              hover:shadow-blue-500/20
              transition-all
              duration-300
              shadow-xl
              "
            >

              <video
                controls
                className="
                w-full
                h-56
                object-cover
                bg-black
                "
              >
                <source
                    src={video.videoUrl}
                    type="video/mp4"
                  />
              </video>

              <div className="p-5">

                <h2 className="text-xl font-semibold truncate">
                  {video.title}
                </h2>

                <div className="mt-4">

                  <div className="flex justify-between mb-2 text-sm">
                    <span>
                      Processing
                    </span>

                    <span>
                      {video.progress || 0}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">

                    <div
                      className="bg-blue-500 h-3 transition-all duration-500"
                      style={{
                        width: `${video.progress || 0}%`,
                      }}
                    ></div>

                  </div>

                </div>

                <div className="mt-5 flex items-center justify-between">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      video.sensitivity ===
                      "safe"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {video.sensitivity ||
                      "processing"}
                  </span>

                  <span className="text-gray-400 text-sm">
                    {video.status}
                  </span>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default Dashboard;