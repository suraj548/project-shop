const mongoose = require('mongoose');
 
const billSchema0 = new mongoose.Schema({
    numbers: [Number],
    item_name: String,
    item_price: Number,
    item_total_weight: Number,
    item_total: Number,
    item_no_bags: Number
})

const billSchema1 = new mongoose.Schema({
    item_name: String,
    item_no_bags: Number,
    item_price: Number,
    item_total: Number
})

const billSchema2 = new mongoose.Schema({
    bill_no: String,
    Fname: String,
    objectsArray: [billSchema0],
    objectsArray_1: [billSchema1],
    totalBags: Number,
    grandTotal: Number,
    labour: Number,
    commision: Number,
    pay: Number
})


module.exports = mongoose.model("bill", billSchema2, "bill");