import { useState } from "react";
import axios from "axios";

function ForgotPassword() {

  const [email, setEmail] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const sendOTP = async () => {
    try {

      const res =
        await axios.post(
          "http://localhost:5000/api/auth/forgot-password",
          {
            email,
          }
        );

      alert(
        res.data.message
      );

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data
          ?.message ||
          error.message
      );

    }
  };

  const resetPassword =
    async () => {
      try {

        const res =
          await axios.post(
            "http://localhost:5000/api/auth/reset-password",
            {
              email,
              otp,
              newPassword,
            }
          );

        alert(
          res.data.message
        );

        window.location.href =
          "/login";

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data
            ?.message ||
            error.message
        );

      }
    };

  return (
    <div
      className="
        max-w-md
        mx-auto
        mt-20
        bg-slate-800
        p-8
        rounded-xl
      "
    >

      <h1
        className="
          text-3xl
          font-bold
          mb-6
          text-center
        "
      >
        Forgot Password
      </h1>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) =>
          setEmail(
            e.target.value
          )
        }
        className="
          w-full
          p-3
          rounded
          bg-slate-700
          mb-4
        "
      />

      <button
        onClick={sendOTP}
        className="
          w-full
          bg-cyan-600
          hover:bg-cyan-700
          p-3
          rounded
          mb-4
        "
      >
        Send OTP
      </button>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) =>
          setOtp(
            e.target.value
          )
        }
        className="
          w-full
          p-3
          rounded
          bg-slate-700
          mb-4
        "
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) =>
          setNewPassword(
            e.target.value
          )
        }
        className="
          w-full
          p-3
          rounded
          bg-slate-700
          mb-4
        "
      />

      <button
        onClick={resetPassword}
        className="
          w-full
          bg-green-600
          hover:bg-green-700
          p-3
          rounded
        "
      >
        Reset Password
      </button>

    </div>
  );
}

export default ForgotPassword;