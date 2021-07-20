const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    date: {
        type: Object,
    },
    type: {
        type: String,
        required: true,
    },
    category: {
        type: String,
    },
    amount: {
        type: Number,
    },
    description: {
        type: String,
    },
})

module.exports = mongoose.model('transaction', transactionSchema)