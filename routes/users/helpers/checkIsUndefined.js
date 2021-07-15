function checkIsUndefined(req, res, next) {//checks if there is post data in the request
  if (Object.keys(req.body).length === 0) {
    return res.status(500).json({ message: "Please fill out the form" });
  } else {
    let errorObj = {};//initialized the error obj variable
    res.locals.errorObj = errorObj;//stores the variable in the locals
    next();
  }
}

module.exports = checkIsUndefined;
