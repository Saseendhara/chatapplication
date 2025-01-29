import {v2 as cloudinary}from 'cloudinary'

import { config } from 'dotenv'

config()

cloudinary.config({
    cloud_name: process.env.CLOUDUINARY_CLOUD_NAME,
    api_key:process.env.CLOUDUINARY_API_KEY,
    api_secret:process.env.CLOUDUINARY_API_SECRET
})

export default  cloudinary;