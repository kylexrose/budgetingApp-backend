const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
    description: {
        type: String,
    },
    category:{
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

module.exports = mongoose.model('income', incomeSchema)