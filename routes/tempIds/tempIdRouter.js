const express = require("express")
const router = express.Router();
const {changePassword} = require("./Controller/tempIdController")

router.put("/password-change", changePassword)

module.exports = router;