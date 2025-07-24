import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    }
    ,
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["user","admin","instructor"],
        default:"user",
        required:true,
    }
    ,
    isVerified:{
        type:Boolean,
        default:false,
    },
    enrolledCourses:{
        type :[String],
        default:[]
    }
})

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
export {User}