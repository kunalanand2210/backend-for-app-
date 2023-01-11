const mongoose = require('mongoose')
const conn = require('../config/db')

var userSchema = new mongoose.Schema({
   
    brand:String,
    product:String,
    customername:String,
    customer_mobile:String,
    customer_email:String,
    address:String,
    invoice:String,
    
})

let userdata = conn.model('userdata',userSchema)
module.exports = userdata;