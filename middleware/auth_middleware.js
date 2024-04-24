import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiErrorHandler.js";
import { asynchandler } from "../utils/asycnhandler.js";
import { User } from "../models/User.model.js";
export const  verifyJwt=asynchandler( async(req,res,next)=> {
    try {
        const token =req.cookies?.accessToken||req.headers('Authorization')?.replace('Bearer',"")
        
        if (!token){
            throw new ApiError("Unauthorized request",401)
        }
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN);
        if(!decodedToken){
            throw new ApiError('Inavlid token',401)
        }
        const user=await User.findById(decodedToken._id).select("-password -refreshToken")
        req.user=user
        next()
    } catch (error) {
        throw new ApiError("Unauthorized User",401)
        
    }
})