const express = require("express");
const router = express.Router();

const {signup, login, getUserData, editUser} = require("./controller/userController");

const checkIsUndefined = require("./helpers/checkIsUndefined");
const checkIsEmptyFunc = require("./helpers/checkIsEmptyFunc");
const checkIsStrongPasswordFunc = require("./helpers/checkIsStrongPasswordFunc");
const jwtMiddleware = require("../utils/jwtMiddleware")

const{
    checkIsEmailFunc,
    checkIsAlphaFunc,
    checkIsAlphanumericFunc,
}= require("./helpers/authMiddleware")

router.get("/get-user-data", jwtMiddleware, getUserData)

router.post(
    "/signup", 
    checkIsUndefined,
    checkIsEmptyFunc,
    checkIsStrongPasswordFunc,
    checkIsEmailFunc,
    checkIsAlphaFunc,
    checkIsAlphanumericFunc,
    signup);

router.post(
    "/login", 
    checkIsUndefined, 
    checkIsEmptyFunc, 
    login);

router.put(
    "/update-profile",
    jwtMiddleware,
    editUser);

module.exports = router;