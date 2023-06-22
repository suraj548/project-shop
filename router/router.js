const express = require('express');
const router = express.Router();
const Data = require('../models/bills')
const moment = require('moment');
 
router.post('/bills', async (req, res) => {
    const Fname = String(req.body.Fname)
    const objectsArray = req.body.objectsArray;
    const objectsArray_1 = req.body.objectsArray_1;

    const processedData = objectsArray.map((obj)=>{
      const numbers = obj.numbers
      const item_name = String(obj.item_name)
      const item_price = Number(obj.item_price)
      const item_total_weight = numbers.reduce((acc, curr) => acc + curr, 0)
      const item_total = item_total_weight*item_price;
      const item_no_bags = numbers.length

      return {
        item_name: item_name,
        numbers: numbers,
        item_total_weight: item_total_weight,
        item_price: item_price,
        item_no_bags: item_no_bags,
        item_total: item_total
      };

    })


        
    const processedData_1 = objectsArray_1.map((obj)=>{
      const item_name = String(obj.item_name)
      const item_price = Number(obj.item_price)
      const item_no_bags = Number(obj.item_no_bags)
      const item_total = item_no_bags*item_price;

      return {
        item_name: item_name,
        item_price: item_price,
        item_no_bags: item_no_bags,
        item_total: item_total
      };

    })

    // console.log(processedData)
    // console.log(processedData_1)
    //process.exit()
      //const totalWeigt = processedData.reduce((acc,curr) => acc + curr.item_no_bags, 0)
    
      const weightTotal = processedData.reduce((acc, curr) => acc + curr.item_total, 0);
      const totalWeightBags = processedData.reduce((acc, curr) => acc + curr.item_no_bags, 0);

      const packetTotal = processedData_1.reduce((acc,curr) => acc + curr.item_total, 0);
      const totalPacketsBags = processedData_1.reduce((acc, curr) => acc + curr.item_no_bags, 0);
      
      const grandTotal = packetTotal+weightTotal
      const totalBags = totalWeightBags+totalPacketsBags


      // console.log(weightTotal,packetTotal,grandTotal)
      // console.log(totalWeightBags,totalPacketsBags,totalBags)
      // process.exit()


      const labour = totalBags*6
      const commision = grandTotal*0.08
      const pay = grandTotal-labour-commision
      
      const lastEntry = await Data.findOne({}, {}, { sort: { _id: -1 } });
      
      // const bill_no="20230620001"
      const bill_no=generateTokenNumber(lastEntry.bill_no)
      // var newrecord = new Data({bill_no:bill_no,Fname:Fname,objectsArray:processedData,totalWeigt:totalWeigt,totalBags:totalBags,grandTotal: grandTotal,labour:labour,commision:commision,pay:pay})
      var newrecord = new Data({bill_no:bill_no,Fname:Fname,objectsArray:processedData,objectsArray_1:processedData_1,totalBags:totalBags,grandTotal: grandTotal,labour:labour,commision:commision,pay:pay})
      
      console.log(newrecord)
      //process.exit()

      newrecord.save().then(()=>{
        res.status(200).send(bill_no)
      }).catch((error)=>{
        res.status(404).send("error")
      })


    });

router.get("/bills",
    async (req,res)=>{
      
      const bill_no = req.query.bill_no;
  
      if (!bill_no) {
        res.status(400).json({ error: 'Missing _id parameter' });
        return;
      }

    try{
      const query = { bill_no: bill_no };
      const result = await Data.findOne(query);
   
      if (!result) {
        res.status(404).json({ error: 'Document not found' });
        return;
      }
      res.status(200).json(result);

  }catch(error){

    console.error('Error retrieving document:', error);
    res.status(500).json({ error: 'An error occurred' });
  
  }

  })


router.get("/all-bills",
  async (req,res)=>{
      Data.find().then((all)=>{
          res.status(200).json(all)
      }).catch((error)=>{
          res.status(404).send("Error fetching data")
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