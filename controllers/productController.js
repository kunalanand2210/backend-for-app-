const Products = require('../models/products');
const Admins = require('../models/admins');
const Users = require('../models/users');

const brandAdd = async (req, resp) => {
    let { brandname } = req.body;
    var responseType = {
        message: 'ok',

    }
    let user = await Products.findOne({ name: brandname });
    if (user) {
        responseType.message = 'Error! brandname is already exists.';
        responseType.status = 403;
    } else {
        let data = new Products({
            name: brandname,
        });
        let response = await data.save()
        if (data) {
            responseType.message = 'new brand added Succesfully';
            responseType.status = 200;

        }
        else {
            responseType.message = 'Error';
            responseType.status = 400;
        }
    }


    resp.status(responseType.status).send(responseType);
}

const categoriesAdd = async (req, resp) => {
    let { brandname, categoryname } = req.body;
    var responseType = {
        message: 'ok',

    }
    let user = await Products.findOne({ name: brandname });


    if (user) {

        let category = user.categories.push({ name: categoryname });
        user.save();
        responseType.message = 'new Category added Succesfully';
        responseType.status = 200;
    } else {
        responseType.message = 'Error! brandname is not found';
        responseType.status = 403;
    }

    resp.status(responseType.status).send(responseType);
}

const seriesAdd = async (req, resp) => {
    let { brandname, categoryname, series } = req.body;
    var responseType = {
        message: 'ok',

    }
    let user = await Products.findOne({ name: brandname });
    if (user) {
        let arr = user.categories;

        for (let i = 0; i < arr.length; i++) {
            if (categoryname === arr[i].name) {
                arr[i].category.push({ name: series });
                user.save();
                responseType.message = 'new Series added Succesfully';
                responseType.status = 200;
            } else {
                responseType.message = 'Error! Category is not found ';
                responseType.status = 400;
            }
        }



    } else {
        responseType.message = 'Error! brandname is not found';
        responseType.status = 403;
    }

    resp.status(responseType.status).send(responseType);
}

const getProduct = async (req, resp) => {
    var responseType = {
        message: 'ok',
    }
    let user = await Products.find();
    if (user) {
        responseType.message = 'founded data';
        responseType.status = 200;
        responseType.result = user;
    } else {
        responseType.message = 'Nothing is  found';
        responseType.status = 403;
    }


    resp.status(responseType.status).send(responseType);
}

module.exports = {
    brandAdd,
    categoriesAdd,
    seriesAdd,
    getProduct
}