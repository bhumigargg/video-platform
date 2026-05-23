
import React, { useState } from "react";

import API from "../api/axios";

const Login = () => {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await API.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Login Successful");

      window.location.href =
        "/dashboard";

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
          "Login failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">

      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">

        <div className="mb-8 text-center">

          <h1 className="text-4xl font-bold text-white mb-2">
            StreamSafe
          </h1>

          <p className="text-gray-400">
            Secure Video Management
          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <div>

            <label className="block text-gray-300 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full bg-gray-800 text-white p-4 rounded-xl outline-none border border-gray-700 focus:border-blue-500"
              required
            />

          </div>

          <div>

            <label className="block text-gray-300 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full bg-gray-800 text-white p-4 rounded-xl outline-none border border-gray-700 focus:border-blue-500"
              required
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition py-4 rounded-xl text-white font-semibold"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        <div className="mt-6 text-center">

          <p className="text-gray-400">

            Don't have an account?{" "}

            <a
              href="/register"
              className="text-blue-400 hover:text-blue-300"
            >
              Register
            </a>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;