const express = require('express');
const router = express.Router();
const Data = require('../models/bills')
const moment = require('moment');

router.post('/bills', async (req, res) => {
    const Fname = String(req.body.Fname)
    const objectsArray = req.body.objectsArray;
    
    const processedData = objectsArray.map((obj)=>{
      const numbers = obj.numbers
      const item = String(obj.item)
      const price = Number(obj.price)
      const total = numbers.reduce((acc, curr) => acc + curr, 0)*price;
      const no_bags = numbers.length

      return {
        item: item,
        numbers: numbers,
        price: price,
        no_bags: no_bags,
        total: total
      };

    })
    
      const grandTotal = processedData.reduce((acc, curr) => acc + curr.total, 0);
      const totalBags = processedData.reduce((acc, curr) => acc + curr.no_bags, 0);
    
      const labour = totalBags*6
      const commision = grandTotal*0.08
      const pay = grandTotal-labour-commision
      
      const lastEntry = await Data.findOne({}, {}, { sort: { _id: -1 } });

      const token_no=generateTokenNumber(lastEntry.token_no)
      var newrecord = new Data({token_no:token_no,Fname:Fname,objectsArray:processedData,total: grandTotal,labour:labour,commision:commision,pay:pay})
      
      newrecord.save().then(()=>{
        res.status(200).send(token_no)
      }).catch((error)=>{
        res.status(404).send("error")
      })


    });

router.get("/bills",
    async (req,res)=>{
        Data.find().then((all)=>{

            res.status(200).json(all)
    
        }).catch((error)=>{
    
            res.status(404).send("Error")
    
        })
    })


function generateTokenNumber(last_token) {
    const currentDate = moment().format('YYYYMMDD');
      
    let lastTokenNumber = last_token; 
    
    if (lastTokenNumber.substr(0, 8) === currentDate) {
      const lastNumber = parseInt(lastTokenNumber.substr(8), 10); 
      const newNumber = lastNumber + 1; 
      const newTokenNumber = currentDate + padNumber(newNumber, 4); 
      return newTokenNumber;
    } 
    else {
      const newTokenNumber = currentDate + '0001'; 
      return newTokenNumber;
    }
  }


function padNumber(number, length) {
  let str = String(number);
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
}
module.exports = router;