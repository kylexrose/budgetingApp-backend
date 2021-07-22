const express = require("express");
const router = express.Router();
const jwtMiddleware = require("../utils/jwtMiddleware");
const {
    getAllCategories,
    createNewCategory,
} = require("./controller/categoryController");

router.get("/get-all-categories", jwtMiddleware, getAllCategories);

router.post("/create-new-category", jwtMiddleware, createNewCategory);

// router.put("/edit-transaction/:id", jwtMiddleware, editTransactionById);

// router.delete("/delete-transaction/:id", jwtMiddleware, deleteTransactionById);

module.exports = router;