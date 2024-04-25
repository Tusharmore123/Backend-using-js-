import mongoose,{Schema,timestamps} from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'
const playlistSchema=Schema({
    name:{
        type:String,
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    videos:[{
        type:Schema.Types.ObjectId,
        ref:'Video',
        required:true
    }]
},{timestamps})
mongoose.plugin(mongooseAggregatePaginate)

export const Playlist =mongoose.model('Playlist',playlistSchema)