import mongoose from "mongoose";
import { Lesson } from "./Course.js";

const newQuizSchema = mongoose.Schema({
    lessonId:{
        type:String,
        required:true,
    },
    theoryQuestions:{
        type:[String],
    },
    theoryAnswers:{
        type:[String],
        default:[]
    },
    Mcqs:{
        type:[String]
    },
    McqOpts:{
        type:[[String]]
    },
    McqAnswers:{
        type:[Number],
        default:[]
    }
});
export default mongoose.model('Quiz',newQuizSchema);
