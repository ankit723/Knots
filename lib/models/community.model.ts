import mongoose from "mongoose";
import { boolean } from "zod";

const communitySchema=new mongoose.Schema({
    id:{type:String, required:true},
    username:{type:String, required:true, unique:true},
    name:{type:String, required:true},
    image: String,
    bio: String,
    createBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    knots:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Knot'
        }
    ],
    members:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ]
})

const Community=mongoose.models.Community || mongoose.model('Community', communitySchema)

export default Community