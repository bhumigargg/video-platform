import React, {
  useEffect,
  useState,
} from "react";

import API from "../api/axios";

const Admin = () => {

  const [users, setUsers] =
    useState([]);

  const fetchUsers = async () => {

    try {

      const res =
        await API.get(
          "/admin/users"
        );

      setUsers(res.data.users);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchUsers();

  }, []);


  // DELETE USER
  const deleteUser = async (
    id
  ) => {

    try {

      await API.delete(
        `/admin/users/${id}`
      );

      fetchUsers();

    } catch (error) {

      console.log(error);
    }
  };


  // CHANGE USER ROLE
  const changeRole = async (
    id,
    role
  ) => {

    try {

      await API.put(
        `/admin/users/${id}/role`,
        { role }
      );

      fetchUsers();

    } catch (error) {

      console.log(error);
    }
  };

  return (

    <div className="min-h-screen bg-gray-950 text-white p-8">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold">
          Admin Panel
        </h1>

        <a
          href="/dashboard"
          className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl transition"
        >
          Dashboard
        </a>

      </div>


      <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-xl">

        <table className="w-full">

          <thead className="bg-gray-800">

            <tr>

              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                Email
              </th>

              <th className="p-4 text-left">
                Role
              </th>

              <th className="p-4 text-left">
                Tenant
              </th>

              <th className="p-4 text-left">
                Change Role
              </th>

              <th className="p-4 text-left">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr
                key={user._id}
                className="border-t border-gray-800 hover:bg-gray-800 transition"
              >

                <td className="p-4">
                  {user.name}
                </td>

                <td className="p-4">
                  {user.email}
                </td>

                <td className="p-4 capitalize">
                  {user.role}
                </td>

                <td className="p-4">
                  {user.tenantId}
                </td>

                <td className="p-4">

                  <select
                    value={user.role}

                    onChange={(e) =>
                      changeRole(
                        user._id,
                        e.target.value
                      )
                    }

                    className="bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg outline-none"
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

                </td>

                <td className="p-4">

                  <button
                    onClick={() =>
                      deleteUser(
                        user._id
                      )
                    }

                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Admin;