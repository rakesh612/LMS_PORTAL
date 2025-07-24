import jwt from 'jsonwebtoken';
import User from '../../models/user.js';
import cookieParser from 'cookie-parser';

const protectRoute = async (req,res,next) => {
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Not authorized, no token"
            })
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({
                success:false,
                message:"Not authorized, token failed"
            })
        }
        const user = await User.findById(decoded.id);
        req.user = user;
        console.log(user);
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Server error",
            error:error.message
        })
    }
}
const instructorAccess = async(req,res,next)=>{
    try {
        const user = req.user;
        if(!user){
            return res.status(401).json({message:"you are not logged in "});
        }
        console.log(user.role);
        if(user.role==="instructor"&&user.isVerified){
            return next();
        }
        return res.status(403).json({message:"you have to be atleast instructor to access this route "});
    } catch (e) {
       return res.status(500).json({
            success:false,
            message:"Server error",
            error:e.message
        })
    }
}
const adminaccess = async(req,res,next)=>{
    try {
        const user = req.user;
        const role = user.role;
        if(role==="admin"){
            return next();
        }
        return res.status(401).json({success:false,message:"you are not authorised to access this route sorry"});
    } catch (e) {
        return res.status(500).json({
            success:false,
            message:"Server error",
            error:e.message
        })
    }
}
const enrollmentAccess = async(req,res,next)=>{
    try {
        const user = req.user;
        const courseId = req.body.courseId;
        const lessonidx = req.body.lessonidx;
        if(!user.enrolledCourses.includes(courseId) && lessonidx>1){
            req.enrolled = false;
        }else{
            req.enrolled = true;
        }
        return next();
    } catch (e) {
        return res.status(500).json({
            success:false,
            message:"Server error",
            error:e.message
        })
    }
}
export {adminaccess}
export {protectRoute}
export {instructorAccess}
export {enrollmentAccess}
