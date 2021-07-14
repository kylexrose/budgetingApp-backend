const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    description: {
        type: String,
    },
    amount: {
        type: String,
    },
    date: {
        type: Date,
        default: () => Date.now(),
    },
})

module.exports = mongoose.model('expense', expenseSchema)