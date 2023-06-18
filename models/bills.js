const mongoose = require('mongoose');
 
const billSchema = new mongoose.Schema({
    numbers: [Number],
    item: String,
    price: Number,
    total: Number,
    no_bags: Number
})

const billSchema2 = new mongoose.Schema({
    token_no: String,
    Fname: String,
    objectsArray: [billSchema],
    total: Number,
    labour: Number,
    commision: Number,
    pay: Number
})


module.exports = mongoose.model("bill", billSchema2, "bill");