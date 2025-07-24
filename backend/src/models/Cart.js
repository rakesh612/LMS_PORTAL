import mongoose from "mongoose";

const CartSchema = mongoose.Schema({
    userId:{
        type:String,
        required:true 
    },
    courses:{
        type:[String],
        default:[]
    }
}
)

export default mongoose.model('Cart',CartSchema);