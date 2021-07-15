const express = require("express");
const router = express.Router();

const {signup, login, editUser} = require("./controller/userController");

const checkIsUndefined = require("./helpers/checkIsUndefined");
const checkIsEmptyFunc = require("./helpers/checkIsEmptyFunc");
const checkIsStrongPasswordFunc = require("./helpers/checkIsStrongPasswordFunc");

const{
    checkIsEmailFunc,
    checkIsAlphaFunc,
    checkIsAlphanumericFunc,
}= require("./helpers/authMiddleware")

router.post(
    "/signup", 
    checkIsUndefined,
    checkIsEmptyFunc,
    checkIsStrongPasswordFunc,
    checkIsEmailFunc,
    checkIsAlphaFunc,
    checkIsAlphanumericFunc,
    signup);

router.post("/login", login);

router.put(
    "/update-profile/:username", 
    checkIsUndefined,
    checkIsEmptyFunc,
    checkIsStrongPasswordFunc,
    checkIsEmailFunc,
    checkIsAlphaFunc,
    checkIsAlphanumericFunc,
    editUser);

module.exports = router;