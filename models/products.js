const mongoose = require('mongoose');
const conn = require('../config/db');

var productSchema = new mongoose.Schema({
    name:String,
    categories:[
        {
            name:String,
            category:[
                {
                    name:{
                        type:String,
                    }
                }
            ]
        }
    ]
})

let productadd = conn.model('product',productSchema);

module.exports = productadd;