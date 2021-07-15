const express = require("express");
const router = express.Router();

const {signup, login, editUser} = require("./controller/userController");

//validator checks here

router.post("/signup", signup);

router.post("/login", login);

router.put("/update-profile/:username", editUser);

module.exports = router;