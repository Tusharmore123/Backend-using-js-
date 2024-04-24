import mongoose, { Schema } from "mongoose";
import aggregatePaginate from   'mongoose-aggregate-paginate-v2'
const videoSchema= new Schema({
    videFile: {
        required: true,
        type: String
    },
    title: {
        required: true,
        type: String
    },

    description: {
        required: true,
        type: String
    },
    duration: {
        type: Number,
        required: true
    },
    thumbNail: {
        type: String,
        required: true
    },
    views: {
        type: number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }



}, { timestamps: true })

videoSchema.plugin(aggregatePaginate)

export const Video=mongoose.model('Video',videoSchema)