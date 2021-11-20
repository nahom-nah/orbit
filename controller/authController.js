const catchAsync = require('./../utils/catchAsync')
const Joi = require('joi')
const selectAccount = require('./../helpers/selectAccount')
const AppError = require('../utils/AppError')
const bcrypt = require('bcrypt')
const request = require('./../helpers/request')
const {insertAccount} = require('./../helpers/queries')
const jwt = require('jsonwebtoken')


const createToken =  async ( user, defaultRole, defaultAllowedRoles) =>{
    return await jwt.sign({ 
      [process.env.JWT_CLAIMS_NAMESPACE]: {
        "x-hasura-allowed-roles": defaultAllowedRoles,
        "x-hasura-default-role": defaultRole,
        "x-hasura-user-id": user.id,
      }
    },process.env.JWT_SECRET,{ expiresIn: process.env.EXPIRES_IN, issuer:'myhost', subject:user.username})
}

exports.signup = catchAsync(async(req, res, next) =>{
   const schema = Joi.object({
       username: Joi.string().min(3).max(30).required(),
       email: Joi.string().email().required(),
       phone_no: Joi.string().length(10).pattern(/^[0-9]+$/),
       password: Joi.string().required(),
       confirmPassword: Joi.ref('password'),
   })

   const { error, value } = schema.validate(req.body)

   if(error){
     return next(new AppError(error.message, 400))
   }
 
   const selectedAccount = await selectAccount(value)
   
   if(selectedAccount){
       return next(new AppError('account already exist!, sign in to access your account',400))
   }

   if(value.password !== value.confirmPassword){
       return next(new AppError('password doesn\'t match'))
   }

   const hashedPass = await bcrypt.hash(value.password, 10)


   const account = await request(insertAccount,{"insertAccount":{
       email:value.email,
       password: hashedPass,
       phone_no:value.phone_no,
       username: value.username
   }})

if(!account){
    return next( new AppError('error inserting new Account!',400))
}

 
const default_role = process.env.DEFAULT_USER_ROLE;
const default_allowed_roles = process.env.DEFAULT_ALLOWED_USER_ROLES.split(' ');

 const token = await createToken(account.insert_orbit_user.returning[0], default_role, default_allowed_roles)
  
 if(!token){
     return next(new AppError('something went wrong when token is generated',400))
 }

 res.status(200).json({
       status: 'success',
       data:{
           token,
           user: account.insert_orbit_user.returning[0]
       }
   })
})

exports.login =  catchAsync( async (req, res, next) =>{
    const schema = Joi.object({
     
        email: Joi.string().email().required(),
      
        password: Joi.string().required(),
      
    })
 
    const { error, value } = schema.validate(req.body)

    if(error){
        return next(new AppError(error.message, 400))
      }
    
      const selectedAccount = await selectAccount(value)
       const checkPass = await  bcrypt.compare(value.password, selectedAccount.password)

       if(!selectedAccount || !checkPass){
           return next(new AppError('incorrect username or passwrd'),400)
       }

       const default_role = process.env.DEFAULT_USER_ROLE;
        const default_allowed_roles = process.env.DEFAULT_ALLOWED_USER_ROLES.split(' ');

 const token = await createToken(selectedAccount, default_role, default_allowed_roles)
  
 res.cookie('token', token)
      res.status(200).json({
          status:"success",
          data:{
              token,
              user: selectedAccount
          }
      })
 
})

exports.logout = catchAsync( async (req, res, next)=>{
    console.log('logout controller')
    next()
})