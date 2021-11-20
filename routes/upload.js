const express = require('express');
const { uploadImage, uploadContactImage } = require('../controller/uploadHandler');
const router = express.Router()
const multer = require('multer')
const upload = multer()



router.post('/profile', upload.single('image') ,uploadImage)
router.post('/contact-image', uploadContactImage)

module.exports = router;