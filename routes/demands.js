const express = require("express");
const router = express.Router();
const Demand = require("../models/Demand");
const upload = require("../config/cloudinary");
const requireAuth = require("../middlewares/requireAuth");

// To get all demands
router.get("/", (req, res, next) => {
  Demand.find()
    .populate("id_user")
    .then((request) => {
      res.status(200).json(request);
    })
    .catch((error) => {
      next(error);
    });
});

// To create a new demand
router.post("/", requireAuth, (req, res, next) => {
  req.body.id_user = req.session.currentUser;
  Demand.create(req.body)
    .then((request) => {
      res.status(201).json(request);
    })
    .catch((error) => {
      next(error);
    });
});

// To get the demand(s) of the user connected
router.get("/mydemands", requireAuth, (req, res, next) => {
  const currentUserId = req.session.currentUser;
  if (currentUserId) {
    Demand.find({ id_user: currentUserId })
      .then((request) => {
        res.status(200).json(request);
      })
      .catch((error) => {
        console.log(error);
        next(error);
      });
  } else {
    console.log("Unauthorized");
    res.status(401).json({ message: "Unauthorized" });
  }
});

// router.get("/mydemands", (req, res, next) => {
//   Demand.find()
//     .populate("id_user")
//     .then((request) => {
//       res.status(200).json(request);
//     })
//     .catch((error) => {
//       next(error);
//     });
// });

// To update the demand of the user connected
router.patch("/mydemands", requireAuth, (req, res, next) => {
  Demand.find({ id_user: req.session.currentUser })
    // .populate("id_user")
    .then((request) => {
      res.status(200).json(request);
    })
    .catch((error) => {
      next(error);
    });
});

// To update any demand with its ID
router.patch("/mydemands/:id", requireAuth, (req, res, next) => {
  Demand.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate("id_user")
    .then((request) => {
      return res.status(200).json(request);
    })
    .catch((error) => {
      next(error);
    });
});

// To delete a demand with ID
router.delete("/mydemands/:id", requireAuth, (req, res, next) => {
  Demand.findById(req.params.id)
    // .populate("id_user")
    .then((demandDocument) => {
      if (!demandDocument) {
        return res.status(404).json({ message: "Request not found" });
      }
      if (demandDocument.id_user.toString() !== req.session.currentUser) {
        return res
          .status(403)
          .json({ message: "You cannot delete this request" });
      }
      Demand.findByIdAndDelete(req.params.id)
        .then(() => {
          return res.sendStatus(204);
        })
        .catch(next);
    })
    .catch((error) => {
      next(error);
    });
});

// To get a specific demand
router.get("/:id", requireAuth, (req, res, next) => {
  Demand.findById(req.params.id)
    .populate("id_user")
    .then((request) => {
      res.status(200).json(request);
    })
    .catch((error) => {
      next(error);
    });
});
module.exports = router;
