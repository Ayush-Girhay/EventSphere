const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "-password"
    );

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed",
    });
  }
};

exports.changeRole = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const { role } = req.body;

    const user =
      await User.findById(id);

      if (
  req.user.id === id
) {
  return res.status(400).json({
    success: false,
    message:
      "You cannot change your own role",
  });
}

if (
  user.role === "Admin"
) {
  return res.status(400).json({
    success: false,
    message:
      "Admin role cannot be changed",
  });
}

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (role === "Admin") {
  return res.status(403).json({
    success: false,
    message:
      "Creating new Admins is not allowed",
  });
}

    user.role = role;

    await user.save();

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed",
    });
  }
};

exports.deleteUser = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const user =
  await User.findById(id);

if (!user) {
  return res.status(404).json({
    success: false,
    message:
      "User not found",
  });
}

if (
  user.role === "Admin"
) {
  return res.status(400).json({
    success: false,
    message:
      "Admin accounts cannot be deleted",
  });
}

await User.findByIdAndDelete(
  id
);

    res.json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed",
    });
  }
};