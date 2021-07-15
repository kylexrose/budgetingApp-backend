const jwt = require("jsonwebtoken");
async function checkJwtToken(req, res, next) {
  try {
    if (req.headers && req.headers.authorization) {
      let jwtToken = req.headers.authorization.slice(7);
      let decodedJwt = jwt.verify(jwtToken, process.env.PRIVATE_JWT_KEY);
      res.locals.decodedJwt = decodedJwt;
      next();

    } else {
      throw { message: "You Don't have permission! ", statusCode: 500 };
    }
  } catch (e) {
    //return next(e);
    console.log(e.message);
    console.log(e.code);
    res.status(e.statusCode).json({ message: e.message, error: e });
  }
}
module.exports = checkJwtToken;