import mongoose from "mongoose";
import { boolean } from "zod";

const communitySchema=new mongoose.Schema({
    username:{type:String, required:true, unique:true},
    name:{type:String, required:true},
    image: String,
    bio: String,
    createdBy:{
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
    ],
    requests:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ]
})

const Community=mongoose.models.Community || mongoose.model('Community', communitySchema)

export default Community