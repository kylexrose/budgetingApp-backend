const mongoose = require("mongoose");

const tempIdSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
})

module.exports = mongoose.model('TempId', tempIdSchema);