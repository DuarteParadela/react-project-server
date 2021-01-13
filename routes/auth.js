const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

const salt = 10;

router.post("/signin", (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((userDocument) => {
      // If userDocument is null, it means that no user with the given email was found in the DB.
      // if you want your users to sign in with their username you can apply the same logic,
      // just be careful to set the username as unique when defining the schema.
      if (!userDocument) {
        // Status 400 for bad request.
        return res.status(400).json({ message: "Invalid credentials" }); // Send a general message so hackers don't know if the email or the password were incorrect.
      }
      const isValidPassword = bcrypt.compareSync(
        password,
        userDocument.password
      );
      // compareSync returns a boolean, if the password is not valid, send a general message so hackers don't know if the email or the password were incorrect.
      if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      req.session.currentUser = userDocument._id;
      // userDocument is a mongodb document, we cannot mutate it but every document has a .toObject().
      const userObj = userDocument.toObject();
      // userObj is now an object, we can no delete the password before setting it in the session and sending the user to the frontend.
      delete userObj.password;
      res.status(200).json(userObj);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.post("/signup", (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;

  User.findOne({ email })
    .then((userDocument) => {
      if (userDocument) {
        return res.status(400).json({ message: "Email already taken" });
      }

      try {
        // hashSync can fail, we have to wrap the hashing in a try/catch block.
        const hashedPassword = bcrypt.hashSync(password, salt);
        const newUser = {
          email,
          lastName,
          firstName,
          password: hashedPassword,
        };

        User.create(newUser).then((newUserDocument) => {
          /** Down below this logs the user on signup.
           *  If you do not want this behaviour you could just send a 201 status
           * to the frontend as a response. and then redirect the user to the login page (frontend) ?
           */

          req.session.currentUser = newUserDocument._id; // only store the user's id in the session.
          // this is a security measure in case the cookie get's compromised the attacker can't read any
          // personal information about the user.

          const userObj = newUserDocument.toObject();
          delete userObj.password; // Remove the password before sending it to the frontend.
          res.status(201).json(userObj);
        });
      } catch (error) {
        res.status(500).json(error);
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.get("/isLoggedIn", (req, res, next) => {
  // If currentUser is defined in the session it means the user is logged in.
  if (req.session.currentUser) {
    User.findById(req.session.currentUser)
      .select("-password") // Remove the password from the query.
      .then((userDocument) => {
        res.status(200).json(userDocument);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

router.get("/logout", (req, res, next) => {
  // Well...
  req.session.destroy(function (error) {
    if (error) res.status(500).json(error);
    else res.status(200).json({ message: "Succesfully disconnected." });
  });
});

module.exports = router;
