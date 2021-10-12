const express = require("express");
const router = express.Router();
const jwtMiddleware = require("../utils/jwtMiddleware");
const {
    getAllCategories,
    createNewCategory,
    editCategoryById,
    deleteCategoryById
} = require("./Controller/categoryController");

router.get("/get-all-categories", jwtMiddleware, getAllCategories);

router.post("/create-new-category", jwtMiddleware, createNewCategory);

router.put("/edit-category/:id", jwtMiddleware, editCategoryById);

router.delete("/delete-category/:id", jwtMiddleware, deleteCategoryById);

module.exports = router;