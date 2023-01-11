var jwt = require('jsonwebtoken');

var jwtAuth = (req, resp, next)=>{
    var token = req.headers.authorization;
    token = token.split(' ')[1];
    jwt.verify(token,process.env.SECRETKEY,function(err,decoded){
        if(err){
            resp.send({message:'Invalid Token'})
        }else{
           next();
        }
    })
}

module.exports = {
    jwtAuth
}