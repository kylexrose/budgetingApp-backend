const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    mobileNumber:{
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    username: {
        type: String,
        unique: true,
    },
    expenses: [{type:mongoose.Schema.ObjectId, ref: "expense"}],
    incomes: [{type:mongoose.Schema.ObjectId, ref: "income"}]
})

module.exports = mongoose.model('user', userSchema);