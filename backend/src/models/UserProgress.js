import mongoose  from "mongoose";
const progressSchema = mongoose.Schema({
    courseId:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    progress:{
        type:[[Number]],
        default:[]//we will have to add three indices to each index like this as default [[0 -1 0],[0,-1,0],[0,-1,0]]  the main problem is we dont have the exact number here ... and we want random accesss to the array how.. we have to handle it while creation...
        //ok we can do a thing . when the user gives the progress update and  the size of this array is not enough we just push 0 -1 0 to it until we dont reach our lesson . thats it .
    }
}
)

export default mongoose.model('UserProgress',progressSchema);
