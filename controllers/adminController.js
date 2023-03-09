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
        } else {
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
    if (data) {
        responseType.message = 'Get list succesfull';
        responseType.status = 200;
        responseType.result = data;
    }
    resp.status(200).send(responseType);
}

const adminServiceList = async (req, resp) => {

    let data = await Users.data.find({ complaint_type: 'Service' });
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

const adminInstallationList = async (req, resp) => {

    let data = await Users.data.find({ complaint_type: 'Installation' });
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

const serviceDetails = async (req, resp) => {

    const _id = req.params.id;
    let data = await Users.data.findById(_id);

    var responseType = {
        message: 'ok',
    }
    if (data) {
        responseType.message = 'Get detail succesfull';
        responseType.status = 200;
        responseType.result = data;
    } else {
        responseType.message = 'something went wrong';
        responseType.status = 400;
        responseType.result = data;
    }
    resp.status(responseType.status).send(responseType);
}


const paymentdetailUpdate = async (req, resp) => {
    try {
        const data = req.body;

        const _id = req.params.id;

        var responseType = {
            message: 'ok'
        }
        const user = await Users.data.findById(_id);

        const userdetail = await Users.users.findById(data.userid);

        paymentdetail = new Users.paymentdetail({ payments: data.formValues, userId: data.userid, serviceId: _id, name: userdetail.name, email: userdetail.email, status: 'incompleted' });
        paymentdetail_id = paymentdetail._id;
        user.payment_details.push({ payment_detailid: paymentdetail_id });
        const response = await paymentdetail.save();
        const result = await user.save();

        if (response) {
            responseType.status = 200;
            resp.status(200).send(responseType);
        }


    } catch (e) {
        resp.send(e);
    }


}

const paymentDelete = async (req, resp) => {
    const _id = req.params.id
    service = await Users.paymentdetail.findById(_id);

    const serviceid = service.serviceId;
    const payment_detailid = service._id.valueOf();

    const user = await Users.data.findById(serviceid);
    user.payment_details.pull({ payment_detailid: payment_detailid });
    user.save();
    console.log(service, user);
    Users.paymentdetail.findByIdAndDelete(req.params.id, (err, Admins) => {
        if (err) return resp.status(404).send(err);
        const response = {
            message: "payment data successfully deleted",
            status: 200
        };
        return resp.status(200).send(response);
    });

}

// api controller for dashboard page (for some quick information)

const dashboardData = async (req, resp) => {
    let totalAppUser = await Users.users.find();
    let totalAppUserLenght = totalAppUser.length;

    let totalServiceData = await Users.data.find({ complaint_type: 'Service' });
    let totalServiceDataLenght = totalServiceData.length;

    let totalInstallData = await Users.data.find({ complaint_type: 'Installation' });
    let totalInstallDataLenght = totalInstallData.length;

    let respData = {
        totalAppUserLenght, totalServiceDataLenght, totalInstallDataLenght, totalServiceData
    }

    var responseType = {
        message: 'ok',
    }

    if (totalAppUser) {
        responseType.message = 'Get detail succesfull';
        responseType.status = 200;
        responseType.result = respData;
    }
    else {
        responseType.message = 'error , data not found';
        responseType.status = 400;
    }

    resp.status(responseType.status).send(responseType);


}

const paymentList = async (req, resp) => {

    let data = await Users.paymentdetail.find();
    let userData = await Users.users.find();

    var responseType = {
        message: 'ok',

    }
    if (data) {
        responseType.message = 'Get list succesfull';
        responseType.status = 200;
        responseType.result = data;
    }
    else {
        responseType.message = 'Error';
        responseType.status = 400;
    }
    resp.status(200).send(responseType);
}


const paymentDetail = async (req, resp) => {
    const _id = req.params.id
    let data = await Users.paymentdetail.findById(_id);
    
  console.log(data);
    var responseType = {
        message: 'ok',

    }
    if (data) {
        responseType.message = 'Get list succesfull';
        responseType.status = 200;
        responseType.result = data;
    }
    else{
        responseType.message = 'Error';
        responseType.status = 400;
    }
    resp.status(responseType.status).send(responseType);
}






module.exports = {
    adminLogin,
    adminAdd,
    adminDelete,
    adminList,
    adminServiceList,
    adminInstallationList,
    paymentdetailUpdate,
    serviceDetails,
    paymentDelete,
    dashboardData,
    paymentList,
    paymentDetail
}