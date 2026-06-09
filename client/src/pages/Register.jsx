import { useState } from "react";
import axios from "axios";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Viewer",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://eventsphere-mkp6.onrender.com/api/auth/register",
        form
      );

      alert(res.data.message);

      window.location.href =
        "/login";
    } 
    catch (error) {
  console.log(error);

  alert(
    error.response?.data?.message ||
    "Registration Failed"
  );
}
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name:
                  e.target.value,
              })
            }
            className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600"
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email:
                  e.target.value,
              })
            }
            className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password:
                  e.target.value,
              })
            }
            className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600"
          />

          

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 p-3 rounded-lg font-semibold"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;