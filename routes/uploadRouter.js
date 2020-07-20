const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
}

const upload = multer({
    storage: storage,
    fileFilter: imageFileFilter
});

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req,res, next) => {
    res.statusCode= 403;
    res.end('GET operation is not supported in /imageUpload');

})
.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req,res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req,res, next) => {
    res.statusCode= 403;
    res.end('PUT operation is not supported in /imageUpload');

})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req,res, next) => {
    res.statusCode= 403;
    res.end('DELETE operation is not supported in /dishes');

})


module.exports = uploadRouter;