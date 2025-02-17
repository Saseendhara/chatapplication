import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";


const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/"

export  const useAuthStore= create((set)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIng:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],


    checkAuth:async()=>{
        try{
            const res= await axiosInstance.get("/auth/check")
            set({authUser:res.data})
        }catch(err){
            console.log('error in checkAuth:',err);
            
            set({authUser:null})
        } finally{
            set({isCheckingAuth:false})
        }
    },

    signup:async (data)=>{
        set({isSigningUp :true})
        try{
        const res = await axiosInstance.post('/auth/signup',data)
        set({authUser:res.data})
        toast.success('Account created successfully')

        }catch(error){
            toast.error(error.response.data.message)
        }
        finally{
            set({isSigningUp:false})
        }

    },

    login: async (data)=>{
        set({isloaggingIng:true})

        try{
            const res=await axiosInstance.post('/auth/login',data)
            set({authUser: res.data})
            toast.success("logged in successfully")
            
        } catch (error) {
            toast.error(error.response.data.message);
          } finally {
            set({ isLoggingIn: false });
          }
        },

    logout: async ()=>{
        try{
            await axiosInstance.post('/auth/logout')
            set({authUser:null})
            toast.success("logged out successfully")

        }catch(error){
            toast.error(error.response.data.message)

        }
    },
    
    updatProfile: async (data)=>{
        set({isUpdatingProfile:true})
        try{
            const res=await axiosInstance.put('/auth/update-profile',data)
            set({authUser: res.data})
            toast.success('profile updated successfully')

        }catch(error){
            console.log('error in update profile',error);
            toast.error(error.response.data.message)
            

        }finally{
            set({isUpdatingProfile:false})
        }

    },
   


}))