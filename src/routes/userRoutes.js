// src/routes/userRoutes.js
const express = require("express");
const {
  registerUser,
  loginUser,
  updateUserProfile,
} = require("../services/userService");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/userModel"); // Import the User model
const { body, validationResult } = require("express-validator");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const { isValidEmail, isValidUsername } = require("../utils/validators");

const router = express.Router();

router.post(
  "/register",
  [
    body("email").custom((email) => {
      if (!isValidEmail(email)) {
        throw new Error("Invalid email format");
      }
      return true;
    }),
    body("username").custom((username) => {
      if (!isValidUsername(username)) {
        throw new Error(
          "Username must be 3-20 characters and contain only letters, numbers, and underscores"
        );
      }
      return true;
    }),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return errorResponse(res, { errors: errors.array() });
      }
      const user = await registerUser(req.body);
      return successResponse(res, user, 201);
    } catch (err) {
      return errorResponse(res, err);
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    return successResponse(res, { user, token });
  } catch (err) {
    return errorResponse(res, err);
  }
});

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put(
  "/profile",
  authMiddleware,
  [
    body("email")
      .optional()
      .custom((email) => {
        if (!isValidEmail(email)) {
          throw new Error("Invalid email format");
        }
        return true;
      }),
    body("username")
      .optional()
      .custom((username) => {
        if (!isValidUsername(username)) {
          throw new Error(
            "Username must be 3-20 characters and contain only letters, numbers, and underscores"
          );
        }
        return true;
      }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return errorResponse(res, { errors: errors.array() });
      }
      const updatedUser = await updateUserProfile(req.user.id, req.body);
      return successResponse(res, updatedUser);
    } catch (err) {
      return errorResponse(res, err);
    }
  }
);

module.exports = router;
