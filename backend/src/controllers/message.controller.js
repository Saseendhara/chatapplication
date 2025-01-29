import User from "../model/user.model.js"
import Message from '../model/message.model.js'
import cloudinary from '../lib/cloudinary.js'

export const getUsersForSidebar= async(req,res)=>{
    try{
        const loggedInUserId=req.user._id
        const fillteredUser= await User.find({_id:{$ne:loggedInUserId}}).select('-password')
        res.status(200).json(fillteredUser)
    }catch(err){
        console.error('error in getUsersForSidebar',err.message);
        res.status(500).json({err:"internal server error"})
        

    }

}
export const getMessages=async(req,res)=>{
    try{
        const {id:userToChatId}=req.params
        const myId=req.user._id;

        const message=await Message.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        })

        res.status(200).json(message)

    }catch(err){
        console.error('error in getMessages controller',err.message);
        res.status(500).json({err:"internal server error"})

    }
}
export const sendMessage=async(req,res)=>{
    try{
        const {text,image}=req.body;
        const {id:receiverId}=req.params
        const senderId=req.user._id

        let imageUrl;
        if(image){
            // upload base64 image to cloudinary
            const uploadResponse=await cloudinary.uploader.upload(image)
            imageUrl=uploadResponse.secure_url
        }

        const newMessage=new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })
        await newMessage.save()

        // 

        res.status(201).json(newMessage)

    }catch(err){
        console.error('error in sendMessage controller',err.message);
        res.status(500).json({err:"internal server error"})

    }
}