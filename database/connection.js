import mongoose from "mongoose"
import MongoClient from 'mongodb';

const connectDB = async () => {
    return mongoose.connect(process.env.URI , {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000, 
    })
    .then(
        console.log("database connected successfully !")
    ).catch(e => {
        console.log(`Error connecting database` , e)
    })
}
export default connectDB