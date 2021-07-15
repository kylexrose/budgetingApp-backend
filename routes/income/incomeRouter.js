const express = require("express");
const router = express.Router();
const {
    getAllIncomes,
    editIncomeById,
    createNewIncome,
    deleteIncomeById,
}=require("./controller/incomeController")

router.get("/get-all-incomes", getAllIncomes);

router.post("/create-new-income", createNewIncome);

router.put("/edit-income/:id", editIncomeById);

router.delete("/delete-income/:id", deleteIncomeById);

module.exports = router;