const Admins = require('../models/admins');
const Users = require('../models/users');



var bcrypt = require('bcryptjs');



const adminAdd = async (req, resp) => {
    let { name, email, password, usertype } = req.body;
    
        if (!email || !password || !name || !usertype) {
            resp.status(400).json({ message: 'Error! please enter email and password', status: 400 });
    
    
        } else {
            let user = await Admins.findOne({ email: req.body.email });
            var responseType = {
                message: 'ok'
            } 
            if (user) {
                responseType.message = 'Error! Email is already in use.';
                responseType.status = 403;
            }else{
                let data = new Admins({
                    name,
                    email,
                    password,
                    usertype
                });
                let response = await data.save()
                // let myToken = await data.getAuthToken();
                responseType.message = 'Register Succesfully ';
                responseType.status = 200;
            }
            resp.status(responseType.status).json(responseType);
        }
   

}


const adminLogin = async (req, resp) => {
    if (!req.body.email || !req.body.password) {
        resp.status(301).json({ message: 'Error! please enter email and password' });
    }
    let user = await Admins.findOne({ email: req.body.email });

    var responseType = {
        message: 'ok'
    }
    if (user) {
        var match = await bcrypt.compare(req.body.password, user.password);
        let myToken = await user.getAuthToken();

        if (match) {
            responseType.message = 'Login Successfully';
            responseType.token = myToken;
            responseType.status = 200;
        } else {
            responseType.message = 'Wrong Password';
            responseType.status = 401;
        }
    } else {
        responseType.message = 'Invalid Email id';
        responseType.status = 404;
    }
    resp.status(responseType.status).json({ message: 'ok', data: responseType });


}

const adminDelete = async (req, resp) => {

    Admins.findByIdAndDelete(req.params.id, (err, Admins) => {
        if (err) return resp.status(500).send(err);
        const response = {
            message: "User successfully deleted",
            status: 200
        };
        return resp.status(200).send(response);
    });

}

const adminList = async (req, resp) => {

    let data = await Admins.find().select('-password -tokens');
    var responseType = {
        message: 'ok',
        
    }
    if(data){
        responseType.message = 'Get list succesfull';
                responseType.status = 200;
                responseType.result = data;
    }
    resp.status(200).send(responseType);
}

const adminServiceList = async (req, resp) => {

    let data = await Users.data.find();
    var responseType = {
        message: 'ok',
        
    }
    if(data){
        responseType.message = 'Get list succesfull';
                responseType.status = 200;
                responseType.result = data;
    }
    resp.status(200).send(responseType);
}




module.exports = {
    adminLogin,
    adminAdd,
    adminDelete,
    adminList,
    adminServiceList
}