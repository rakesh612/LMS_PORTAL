import mongoose from "mongoose";

const DiscussionSchema = mongoose.Schema({
    courseId:{
        type:String,//we can use ref but there is no need for doing it ... generally . no time improvement.
        required:true
    },
    messages:{
        type:[{
            userId:String,
            username:String,
            message:String,
            createdAt:{
                type:Date,
                default:Date.now()
            }
        }],
        default:[]
    }
});
export default mongoose.model('Discussion',DiscussionSchema);
