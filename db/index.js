import mongoose from 'mongoose'
import { dbName } from '../src/constants.js'
const connectDb=async()=>{
    try{

        const connectionInstance=await mongoose.connect('mongodb://localhost:27017/videotube',{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4, // Force IPv4
          });
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to MongoDB');
          });
        console.log(`Database Connected Successfully on port${process.env.PORT}`)
    }
    catch(error){
        console.log('ERROR IN DATABASE CONNECTION:',error)
        process.exit(1)
    }

}
// const temp=${process.env.MONGODB_URI}/${dbName}
export default connectDb