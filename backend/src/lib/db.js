import mongoose from 'mongoose';


export const connectDb=async()=>{
    try{
     const conn=   await mongoose.connect(process.env.MONGODB_URI)
     console.log(`MongoDb Connected: ${conn.connection.host}`);
    }catch(err){
        console.log('mogodb connecting error',err); 
    }

}
