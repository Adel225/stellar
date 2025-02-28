import mongoose, { Schema, model } from "mongoose";


const userSchema = new Schema({
    userName : {
        type : String,
        required : true,
        unique : true,
        min: 5,
        max: 20
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true
    },
    nationalID : {
        type : String,
        required : true,
        unique : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true,
    },
    gender : {
        type : String,
        enum : ['male', 'female'],
        default :'male'
    },
    phone : {
        type : String,
        required : true,
        unique : true,
        min: 10,
        max: 10
    },
    isConfirmed : {
        type : Boolean,
        default : false
    },
    blocked : {
        type : Boolean,
        default : false
    },
    activationCode : {
        type : String,
    },
    secretKey : {
        type : String,
        default : null
    },
    publicKey : {
        type : String,
        default : null
    },
    country : {
        type : String,
        default : null
    }
},
{timestamps: true})

const userModel = mongoose.models.User || model("User" , userSchema);

export default userModel;