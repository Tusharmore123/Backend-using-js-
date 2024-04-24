import mongoose,{Schema,timestamps} from 'mongoose'


const subscriberSchema=Schema({
subscriber:{
    type:Schema.Types.ObjectId,
    required:true
},
channel:{
    type:Schema.Types.ObjectId,
    required:true
}
},{timestamps:true})



export const Subscriber=mongoose.model('Subscriber',subscriberSchema)