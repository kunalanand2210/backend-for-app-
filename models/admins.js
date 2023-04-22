const mongoose = require('mongoose')
const conn = require('../config/db')
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');





var adminSchema = new mongoose.Schema({
   
    name:String,
    email:String,
    usertype:String,
    brand:String,
    status:String,
    password:{
        type:String,
        select:true
    },
    tokens:[
        {
            token:{
                type:String,
                require:true
            }
        }
    ],
    
},{
    timestamps:true
})





adminSchema.pre('save',function(next){   
var salt = bcrypt.genSaltSync(10);
if(this.password && this.isModified('password')){
    this.password =  bcrypt.hashSync(this.password, salt);
}
 next();
})

adminSchema.methods.getAuthToken = async function(data){
    let params = {
        id:this._id,
        email:this.email,
        role:this.usertype,
        brand:this.brand,
    }

    var tokenValue = jwt.sign(params, process.env.SECRETKEY,{expiresIn:'300000s'});
    this.tokens = this.tokens.concat({token:tokenValue})
    await this.save();
    return tokenValue;
}

let admins = conn.model('admins',adminSchema)
module.exports = admins;