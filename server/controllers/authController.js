const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const transporter =
  require("../config/mailer");

exports.registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    const existingName =
  await User.findOne({
    name: name.trim(),
  });

if (existingName) {
  return res.status(400).json({
    success: false,
    message:
      "Username already exists",
  });
}

const existingEmail =
  await User.findOne({
    email: email.trim(),
  });

if (existingEmail) {
  return res.status(400).json({
    success: false,
    message:
      "Email already exists",
  });
}

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
  await User.create({
    name,
    email,
    password:
      hashedPassword,
    role: "Viewer",
  });

     try {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to EventSphere",
    html: `
      <h2>Hello ${name}</h2>
      <p>Your EventSphere account has been created successfully.</p>
    `,
  });
} catch (mailError) {
  console.log(
    "EMAIL ERROR:",
    mailError.message
  );
}

    res.status(201).json({
      success: true,
      message:
        "User Registered",
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Registration Failed",
    });
  }
};

exports.loginUser = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "User not found",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    const token = jwt.sign(
  {
    id: user._id,
    role: user.role,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);

    res.json({
      success: true,
      token,
      role: user.role,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Login Failed",
    });
  }
};

exports.forgotPassword =
  async (req, res) => {
    try {

      const { email } =
        req.body;

      const user =
        await User.findOne({
          email,
        });

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "Email not found",
        });
      }

      const otp =
        Math.floor(
          100000 +
          Math.random() *
            900000
        ).toString();

      user.resetOTP =
        otp;

      user.resetOTPExpires =
        Date.now() +
        10 * 60 * 1000;

      await user.save();

      await transporter.sendMail({
        from:
          process.env.EMAIL_USER,

        to: email,

        subject:
          "EventSphere Password Reset OTP",

        html: `
          <h2>Password Reset</h2>

          <p>Your OTP is:</p>

          <h1>${otp}</h1>

          <p>
            Valid for 10 minutes.
          </p>
        `,
      });

      res.json({
        success: true,
        message:
          "OTP sent to email",
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
      });
    }
  };

  exports.resetPassword =
  async (req, res) => {
    try {

      const {
        email,
        otp,
        newPassword,
      } = req.body;

      const user =
        await User.findOne({
          email,
        });

      if (!user) {
        return res.status(404).json({
          success: false,
        });
      }

      if (
        user.resetOTP !== otp
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid OTP",
        });
      }

      if (
        user.resetOTPExpires <
        Date.now()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "OTP expired",
        });
      }

      user.password =
        await bcrypt.hash(
          newPassword,
          10
        );

      user.resetOTP =
        null;

      user.resetOTPExpires =
        null;

      await user.save();

      res.json({
        success: true,
        message:
          "Password updated",
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
      });
    }
  };