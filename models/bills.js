const mongoose = require('mongoose');


const billSchema = new mongoose.Schema({
    numbers: [Number],
    price: Number,
    total: Number,
    no_bags: Number,
    commision: Number,
    labour: Number,
    pay: Number,
    Fname: String,
    item: String
})



module.exports = mongoose.model("bill", billSchema, "bill");