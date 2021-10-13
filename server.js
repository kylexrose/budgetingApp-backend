require("dotenv").config();

const mongoose = require("mongoose");
console.log(process.env.NODE_ENV);
const app = require("./app");

const port = 8080;

mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server connected on ${port}`);
      console.log("MongoDB Connected");
    });
  })
  .catch((e) => {
    console.log(e);
  });
