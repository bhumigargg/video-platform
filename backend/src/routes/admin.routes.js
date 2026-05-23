const express = require("express");

const router = express.Router();

const User = require("../models/User");

const authMiddleware = require(
  "../middlewares/auth.middleware"
);

const roleMiddleware = require(
  "../middlewares/role.middleware"
);


// =====================================
// GET ALL USERS OF SAME TENANT
// =====================================

router.get(
  "/users",

  authMiddleware,

  roleMiddleware(["admin"]),

  async (req, res) => {

    try {

      console.log(
        "ADMIN FETCH USERS:",
        req.user
      );

      const users =
        await User.find({
          tenantId:
            req.user.tenantId,
        });

      res.json({
        success: true,
        users,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
);


// =====================================
// DELETE USER
// =====================================

router.delete(
  "/users/:id",

  authMiddleware,

  roleMiddleware(["admin"]),

  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {

        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      // Prevent deleting
      // users from another tenant
      if (
        user.tenantId !==
        req.user.tenantId
      ) {

        return res.status(403).json({
          success: false,
          message:
            "Access denied",
        });
      }

      await User.findByIdAndDelete(
        req.params.id
      );

      res.json({
        success: true,
        message:
          "User deleted successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
);


// =====================================
// CHANGE USER ROLE
// =====================================

router.put(
  "/users/:id/role",

  authMiddleware,

  roleMiddleware(["admin"]),

  async (req, res) => {

    try {

      const { role } =
        req.body;

      console.log(
        "NEW ROLE:",
        role
      );

      // VALID ROLES
      const validRoles = [
        "viewer",
        "editor",
        "admin",
      ];

      if (
        !validRoles.includes(
          role
        )
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Invalid role",
        });
      }

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {

        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      // Prevent editing
      // another tenant user
      if (
        user.tenantId !==
        req.user.tenantId
      ) {

        return res.status(403).json({
          success: false,
          message:
            "Access denied",
        });
      }

      // UPDATE ROLE
      user.role = role;

      await user.save();

      console.log(
        "UPDATED USER:",
        user
      );

      res.json({
        success: true,
        message:
          "Role updated successfully",
        user,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
);

module.exports = router;