import { generateToken } from '../lib/utils.js'
import User  from '../model/user.model.js'
import bcrypt from 'bcryptjs'
import cloudinary from '../lib/cloudinary.js'

export const signup= async (req,res)=>{
    const {fullName,email,password}=req.body
   try{

       if(!fullName || !email || !password){
        return res.status(400).json({message:"All field are required"})
       }
       // hash password
       if(password.length<6){
        return res.status(400).json({message:"password must be at latest 6 charchters"})
       }

       const user= await User.findOne({email})

       if(user) return res.status(400).json({message:"Email alredy exists"})
       
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await  bcrypt.hash(password,salt)

        const newUser= new User({
            fullName,
            email,
            password:hashedPassword
        })

        if(newUser){
            // generate jwt token here
            generateToken(newUser._id,res)
            await newUser.save()

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic  
            })


        }else{
            res.status(400).json({message:"invalid user data"})
        }


   }catch(err){
          console.log('error in singup controller',err.message)
          res.status(500).json({message:'internal server error'})
   }
}

export const login= async(req,res)=>{
   const {email,password}=req.body
    try{
        const user= await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"inavalid credential"})
        }

         const isPassword=await bcrypt.compare(password,user.password)
         if(!isPassword){
         return res.status(400).json({message:"inavalid Password"})

        }

        generateToken(user._id,res)

        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
        })

    }catch(err){
       console.log(`error in loggin controller ${err.message}`);
       res.status(500).json({message:'internal server error'})
       
    }
   
}

export const logout=(req,res)=>{
   try{
    res.cookie('jwt',"",{maxAge:0})
    res.status(200).json({message:"logged out successfully"})

   }catch(err){
    console.log(`error in logout controller ${err.message}`);
    res.status(500).json({message:'internal server error'})

   }
}

export const updateProfile= async(req,res)=>{
    try{
        const {profilePic}=req.body
        const userId=req.user._id

      if(!profilePic){
        return res.status(400).json({message:'profile pic is required'})
      }
      const uploadResponse =await cloudinary.uploader.upload(profilePic)

      const updatedUser= await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})

      res.status(200).json(updatedUser)

    }catch(err){
    console.log(`error in update profile: ,${err}`);
    res.status(500).json({message:"internal server error"})

    }


}
export const checkAuth =async(req,res)=>{
    try{
        res.status(200).json(req.user)

    }catch(err){
        console.log('error in checkAuth controller',err.message);
        res.status(500).json({message:"internal server error"})
        

    }
}