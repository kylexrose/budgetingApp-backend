const express = require("express");
const router = express.Router();
const {
    getAllExpenses,
    createNewExpense,
    editExpenseById,
    deleteExpenseById,
} = require("./controller/expenseController");

router.get("/get-all-expenses", getAllExpenses);

router.post("/create-new-expense", createNewExpense);

router.put("/edit-expense/:id", editExpenseById);

router.delete("/delete-expense/:id", deleteExpenseById);

module.exports = router;