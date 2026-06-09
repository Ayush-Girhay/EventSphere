import { useEffect, useState } from "react";
import axios from "axios";

function AdminPanel() {
  const [users, setUsers] =
    useState([]);

  const fetchUsers =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await axios.get(
            "http://localhost:5000/api/admin/users",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        setUsers(
          res.data.users
        );
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleColor = (
    role
  ) => {
    switch (role) {
      case "Admin":
        return "bg-red-600";

        case "Event Coordinator":
  return "bg-purple-600";

      case "Photographer":
        return "bg-yellow-600";
        
        case "Club Member":
        return "bg-green-600";

      default:
        return "bg-cyan-600";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">
        🛠 Admin Panel
      </h1>

      <div className="bg-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
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
                  Change Role
                </th>

                <th className="p-4 text-left">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map(
                (user) => (
                  <tr
                    key={
                      user._id
                    }
                    className="border-t border-slate-700"
                  >
                    <td className="p-4">
                      {user.name}
                    </td>

                    <td className="p-4">
                      {user.email}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-lg text-white ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="p-4">
                      {user.role ===
                      "Admin" ? (
                        <span className="text-slate-400 font-semibold">
                          Protected
                        </span>
                      ) : (
                        <select
                          defaultValue={
                            user.role
                          }
                          className="bg-slate-700 p-2 rounded"
                          onChange={async (
                            e
                          ) => {
                            const token =
                              localStorage.getItem(
                                "token"
                              );

                            await axios.put(
                              `http://localhost:5000/api/admin/users/${user._id}`,
                              {
                                role:
                                  e
                                    .target
                                    .value,
                              },
                              {
                                headers:
                                  {
                                    Authorization: `Bearer ${token}`,
                                  },
                              }
                            );

                            fetchUsers();
                          }}
                        >
                          <option value="Event Coordinator">
                            Event Coordinator
                          </option>
                          
                          <option value="Photographer">
                          Photographer
                        </option>

                        <option value="Club Member">
                          Club Member
                        </option>

                        <option value="Viewer">
                          Viewer
                        </option>


                        </select>
                      )}
                    </td>

                    <td className="p-4">
                      {user.role !==
                        "Admin" && (
                        <button
                          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                          onClick={async () => {
                            const token =
                              localStorage.getItem(
                                "token"
                              );

                            await axios.delete(
                              `http://localhost:5000/api/admin/users/${user._id}`,
                              {
                                headers:
                                  {
                                    Authorization: `Bearer ${token}`,
                                  },
                              }
                            );

                            fetchUsers();
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;