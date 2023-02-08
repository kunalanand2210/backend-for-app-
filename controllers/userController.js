const Users = require('../models/users');



var bcrypt = require('bcryptjs');


const userList = async (req, resp) => {
    let data = await Users.users.find();
    resp.json(data);
}

const userData = async (req, resp) => {
    const _id = req.params.id;
    let data = await Users.users.findById(_id);
    var responseType = {
        message: 'ok',
        
    }
    if(data){
        responseType.message = 'Get userData succesfull';
                responseType.status = 200;
                responseType.result = data;
    }
    resp.status(200).send(responseType);
}

const userAdd = async (req, resp) => {
    let { name, email, mobile, password } = req.body;
    if (!email || !password || !name || !mobile) {
        resp.status(400).json({ message: 'Error! please enter email ,password, name , mobile', status: 400 });


    } else {
        let user = await Users.users.findOne({ email: req.body.email });
        var responseType = {
            message: 'ok'
        }
        if (user) {
            responseType.message = 'Error! Email is already in use.';
            responseType.status = 403;
        } else {
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

        const data = req.files;
        console.log(data);
        const { firstname, lastname, mobile, altmobile, email, address, city, state, pincode, brand, productname, complaint_type, warranty, purchase_date, set_serialno, query } = req.body;
        console.log(req.body);
        const _id = req.params.id;
        const user = await Users.users.findById(_id);
        var responseType = {
            message: 'ok'
        }

        let imagedata = new Users.data({
            invoice: data['invoice'],
            issue_image: data['issue_image'],
            under_warranty: data['under_warranty'],
            firstname: firstname,
            lastname: lastname,
            mobile: mobile,
            altmobile: altmobile,
            email: email,
            address: address, city: city, state: state, pincode: pincode,
            brand: brand,
            productname: productname,
            complaint_type: complaint_type,
            warranty: warranty,
            purchase_date: purchase_date,
            set_serialno: set_serialno,
            query: query,
            userId:_id,
        })

        const imagedata_id = imagedata._id;
        user.datas.push({ data: imagedata_id });
        const response = await imagedata.save();
        const result = await user.save();

        if (response) {
            responseType.status = 200;
        }
        resp.status(200).send(responseType);

    } catch (e) {
        resp.send(e);
    }



}

const userServiceList = async (req, resp) => {
    const _id = req.params.id;
    let data = await Users.data.find({userId : _id});
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
    userList,
    userAdd,
    userLogin,
    userUpdate,
    userData,
    userServiceList
}