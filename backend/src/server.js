import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import uploadRoutes from "./routes/fileUploadRoutes.js";
import userRoutes from "./routes/UserRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import adminRoutes from "./routes/adminRoutes.js";
import cors from 'cors';


dotenv.config();
import path from "path"
const app = express();
import dbConnect from "./lib/dbConnect.js";
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // if you ever post form data

app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,                
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With']
}));


app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/fileUpload",uploadRoutes);
app.use("/api/payments",paymentRoutes);//for initial stages lets just have verify payment and enroll thing . not anything else . 
app.use("/api/admin",adminRoutes);
// app.use("api")

dbConnect();
const PORT = process.env.PORT || 5002;
const __dirname = path.resolve();


  app.use(express.static(path.join(__dirname,"../frontend/dist")));
  app.get("/{*any}",(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend/dist/index.html"));
  })

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});