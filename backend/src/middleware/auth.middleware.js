import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

export const protectRoute= async(req,res,next)=>{
    try{
        const token=req.cookies.jwt
        if(!token){
            return res.status(401).json({message:"Unauthorizer - No Token Provided"})

        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET)

        if(!decoded){
            return res.status(401).json({message:"unauthorizer - Inavild Token"})
        }

        const user= await User.findById(decoded.userId).select('-password')

        if(!user){
            return res.status(404).json({message:"user not found"})
        }

        req.user=user
        next()

    }catch(err){
        console.log(`error in protectRoute middleWare: ${err.message}`);
        res.status(500).json({message:"internal server error"})
        

    }

}