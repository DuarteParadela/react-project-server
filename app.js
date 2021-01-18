require("dotenv").config();
require("./config/dbConnection");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const indexRouter = require("./routes/index");
const _DEV_MODE = false;
const app = express();

/*  Cross Origin Ressource Sharing
    https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
*/

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // white list of clients, allowing specific domains to communicate with the api.
    credentials: true, // Allow client to send cookies.
  })
);

app.use(logger("dev")); // Show us the the request methods (get,post...) status and url in the console.
app.use(express.json()); // Allows us to access data sent as json through request.body
app.use(express.urlencoded({ extended: false })); // Alows us to access data sent as urlencoded through request.body
app.use(cookieParser()); // Allows us to access cookies through request.cookies
app.use(express.static(path.join(__dirname, "public"))); // Define public folder to serve static assets, imgs, etc..

app.use(
  session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }), // Persist the session in the Database
    saveUninitialized: true,
    resave: true,
    secret: process.env.SESSION_SECRET,
  })
);

if (_DEV_MODE) {
  const User = require("./models/User");

  app.use((req, res, next) => {
    User.findOne({}) // Get a user from the DB (doesnt matter which)
      .then((userDocument) => {
        req.session.currentUser = userDocument._id; // Set that user as the loggedin user by putting him in the session.
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        // .finally() will be called no matter if the promise failed or succeeded so we can safely call our next function here.
        next();
      });
  });
}

/*  Routers ! */

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/demands", require("./routes/demands"));
app.use("/api/homes", require("./routes/homes"));

// Middleware that handles a ressource that wasn't found.
app.use((req, res, next) => {
  res.status(404).json({
    message: `The ressource you're trying to request doesn't exist. Method: ${req.method} path: ${req.originalUrl}`,
  });
});

if (process.env.NODE_ENV === "production") {
  app.use("*", (req, res, next) => {
    // If no routes match, send them the React HTML.
    res.sendFile(__dirname + "/public/index.html");
  });
}

// Middleware that handles errors, as soon as you pass some data to your next() function
// eg: next("toto"). You will end up in this middleware function.

app.use((error, req, res, next) => {
  console.log(error);
  error.status = error.status || 500;
  res.json(error);
});

/*  App is exported and then used in ./bin/www where the http server is initialized. */
module.exports = app;
