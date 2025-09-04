import imagekit from "../config/imageKit.js";
import Car from "../models/Car.js";
import User from "../models/user.js"
import fs from "fs";

//api to change role
export const changeRoleToOwner = async (req, res) => {
  try {
    const {_id} = req.user;
   await User.findBYIdAndUpdate(_id,{role : "owner"})
    res.json({ success: true, message: "Now you can list cars"});
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

//api to list car
export const addCar = async(req,res)=>{
  try{
    const  {_id} = req.user;
    let car = JSON.parse(req.body.carData)
    const imageFile = req.file;//multer package -> image file in request
    //upload image to imagekit
    const fileBuffer = fs.readFileSync(imageFile.path)
   const response =  await imagekit.upload({
      file:fileBuffer,
      fileName : imageFile.originalname,
      folder : '/cars'
    })
    //optimizrion throught imagekit url transformation
    var optimizedImageUrl = imagekit.url({
        path : response.filePath,
        transformation :[
          {width:'1280'},//width resizing
          {quality:'auto'},//auto compression
          {format:'webp'}//convert to modern format
        ]
    });

    const image = optimizedImageUrl;
    await Car.create({...car,owner:_id,image})
    res.json({success:true , message : "car added"})


  }catch(error){
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
}