import mongoose from "mongoose";

const knotSchema=new mongoose.Schema({
  text:{type:String, required:true},
  author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  community:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Community'
  },
  createdAt:{
    type: Date,
    default: Date.now
  }, 
  parentId:{
    type:String
  },
  children:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Knot'
    }
  ]
})

const Knot=mongoose.models.Knot || mongoose.model('Knot', knotSchema)

export default Knot