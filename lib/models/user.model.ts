import mongoose from "mongoose";
import { boolean } from "zod";

const userSchema=new mongoose.Schema({
    id:{type:String, required:true},
    username:{type:String, required:true, unique:true},
    name:{type:String, required:true},
    image: String,
    bio: String,
    knots:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Thread'
        }
    ],
    onboarded:{
        type:Boolean,
        default:false
    },
    comunities:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'community'
        }
    ]
})

const User=mongoose.models.User || mongoose.model('User', userSchema)

export default User