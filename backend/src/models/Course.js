import { strict } from "assert";
import mongoose from "mongoose";


const lessonSchema = new mongoose.Schema({
  courseId:{
    type:String,
    required:true,
  },
  title: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    default:""
  },

  notesUrl:{
    type:String,
    default:""
  },

  quizId:{
    type:String,
    default:""//representing not having one 
  },

  description: {
    type: String,
    default:""
  },

  duration: {
    type: String,
    default:"1" //say in hours
  },

});


const newCourseSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    photoUrl:{
        type:String,
        default:""
    },
    instructor:{
      type:mongoose.Types.ObjectId,
      ref:'User',
      required:true
    },
    description:{
        type:String,
        required:true
    },
    skills:{
        type:[String]
    },
    lessons:{
        type:[String],//array of ids
        default:[]//will be added one by one . 
    },
    price:{
        type:Number,
        required:true
    },
    totalEnrolledStudents:{
      type:Number,
      default:0
    },
    duration:{
      type:Number,
      default:0
    }
});

const Course = mongoose.model('Course',newCourseSchema);
const Lesson = mongoose.model('Lesson',lessonSchema);
// export default mongoose.model('Lesson',lessonSchema);
export {Course,Lesson}
