import {Course,Lesson} from "../models/Course.js";
import User from "../models/user.js";
import Request from "../models/PendingRequests.js";
import mongoose from "mongoose";

export async function getIncome(req,res){
    try {
        let income = 0;
        const courses = await Course.find();
        for(let i=0;i<courses.length;i++){
            income += courses[i].totalEnrolledStudents * courses[i].price;
        }
        return res.status(200).json({success:true,message:"total income retrieved",income});
    } catch (e) {
        return res.status(500).json({success:false,message:"internal server error",income:-1});
    }
}


export async function  getNoOfInstructors(req,res) {
    try {
        const noOfInstructors = await User.countDocuments({role:"instructor"});
        return res.status(200).json({success:true,message:"fetched",noOfInstructors}) 
    } catch (e) {
        return res.status(500).json({success:false,message:"internal server error",noOfInstructors:-1});
    }
}

export async function getNoOfStudents(req,res) {
    try {
        const noOfStudents = await User.countDocuments({role:"user"});
        return res.status(200).json({success:true,message:"fetched",noOfStudents}) ;
    } catch (e) {
        return res.status(500).json({success:false,message:"internal server error",noOfStudents:-1});
    }
}
export async function getNoOfCourses(req,res){
    try {
        const noOfCourses = await Course.countDocuments();
        return res.status(200).json({success:true,message:"fetched",noOfCourses}) ;
    } catch (e) {
        return res.status(500).json({success:false,message:"internal server error",noOfCourses:-1});
    }
}
export async function getPendingRequests(req,res){
    try {
        const requests = await Request.find();
        const users = await User.find({_id:{$in:requests.map(request => request.instructorId)}});
        return res.status(200).json({success:true,message:"success",requests,users});
    } catch (e) {
          return res.status(500).json({success:false,message:"internalServerError",e});
    }
}

export async function verifyInstructor(req, res) {
    try {
      const admin = req.user;
      if (!admin) {
        return res.status(408).json({ message: 'Admin authentication required.' });
      }
      if (admin.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
      }
  
      const { requestId } = req.body;
      
      const request = await Request.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }
      const instructorId = request.instructorId;
      await Request.deleteMany({ instructorId });
  

      if (!mongoose.Types.ObjectId.isValid(instructorId)) {
        return res.status(400).json({ message: 'Invalid instructor ID' });
      }
  
      const instructor = await User.findByIdAndUpdate(
        instructorId,
        { isVerified: true },
        { new: true }
      );
  
      if (!instructor) {
        return res.status(404).json({ message: 'Instructor not found' });
      }
  
      console.info({
        action: 'verifyInstructor',
        by: admin._id,
        instructor: instructor._id
      });
  
      return res.status(200).json({
        success: true,
        message: 'Instructor successfully verified',
        instructor
      });
    } catch (error) {
      console.error('verifyInstructor error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
  
  export async function createAdmin(req, res) {
    try {
      const { name, email, password, role = 'admin' } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Please fill all fields.' });
      }
  
      if (await User.findOne({ email })) {
        return res.status(400).json({ success: false, message: 'Email already exists.' });
      }
  
      const hashed = await bcrypt.hash(password, 10);
      const newUser = await User.create({ name, email, password: hashed, role, isVerified: true });
  
      console.log(newUser);
      return res.status(201).json({
        success: true,
        message: 'Registered successfully.',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error', error });
    }
  }
  
  export async function rejectInstructor(req, res) {
    try {
      const instructor = await User.findById(req.body.instructorId);
      if (!instructor) {
        return res.status(200).json({ message: "Deleted already or didn't exist" });
      }
  
      const email = instructor.email;
      await Request.deleteOne({ instructorId: instructor._id });
      await User.findByIdAndDelete(instructor._id);
  
      const sent = await sendEmail(email, {
        subject: 'Regret from EduCore',
        html: `<h1>Rejected for some reason. You can definitely reapply.</h1>`,
      });
  
      return res.status(200).json({ success: true, message: "Instructor rejected" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, message: 'Internal server error', error: e });
    }
  }