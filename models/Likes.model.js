import mongoose,{Schema,timestamps} from 'mongoose'


const likeSchema=mongoose.Schema({
comment:{
    type:Schema.Types.ObjectId,
    ref:'Comment'
},
owner:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
},
tweet:{
    type:Schema.Types.ObjectId,
    required:true,
    ref:'Tweet'
},
video:{
    type:Schema.Types.ObjectId,
    ref:'Video',
    required:true
}

})

export const Likes=mongoose.model('Like',likeSchema)