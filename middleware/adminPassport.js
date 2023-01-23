var jwtStrategy = require('passport-jwt').Strategy;
var Extractjwt = require('passport-jwt').ExtractJwt;

var Admins = require('../models/admins');

module.exports = function(passport){
    let params ={
        secretOrKey : process.env.SECRETKEY,
        jwtFromRequest : Extractjwt.fromAuthHeaderAsBearerToken()
    };
    
    passport.use(
        new jwtStrategy(params, function(jwt_payload,next){
            let emailId = jwt_payload.email;
            Admins.findOne({email:emailId},function(err,user){
                if(err){
                    return next(err, false)
                }
                if(user){
                    next(null, user)
                }else{
                    next(null, false)
                }
            });
        })
    )
}