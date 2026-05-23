
import React, { useEffect, useState } from "react";

import API from "../api/axios";

import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Dashboard = () => {

  const [videos, setVideos] = useState([]);

  const fetchVideos = async () => {

    try {

      const res = await API.get("/videos");

      setVideos(res.data.videos);

    } catch (error) {

      console.log(error);
    }
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

      <div className="flex items-center justify-between mb-8">

        <h1 className="text-4xl font-bold">
          Video Dashboard
        </h1>

        {user?.role !== "viewer" && (

  <a
    href="/upload"
    className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-semibold transition"
  >
    Upload Video
  </a>

)}
{user?.role === "admin" && (

  <a
    href="/admin"
    className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl font-semibold transition ml-4"
  >
    Admin Panel
  </a>

)}

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
              className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-lg"
            >

              <video
                controls
                className="w-full h-56 object-cover bg-black"
              >
                <source
                  src={`http://localhost:5000/api/videos/stream/${video._id}`}
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