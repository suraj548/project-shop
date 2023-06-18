const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const router = require('./router/router')
var cors = require('cors');

var corsOptions={
    origin:'http://localhost:4200',
    //optionsSucessStatus:200,
    methods:"GET,POST,PUT,DELETE"
}

app.use(cors(corsOptions))

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}))
 
app.use('/route', router)


mongoose.connect('mongodb://localhost:27017/u',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> console.log("Database Connected"))
.catch((err) => console.log(err))

mongoose.Promise = global.Promise;

app.listen(3000, ()=>{
    console.log('Listening on 3000')
});