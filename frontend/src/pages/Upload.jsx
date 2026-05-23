
import React, { useState } from "react";

import API from "../api/axios";

const Upload = () => {

  const [title, setTitle] =
    useState("");

  const [video, setVideo] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const handleUpload = async (e) => {

    e.preventDefault();

    if (!video) {
      return alert(
        "Please select a video"
      );
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);

      formData.append("video", video);

      await API.post(
        "/videos/upload",
        formData
      );

      alert("Upload successful");

      window.location.href =
        "/dashboard";

    } catch (error) {

      console.log(error);

      alert("Upload failed");

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">

      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 w-full max-w-lg shadow-2xl">

        <h1 className="text-3xl font-bold text-white mb-6">
          Upload Video
        </h1>

        <form
          onSubmit={handleUpload}
          className="space-y-5"
        >

          <input
            type="text"
            placeholder="Video title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="w-full bg-gray-800 text-white p-4 rounded-xl outline-none"
          />

          <input
            type="file"
            accept="video/*"
            onChange={(e) =>
              setVideo(e.target.files[0])
            }
            className="w-full bg-gray-800 text-white p-4 rounded-xl"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition py-4 rounded-xl text-white font-semibold"
          >
            {loading
              ? "Uploading..."
              : "Upload Video"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default Upload;