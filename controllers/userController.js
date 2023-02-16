const Users = require('../models/users');

var bcrypt = require('bcryptjs');

const crypto = require("crypto");

const instance = require('../files/razorPayinstance');

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
    if (data) {
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
            userId: _id,
        })

        const imagedata_id = imagedata._id;
        user.datas.push({ data: imagedata_id });
        const response = await imagedata.save();
        const result = await user.save();

        if (response) {
            responseType.status = 200;
            responseType.id = imagedata_id;
        }
        resp.status(200).send(responseType);

    } catch (e) {
        resp.send(e);
    }



}

const userServiceList = async (req, resp) => {
    const _id = req.params.id;
    let data = await Users.data.find({ userId: _id, complaint_type: 'Service' });
    var responseType = {
        message: 'ok',

    }
    if (data) {
        responseType.message = 'Get list succesfull';
        responseType.status = 200;
        responseType.result = data;

    }
    resp.status(200).send(responseType);
}

const userInstallationList = async (req, resp) => {
    const _id = req.params.id;
    let data = await Users.data.find({ userId: _id, complaint_type: 'Installation' });
    var responseType = {
        message: 'ok',

    }
    if (data) {
        responseType.message = 'Get list succesfull';
        responseType.status = 200;
        responseType.result = data;

    }
    resp.status(200).send(responseType);
}

const userPaymentList = async (req, resp) => {
    const _id = req.params.id;

    let data = await Users.paymentdetail.find({ userId: _id });
    var responseType = {
        message: 'ok',

    }
    if (data) {
        responseType.message = 'Get list succesfull';
        responseType.status = 200;
        responseType.result = data;

    }
    resp.status(200).send(responseType);

}



// OTP related api here 

const sendOtp = async (req, resp) => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log(otp);
    const phoneNumber = req.body.phoneNumber;
    var responseType = {
        message: 'ok',

    }
    resp.status(200).send(responseType);
}


const verifyOtp = async (req, resp) => {
    const otp = req.body.otp;
    const phoneNumber = req.body.phoneNumber;
    var responseType = {
        message: 'ok',

    }
    resp.status(200).send(responseType);
}

// payment apis //

const checkOut = async (req, resp) => {
    var responseType = {
        message: 'ok',

    }
    var options = {
        amount: Number(req.body.amount * 100),
        currency: "INR",
        // receipt: "order_rcptid_11"
    };
    const order = await instance.orders.create(options);

    if (order) {
        responseType.message = 'Get data succesfull';
        responseType.status = 200;
        responseType.result = order;

    }
    resp.status(200).send(responseType);
};

const paymentVerification = async (req, resp) => {
    const _id = req.params.id;
    const user = await Users.paymentdetail.findById(_id);
    var responseType = {
        message: 'ok',

    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body.data;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    var expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if(isAuthentic){
        user.push( {paymentid : razorpay_payment_id, orderid : razorpay_order_id });
        responseType.message = 'payment succesfully verified';
        responseType.status = 200;
        responseType.result = isAuthentic;
    }else{
        responseType.message = 'payment is not Correct ';
        responseType.status = 400;
        responseType.result = isAuthentic;
        
    }
  console.log(user);
    resp.status(200).send(responseType);
};

module.exports = {
    userList,
    userAdd,
    userLogin,
    userUpdate,
    userData,
    userServiceList,
    userInstallationList,
    userPaymentList,
    sendOtp,
    verifyOtp,
    checkOut,
    paymentVerification

}