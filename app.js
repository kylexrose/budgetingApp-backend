
//Pull in the packages from express and morgan
const express = require("express");
const logger = require("morgan"); 
const cors = require("cors");  

//start an express app
const app = express();

const ErrorMessageHandlerClass = require("./routes/utils/ErrorMessageHandlerClass");
const errorController = require("./routes/utils/errorController");
const userRouter = require("./routes/users/userRouter");
const expenseRouter = require("./routes/expenses/expensesRouter");
const incomeRouter = require("./routes/income/incomeRouter");

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
app.use("/users", userRouter);
app.use("/expense", expenseRouter);
app.use("/income", incomeRouter)

app.all("*", function(req, res, next){
    next(new ErrorMessageHandlerClass(`Cannot find ${req.originalUrl} on this server! Check your URL`, 404))
})
app.use(errorController);

module.exports = app;
