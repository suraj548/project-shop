const express = require('express');
const router = express.Router();
const Data = require('../models/bills')


router.post('/bills', (req, res) => {
    const numbers = req.body.numbers.split(',').map(Number);
    const price = Number(req.body.price);
    const Fname = String(req.body.Fname)
    const item = String(req.body.item)

    const no_bags=numbers.length

    const totalWeight = numbers.reduce((acc, curr) => acc + curr, 0);
    const total = totalWeight * price;
    const commision = total*0.08
    const labour = no_bags*6
    const pay = total-labour-commision

    var newrecord = new Data({item:item,Fname:Fname,numbers:numbers,price:price,total:total,no_bags:no_bags,commision:commision,labour:labour,pay:pay})
        newrecord.save().then(()=>{

            res.status(200).send(newrecord)
    
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


module.exports = router;