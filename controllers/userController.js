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
    let { name, mobile, password, code } = req.body;
    const email = req.body.email.toLowerCase();
    var responseType = {
        message: 'ok',
    }
    let data = await Users.otp.findOne({ email: email, code: code });
    if (data) {
        let currenttime = new Date().getTime();
        let diff = data.expiresIn - currenttime;
        if (diff < 0) {
            responseType.message = "token expire";
            responseType.status = 400;
        } else {
            let data = new Users.users({
                name,
                email,
                mobile,
                password
            });
        
            let response = await data.save();
            responseType.message = 'Register Succesfully ';
            responseType.status = 200;
        }


    } else {
        responseType.message = "code or email is not correct";
        responseType.status = 404;

    }
    resp.status(responseType.status).send(responseType);
}

const userLogin = async (req, resp) => {
    if (!req.body.email || !req.body.password) {
        resp.status(301).json({ message: 'Error! please enter email and password' });
    }
    const email = req.body.email.toLowerCase();
    let user = await Users.users.findOne({ email: email });

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

// google login add data and login //

const googleLogin = async (req, resp) => {
    let { name, email } = req.body;

    let user = await Users.users.findOne({ email: email });

    var responseType = {
        message: 'ok'
    }
    if (user) {

        let myToken = await user.getAuthToken();
        responseType.message = 'Login Successfully';
        responseType.token = myToken;
        responseType.status = 200;

    } else {
        let data = new Users.users({
            name,
            email
        });
        let response = await data.save();
        let myToken = await data.getAuthToken();
        responseType.message = 'Register and Login Succesfully ';
        responseType.token = myToken;
        responseType.status = 201;
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



// mobile OTP related api here 

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
// Email OTP related api here

const mailer = async (email, otp) => {
    let status = 200;

    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        secure: false,
        auth: {
            user: process.env.OTPSENDACCOUNT,
            pass: process.env.ACCOUNTPASS
        }
    });

    const mailOptions = {
        from: process.env.OTPSENDACCOUNT,
        to: email,
        subject: 'Otp verify message',
        text: `Your One time password (otp) is : ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);

        } else {
            console.log('Email sent: ' + info.response);

        }
    });

}



const emailOtpsend = async (req, resp) => {
    if (!req.body.email) {
        resp.status(301).json({ message: 'Error! please enter email' });
    }

    let responseType = {
        message: 'ok'
    }
    const email = req.body.email.toLowerCase();
    let data = await Users.users.findOne({ email: email });
    const otp = Math.floor(1000 + Math.random() * 9000);
    if (data) {

        let otpdata = new Users.otp({
            email: email,
            code: otp,
            expiresIn: new Date().getTime() + 300 * 1000
        });
        let response = await otpdata.save();
        mailer(email, otp);
        responseType.message = 'Success';
        responseType.status = 200;
        responseType.result = response;


    } else {
        responseType.message = 'Email is not registered';
        responseType.status = 400;

    }


    resp.status(200).send(responseType);
}

const registerOtp = async (req, resp) => {

    let responseType = {
        message: 'ok'
    }
    const email = req.body.email.toLowerCase();
    let data = await Users.users.findOne({ email: email });
    const otp = Math.floor(1000 + Math.random() * 9000);
    if (data) {
        responseType.message = 'Email is already registered';
        responseType.status = 400;

    } else {

        let otpdata = new Users.otp({
            email: email,
            code: otp,
            expiresIn: new Date().getTime() + 300 * 1000
        });
        let response = await otpdata.save();
        mailer(email, otp);
        responseType.message = 'Success';
        responseType.status = 200;
        responseType.result = response;
    }

    resp.status(responseType.status).send(responseType);
}



const changepassword = async (req, resp) => {
    if (!req.body.code || !req.body.password || !req.body.email) {
        resp.status(301).json({ message: 'Error! please enter email , password and Otp' });
    }

    let responseType = {
        message: 'ok'
    }
    const password = req.body.password;
    const code = req.body.code;
    const email = req.body.email.toLowerCase();
    let data = await Users.otp.findOne({ email: email, code: code });
    if (data) {
        let currenttime = new Date().getTime();
        let diff = data.expiresIn - currenttime;
        if (diff < 0) {
            responseType.message = "token expire";
            responseType.status = 400;
        } else {
            let user = await Users.users.findOne({ email: email });
            user.password = password;
            user.save();
            responseType.message = "password change succesfully";
            responseType.status = 200;
        }


    } else {
        responseType.message = "code or email is not correct";
        responseType.status = 404;

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

    if (isAuthentic) {
        let data = await Users.paymentdetail.findOneAndUpdate({ userId: _id }, { paymentid: razorpay_payment_id, orderid: razorpay_order_id, status: 'payment completed' });
        let response = await data.save();

        console.log(response);

        responseType.message = 'payment succesfully verified';
        responseType.status = 200;
        responseType.result = isAuthentic;
    } else {
        responseType.message = 'payment is not Correct ';
        responseType.status = 400;
        responseType.result = isAuthentic;

    }

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
    paymentVerification,
    emailOtpsend,
    changepassword,
    googleLogin,
    registerOtp

}