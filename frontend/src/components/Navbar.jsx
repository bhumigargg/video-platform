import React from "react";

const Navbar = () => {

  return (
    <div className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex justify-between items-center">

      <h1 className="text-2xl font-bold text-white">
        StreamSafe
      </h1>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white"
      >
        Logout
      </button>

    </div>
  );
};

export default Navbar;