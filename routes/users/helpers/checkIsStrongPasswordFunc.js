const { checkIsStrongPassword } = require("../../utils/authMethods");

function checkIsStrongPasswordFunc(req, res, next) {
  //let errorObj = {};

  const { errorObj } = res.locals;//pulls the error obj from locals

  if (!checkIsStrongPassword(req.body.password)) {//checks if the password matches "strong" criteria
    errorObj.weakPassword =
      "Password must include 1 lowercase, 1 uppercase, 1 special character, 1 number, and a length of 8";
  }

  next();//calls next function in the request
}

module.exports = checkIsStrongPasswordFunc;
