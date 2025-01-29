import express from "express"
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { connectDb } from "./lib/db.js"
import authRoutes from './routes/auth.rout.js'
import messageauthRoutes from './routes/message.rout.js'
// import { app,server } from "./lib/socket.js"


import path from 'path'


const app=express()




dotenv.config()

const PORT =process.env.PORT
const __dirname=path.resolve()

// middel ware
app.use(express.json())
app.use(cookieParser());
app.use(cors({


    origin: 'http://localhost:5173',
    credentials:true
}))

app.use('/api/auth',authRoutes)
app.use('/api/messages',messageauthRoutes)


if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }


app.listen(PORT,()=>{
    console.log(`server is runing in the port number ${PORT}`);
    connectDb()
   
})