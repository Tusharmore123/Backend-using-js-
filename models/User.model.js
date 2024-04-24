import mongoose,{Schema} from 'mongoose'
import bcrypt from 'bcrypt'

import jwt from 'jsonwebtoken'
 const userschema=new Schema({
    name:{
        type:String,
        required:true,
        index:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    fullName:{
        type:String,
        required:true,
        index:true,
        
        lowercase:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },

    password:{
        type:String,
        required:true
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:'Video'
        }
    ],
    avatar:{
        type:String,
        required:true
    },
    coverImage:{
        type:String
 },
 refreshToken:{
    type:String
 }
 },{timestamps:true})

 userschema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password=bcrypt.hash(this.password,10);
    next()
 })

 userschema.methods.generateAcessToken=function(){
    return jwt.sign({
        _id:this._id,
        name:this.name,
        email:this.email,
        fullname:this.fullname
    },process.env.ACCESS_TOKEN,
    {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    )
 }
 userschema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this._id,
      
    },process.env.REFRESH_TOKEN,
    {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    )
 }


 userschema.methods.validatePassword=async function(password){
    return bcrypt.compare(password,this.password)
 }





 export const User=mongoose.model('User',userschema)