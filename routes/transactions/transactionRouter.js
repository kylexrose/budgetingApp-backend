const express = require("express");
const router = express.Router();
const jwtMiddleware = require("../utils/jwtMiddleware");
const {
    getAllTransactions,
    createNewTransaction,
    editTransactionById,
    deleteTransactionById,
} = require("./controller/transactionController");

router.get("/get-transactions-by-month/:year/:month", jwtMiddleware, getAllTransactions);

router.post("/create-new-transaction", jwtMiddleware, createNewTransaction);

router.put("/edit-transaction/:id", jwtMiddleware, editTransactionById);

router.delete("/delete-transaction/:id", jwtMiddleware, deleteTransactionById);

module.exports = router;