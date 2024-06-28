const express = require('express');
const router = express.Router();
const multer=require('multer')
const authentication=require("../middlewares/auth_middleware")

const upload = multer({
    storage: multer.memoryStorage(), 
    limits: {
        fileSize: 1024 * 1024 * 10, 
        fieldSize: 25 * 1024 * 1024 
    }
});



const profileController=require('../controllers/profile-controller')

router.post('/profile',authentication,upload.array('files', 6),profileController.profile)


module.exports = router;