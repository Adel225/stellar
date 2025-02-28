import mongoose from "mongoose"
import MongoClient from 'mongodb';

const connectDB = async () => {
    return mongoose.connect(process.env.URI).then(
        console.log("database connected successfully !")
    ).catch(e => {
        console.log(`Error connecting database` , e)
    })
}
export default connectDB