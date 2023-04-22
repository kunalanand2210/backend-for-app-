const multer = require("multer");
const User = require('../models/users');
const fs = require('fs');

const upload = multer({
    storage: multer.diskStorage({
        destination: async (req, file, cb) => {
            const userid = req.params.id;
            const _id = (await User.data.findById(userid)).userId;
           
            const name = (await User.users.findById(_id).select('-password -tokens -email -datas -_id -mobile -createdAt -updatedAt -__v')).name; 
            
            var dir = './public/uploads/'+name+_id;
            if (!fs.existsSync(dir)){
              fs.mkdirSync(dir);
              cb(null, dir);
            
            }else
            {
                cb(null, dir);
            }
            
        },
        filename: (req, file, cb) => {
            
            cb(null,`${Date.now()}--${file.originalname}`);
        }
    })
});

const uploadwarranty = multer({
    storage: multer.diskStorage({
        destination: async (req, file, cb) => {
           
            const name = 'registerwarrantyimages';
            var dir = './public/uploads/'+name;
            if (!fs.existsSync(dir)){
              fs.mkdirSync(dir);
              cb(null, dir);
            
            }else
            {
                cb(null, dir);
            }
            
        },
        filename: (req, file, cb) => {
            
            cb(null,`${Date.now()}--${file.originalname}`);
        }
    })
});

module.exports = {
    upload, uploadwarranty
}