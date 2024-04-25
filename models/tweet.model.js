import mongoose,{Schema,timestamps} from "mongoose"


const tweetSchema=Schema({
owner:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
},
content:{
    type:String,
    required:true
}
},{timestamps})

export const Tweet=mongoose.model('Tweet',tweetSchema)