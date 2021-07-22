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
    password:{
        type: String,
    },
    transactions: [{type:mongoose.Schema.ObjectId, ref: "transaction"}],
    categories: [{type:mongoose.Schema.ObjectId, ref: "categories"}],
})

module.exports = mongoose.model('user', userSchema);