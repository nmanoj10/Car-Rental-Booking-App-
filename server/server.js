import express from 'express';
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from './routes/userRouter.js';
import ownerRouter from './routes/ownerRoutes.js';
//initalize express app
const app = express();

await connectDB();

//middleware
//It allows your backend API to be accessed from other domains
app.use(cors());
//Express automatically parses the JSON string into a JavaScript object,
app.use(express.json());
//first route
app.get("/", (req, res) => {
  res.send("Welcome to the Car Rental API");
}); 


app.use('/api/user',userRouter)
app.use('/api/owner',ownerRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`);
})