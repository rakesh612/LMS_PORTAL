import mongoose from "mongoose";

const RequestSchema =  mongoose.Schema({
    instructorId:{
        type:String,
        required:true
    },
    resumeUrl:{
        type:String,
        required:true
    },
    idProofUrl:{
        type:String,
        required:true,
    }
});
export default mongoose.model('Request',RequestSchema);

//either we use this or we just can scan the array to get the unverified users directly from the db users ... we can do boht