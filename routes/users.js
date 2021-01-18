const express = require("express");
const router = express.Router();
const User = require("../models/User");
const upload = require("../config/cloudinary");
const requireAuth = require("../middlewares/requireAuth");

// To update profile of the user connected
router.patch("/myprofile", (req, res, next) => {
  const userId = req.session.currentUser;

  User.findByIdAndUpdate(userId, req.body, { new: true })
    .select("-password") // Remove the password field from the found document.
    .then((userDocument) => {
      res.status(200).json(userDocument);
    })
    .catch(next);
});

// To update any user with its ID
router.patch("/myprofile/:id", requireAuth, (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .select("-password")
    .then((userDocument) => {
      return res.status(200).json(userDocument);
    })
    .catch((error) => {
      next(error);
    });
});

// To delete the profile of the user connected
router.delete("/myprofile/", requireAuth, (req, res, next) => {
  const userId = { id_user: req.session.currentUser };
  User.find(userId)
    // .populate("id_user")
    .then((userDoc) => {
      if (!userDoc) {
        return res.status(404).json({ message: "Profile not found" });
      }
      if (userDoc.id_user.toString() !== req.session.currentUser) {
        return res
          .status(403)
          .json({ message: "You cannot delete this profile" });
      }
      User.findByIdAndDelete(userId)
        .then(() => {
          return res.sendStatus(204);
        })
        .catch(next);
    })
    .catch((error) => {
      next(error);
    });
});

// To delete a profile with ID
router.delete("/myprofile/:id", requireAuth, (req, res, next) => {
  User.findById(req.params.id)
    // .populate("id_user")
    .then((userDoc) => {
      if (!userDoc) {
        return res.status(404).json({ message: "Profile not found" });
      }
      if (userDoc.id_user.toString() !== req.session.currentUser) {
        return res
          .status(403)
          .json({ message: "You cannot delete this profile" });
      }
      User.findByIdAndDelete(req.params.id)
        .then(() => {
          return res.sendStatus(204);
        })
        .catch(next);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
