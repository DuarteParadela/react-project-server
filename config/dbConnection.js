const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((self) => {
    console.log(`Connection to ${self.connection.name} established.`);
  })
  .catch((error) => {
    console.log(`An error occured try to connect to the DB ${error}`);
  });
