import mongoose,{Schema,timestamps} from "mongoose"

const commentSchema=Schema({
content:{
    type:String,
    required:true
},
owner:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
},
video:{
    type:Schema.Types.ObjectId,
    ref:'Video',
    required:true
}
},{timestamps:true})

export const Comment=mongoose.model('Commment',commentSchema)