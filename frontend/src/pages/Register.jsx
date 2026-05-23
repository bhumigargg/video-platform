import React, { useState } from "react";

import API from "../api/axios";

const Register = () => {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("viewer");

  const [tenantId, setTenantId] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleRegister = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      await API.post(
        "/auth/register",
        {
          name,
          email,
          password,
          role,
          tenantId,
        }
      );

      alert(
        "Registration Successful"
      );

      window.location.href = "/";

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
          "Registration failed"
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
            Create Account
          </h1>

          <p className="text-gray-400">
            Join StreamSafe Platform
          </p>

        </div>

        <form
          onSubmit={handleRegister}
          className="space-y-5"
        >

          <div>

            <label className="block text-gray-300 mb-2">
              Name
            </label>

            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full bg-gray-800 text-white p-4 rounded-xl outline-none border border-gray-700 focus:border-blue-500"
              required
            />

          </div>

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

          <div>

            <label className="block text-gray-300 mb-2">
              Role
            </label>

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              className="w-full bg-gray-800 text-white p-4 rounded-xl outline-none border border-gray-700 focus:border-blue-500"
            >
              <option value="viewer">
                Viewer
              </option>

              <option value="editor">
                Editor
              </option>

              <option value="admin">
                Admin
              </option>

            </select>

          </div>

          <div>

            <label className="block text-gray-300 mb-2">
              Tenant ID
            </label>

            <input
              type="text"
              placeholder="Enter tenant ID"
              value={tenantId}
              onChange={(e) =>
                setTenantId(e.target.value)
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
              ? "Creating Account..."
              : "Register"}
          </button>

        </form>

        <div className="mt-6 text-center">

          <p className="text-gray-400">

            Already have an account?{" "}

            <a
              href="/"
              className="text-blue-400 hover:text-blue-300"
            >
              Login
            </a>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Register;