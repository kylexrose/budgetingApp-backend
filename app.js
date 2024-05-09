
//Pull in the packages from express and morgan
const express = require("express");
const logger = require("morgan"); 
const cors = require("cors");  

//start an express app
const app = express();

const ErrorMessageHandlerClass = require("./routes/utils/ErrorMessageHandlerClass");
const errorController = require("./routes/utils/errorController");
const userRouter = require("./routes/users/userRouter");
const transactionRouter = require("./routes/transactions/transactionRouter");
const categoryRouter = require("./routes/categories/categoryRouter");
// const mailjetRouter = require("./routes/Mailjet/Mailjet");
const tempRouter = require("./routes/tempIds/tempIdRouter")

//log the dev tools in the console
app.use(cors());
if (process.env.NODE_ENV === "development") {
    app.use(logger("dev"));
  }

app.use(express.json());

//parsing form data/incoming data
//specifying what type of post data is used
app.use(express.urlencoded({ extended: false }));

//route the url with /api/user to the userRouter file in the user folder
app.get('/', (req, res) =>{
  res.json({message: "Hello, World."})
})
app.use("/api/users", userRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/categories", categoryRouter)
// app.use("/api/mailjet", mailjetRouter)
app.use("/api/reset", tempRouter)

app.all("*", function(req, res, next){
    next(new ErrorMessageHandlerClass(`Cannot find ${req.originalUrl} on this server! Check your URL`, 404))
})
app.use(errorController);

module.exports = app;
