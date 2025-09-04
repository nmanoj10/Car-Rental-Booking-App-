import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";


//generate jwt token 
const generateToken = (userId)=>{
  const payload = {userId};
  return jwt.sign(payload,process.env.JWT_SECRET)
}


//user registration
export const registerUser = async(req,res)=>{
  try{

    const {name,email,password} = req.body
  if(!name || !email || !password || password.length < 8){
    return res.json({success:false,message:"fill all the fields"})
    }

    const userExists = await User.findOne({email})
    if(userExists){
      return res.json({success:false,message:"User already exists"})
    }

    //encrypt

  const hashPassword = await bcrypt.hash(password,10)
    const user = await User.create({name,email,password:hashPassword})

   //token response after user logined

    const token = generateToken(user._id.toString())
    res.json({success:true,token})

  }catch(error){
    console.log(error.message);
    return res.json({success:false,message:error.message})
  }
}

// login user
export const loginUser = async(req,res)=>{
  try{
      const {email,password}= req.body;
      const user = await User.findOne({email})
      if(!user){
        return res.json({success:false,message:"user not found"})
      }

      const isMatch = await bcrypt.compare(password,user.password)
      if(!isMatch){
        return res.json({success:false,message:"invalid credentials"})
      }
      const token = generateToken(user._id.toString())
      res.json({success:true,token})
  }catch(error){
    console.log(error.message);
    return res.json({success:false,message:error.message})
  }
}

//get user data using jwt token 
export const getUserData = async(req, res)=>{
  try{
    const {user} = req;
    res.json({success:true,user})
  }catch(error){
    console.log(error.message);
    return res.json({success:false,message:error.message})
  }
}