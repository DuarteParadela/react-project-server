const express = require("express");
const router = express.Router();
const Home = require("../models/Home");
const upload = require("../config/cloudinary");
const requireAuth = require("../middlewares/requireAuth");

// To get all homes
router.get("/", requireAuth, (req, res, next) => {
  Home.find()
    .populate("id_user")
    .then((request) => {
      res.status(200).json(request);
    })
    .catch((error) => {
      next(error);
    });
});

// To get a specific home

router.get("/:id", requireAuth, (req, res, next) => {
  Home.findById(req.params.id)
    .populate("id_user")
    .then((homeDoc) => {
      res.status(200).json(homeDoc);
    })
    .catch((error) => {
      next(error);
    });
});

// To create a new home
router.post("/", requireAuth, (req, res, next) => {
  req.body.id_user = req.session.currentUser;
  Home.create(req.body)
    .then((request) => {
      res.status(201).json(request);
    })
    .catch((error) => {
      next(error);
    });
});

// To get the home(s) of the user connected
router.get("/myhome", requireAuth, (req, res, next) => {
  Home.find({ id_user: req.session.currentUser })
    // .populate("id_user")
    .then((request) => {
      res.status(200).json(request);
    })
    .catch((error) => {
      next(error);
    });
});

// To update the home of the user connected
router.patch("/myhome", requireAuth, (req, res, next) => {
  Home.find({ id_user: req.session.currentUser })
    // .populate("id_user")
    .then((request) => {
      res.status(200).json(request);
    })
    .catch((error) => {
      next(error);
    });
});

// To update any home with its ID
router.patch("/myhome/:id", requireAuth, (req, res, next) => {
  Home.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate("id_user")
    .then((request) => {
      return res.status(200).json(request);
    })
    .catch((error) => {
      next(error);
    });
});

// To delete a home with its ID
router.delete("/myhome/:id", (req, res, next) => {
  Home.findById(req.params.id)
    // .populate("id_user")
    .then((homeDocument) => {
      if (!homeDocument) {
        return res.status(404).json({ message: "Home not found" });
      }
      if (homeDocument.id_user.toString() !== req.session.currentUser) {
        return res.status(403).json({ message: "You cannot delete this Home" });
      }
      Home.findByIdAndDelete(req.params.id)
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
