
import dotenv from 'dotenv'
import connectDb from "../db/index.js";
import { app } from './app.js';
dotenv.config({path:'.env'})

// const app=express();
// (async()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`,{
//             useNewUrlParser: true,
//   useUnifiedTopology: true,
//   family: 4
//         })
//         app.on("error",(error)=>{
//             console.log(`ERROR IN LISTENING PORT:${process.env.PORT}`);
//             throw error;
//         })
//         app.listen(process.env.PORT,()=>{
//             console.log("Server runing on port:",process.env.PORT)
//         })
//         mongoose.connection.on('connected',()=>{console.log("connected to database")})
//     } catch (error) {
//         console.log("Error in connection ",process.env.MONGODB_URI);
//     }
// })()

connectDb().then((data)=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server running on port${process.env.PORT}`)
    })
}).catch((error)=>{
console.log(error)
}

)