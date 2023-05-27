const Admins = require('../models/admins');
const Users = require('../models/users');

var bcrypt = require('bcryptjs');

const adminAdd = async (req, resp) => {
    let { name, email, password, usertype, brand } = req.body;

    if (!email || !password || !name || !usertype || !brand) {
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
                usertype,
                brand,
                status: 'active'
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

        const adminstatus = user.status === 'active';


        if (match) {
            if (!adminstatus) {
                responseType.message = 'Not Active User';
                responseType.status = 400;
            }
            else {
                responseType.message = 'Login Successfully';
                responseType.token = myToken;
                responseType.status = 200;
            }

        } else {
            responseType.message = 'Wrong Password';
            responseType.status = 401;
        }
    } else {
        responseType.message = 'Invalid Email id';
        responseType.status = 404;
    }
    resp.status(responseType.status).json(responseType);


}

const adminEdit = async (req, resp) => {

    const id = req.params.id;
    const { name, email, password, usertype, brand, status } = req.body;
    const responseType = {
        message: "ok noot",
    };

    if (!name || !email || !password || !usertype || !brand) {
        responseType.message = 'Some Field is missing';
        responseType.status = 403;

    } else {
        const result = await Admins.findById(id);

        result.name = name;
        result.email = email;
        result.password = password;
        result.usertype = usertype;
        result.brand = brand;
        result.status = status;
        result.save();
        responseType.message = 'Data succesfully update';
        responseType.status = 200;
    }



    return resp.status(responseType.status).send(responseType);


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

const adminListId = async (req, resp) => {

    const id = req.params.id;
    let data = await Admins.findById(id);

    var responseType = {
        message: 'ok',

    }
    if (data) {
        responseType.message = 'Get list succesfull';
        responseType.status = 200;
        responseType.result = data;
    } else {
        responseType.message = 'Not Found Any Data ';
        responseType.status = 400;
    }
    resp.status(responseType.status).send(responseType);
}

const adminServiceList = async (req, resp) => {

    const brand = req.params.brand;
    var responseType = {
        message: 'ok',
    }

    if (brand === 'all') {
        let data = await Users.data.find({ complaint_type: 'Service' });
        responseType.message = 'Get list succesfull';
        responseType.status = 200;
        responseType.result = data;
    }
    else {
        let data = await Users.data.find({ complaint_type: 'Service', brand: brand });
        responseType.message = 'Get list succesfull';
        responseType.status = 200;
        responseType.result = data;
    }

    resp.status(200).send(responseType);
}

const adminInstallationList = async (req, resp) => {

    let data = await Users.data.find({ complaint_type: 'Installation' });
    // let data = await Users.data.find({ complaint_type: 'Service' });
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

const serviceStatus = async (req, res) => {
    const id = req.params.id;
   
   
    const { status, adminid } = req.body;
    var responseType = {
        message: 'ok',
    }
    const result = await Users.data.findById(id);

    if (result) {
        result.status = status;
        result.doneby = adminid;
        result.save();
        responseType.status = 200;
        responseType.message = 'update succesfully';

    } else {
        responseType.status = 400;
        responseType.message = 'service not Found';
    }
  
    res.status(200).send(responseType);
}

const paymentdetailUpdate = async (req, resp) => {
    try {
        const data = req.body;

        const extravalue = (res) => {
            let price = 0;
            let data = res;
            let datalength = data.length;
            for (let j = 0; j < datalength; j++) {

                price = price + parseInt(data[j].price);
            }

            return price
        }

        const _id = req.params.id;

        var responseType = {
            message: 'ok'
        }
        const user = await Users.data.findById(_id);

        const userdetail = await Users.users.findById(data.userid);

        paymentdetail = new Users.paymentdetail({ payments: data.formValues, userId: data.userid, serviceId: _id, name: userdetail.name, email: userdetail.email, address: user.address, state: user.state, city: user.city, pincode: user.pincode, status: 'payment incompleted', totalpay: extravalue(data.formValues) });
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
    const service = await Users.paymentdetail.findById(_id);

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
    else {
        responseType.message = 'Error';
        responseType.status = 400;
    }
    resp.status(responseType.status).send(responseType);
}


const adminServiceRecord = async (req, resp) => {
    const adminUserid = req.params.id;
    const data = await Users.data.find({doneby : adminUserid});
    if(!data){
        resp.status(400).send({status:400,message:'Data Not Found'});
    }
    else{
        resp.status(200).send({status:200,message:'Data Successfull',data});
    }
   
}


const warrantyData = async (req, resp) => {
   
    const data = await Users.warrantyRegister.find();
    
    if(!data){
        resp.status(400).send({status:400,message:'Data Not Found'});
    }
    else{
        resp.status(200).send({status:200,message:'Data Successfull',data});
    }
   
}



module.exports = {
    adminLogin,
    adminAdd,
    adminEdit,
    adminList, adminListId,
    adminServiceList,
    adminInstallationList,
    paymentdetailUpdate,
    serviceDetails,
    paymentDelete,
    dashboardData,
    paymentList,
    paymentDetail, 
    serviceStatus,
    adminServiceRecord,
    warrantyData

}