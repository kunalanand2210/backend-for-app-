const Users = require('../models/users');



var bcrypt = require('bcryptjs');


const userList = async (req, resp) => {
    let data = await Users.users.find();
    resp.json(data);
}

const userAdd = async (req, resp) => {
    let { name, email, mobile, password } = req.body;
    if (!email || !password || !name || !mobile) {
        resp.status(400).json({ message: 'Error! please enter email ,password, name , mobile', status: 400 });


    } else{
        let user = await Users.users.findOne({ email: req.body.email });
        var responseType = {
            message: 'ok'
        } 
        if (user) {
            responseType.message = 'Error! Email is already in use.';
            responseType.status = 403;
        }else{
            let data = new Users.users({
                name,
                // email : req.body.email, we also call this way if name is different 
                email,
                mobile,
                password
            });
            let response = await data.save();
            responseType.message = 'Register Succesfully ';
            responseType.status = 200;
        }
        resp.status(responseType.status).json(responseType);
    }
   
}

const userLogin = async (req, resp) => {
    if (!req.body.email || !req.body.password) {
        resp.status(301).json({ message: 'Error! please enter email and password' });
    }
    let user = await Users.users.findOne({ email: req.body.email });

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

const userUpdate = async (req, resp) => {
    try {
        const { brand, product, customer_name, customer_mobile, customer_email, address, filedata  } = req.body;
        const _id = req.params.id;
        var responseType = {
            message: 'ok'
        }
        const user = await Users.users.findById(_id);


        data = new Users.data({ brand, product, customer_name, customer_mobile, customer_email, address, filedata,  userId: req.params.id })
        data_id = data._id;
        user.datas.push({ data: data_id });
        const response = await data.save();
        const result = await user.save();
        
        if(response){
            responseType.status =200;
        }
        resp.status(200).send(responseType);

    } catch (e) {
        resp.send(e);
    }


}







module.exports = {
    userList,
    userAdd,
    userLogin,
    userUpdate,
    

}