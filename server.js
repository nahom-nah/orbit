const express = require("express")
const dotenv = require('dotenv')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const AppError = require('./utils/AppError')
const errorHandler = require('./controller/errorController')
const authRoute = require('./routes/auth')
const uploadRoute = require('./routes/upload')
const cookieParser = require('cookie-parser');
const app = express()
const cloudinary = require('cloudinary').v2

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))
app.use(cors({credentials:true, origin:true}))
dotenv.config({path:path.join(__dirname,'/.env')})

app.use('/auth',authRoute)
app.use('/upload',uploadRoute)


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
  

app.all('*',(req, res,next)=>{
    next(new AppError("can't find the requested url on this server",404))
})

app.use(errorHandler)

const port = process.env.PORT || 9000;

app.listen(port,()=>{
    console.log(`server is up and running on port ${port}`)
})