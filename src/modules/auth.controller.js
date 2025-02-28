import bcrypt,{ compareSync, hashSync } from "bcryptjs";
import userModel from "../../database/models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import crypto from 'crypto'
import  jwt  from "jsonwebtoken";
import tokenModel from "../../database/models/token.mode.js";
// import randomstring from "randomstring";
import { sendEmail } from "../../src/utils/sendEmails.js";
import * as StellarSdk from 'stellar-sdk';



export const signup = asyncHandler(async (req,res,next) => {
    const {userName,email,password,cPassword,phone,gender,nationalID,country} = req.body;
  
    const find = await userModel.findOne({"$or" : [{email} , {phone} , {userName}]});
    if (find?.email) {
        return next(new Error("Email exists !" , {cause : 401}))
    }
    else if (find?.userName) {
        return next(new Error("Username exists !" , {cause : 401}))
    }
    else if (find?.phone) {
        return next(new Error("phone exists !" , {cause : 401}))
    }
    else if (find?.nationalID) {
        return next(new Error("national ID exists !" , {cause : 401}))
    }
    else if (password !== cPassword) {
        return next(new Error("password mismatched with cPassword"));
    }

    const pair = StellarSdk.Keypair.random();
    const publicKey = pair.publicKey();
    const secretKey = pair.secret();
    
    if (process.env.STELLAR_NETWORK === 'TESTNET') {
        await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
    }

    const hashPassword = hashSync(password , Number(process.env.SALT_ROUND))
    const activationCode = crypto.randomBytes(64).toString('hex');
    const createUser = await userModel.create({
        email,
        nationalID,
        userName,
        password:hashPassword,
        phone,
        gender,
        publicKey,
        secretKey,
        activationCode, 
        country
    })
    
    const link = `http://localhost:3000/auth/confirmEmail/${activationCode}`
    const sent = await sendEmail({
        to:email,
        subject: "Confirm your email",
        html: `<a href="${link}">Confirm your email</a>`
    })


    if (sent) {
        return res.status(201).json({
            success:true,
            status:201,
            message: "User created successfully , review your gmail",
            lolz: createUser
            
        })
    } else {
        return res.status(400).json({
            success:false,
            status:400,
            message: "Something went wrong"
        })
    }
})

export const activateAccount = asyncHandler(async (req,res,next) => {
    const {activationCode} = req.params;
    const user = await userModel.findOneAndUpdate({activationCode} , {
        isConfirmed : true,
        $unset : {activationCode: 1}
    });
    if (!user) {
        return next(new Error("Invalid activation code", {cause : 401}))
    }
    return res.json("your account has been activated successfully , login now!");
})

export const login = asyncHandler(async (req,res,next) => {
    const {email,phone,userName,nationalID,password} = req.body;
    const find = await userModel.findOne({"$or" : [{email}, {phone}, {userName}, {nationalID}]})
    if (!find) {
        return next(new Error("Invalid credentials", {cause:401}))
    }
    if (!find.isConfirmed) return next(new Error('Activate your account first!',{cause : 400}))
    const validPassowrd = bcrypt.compareSync(password,find.password);
    if (!validPassowrd) {
        return next(new Error("Invalid password!", {cause:401}))
    }
    console.log("zopppppppppppppppppppppppppppr");
    const token = jwt.sign({ email: email , id: find._id }, process.env.TOKEN_SEGNITURE , { expiresIn: 60 * 60 * 24 * 30 } )
        // creating the token in the database
    Date.prototype.addDays = function(d) {
        this.setDate(this.getDay()+d);
        return this;
    }
    var later = new Date().addDays(30);
    const createTokenInDB = await tokenModel.create({
        token,
        user: find._id,
        expiredAt: later,
        agent : req.headers['user-agent']
    })
    console.log(createTokenInDB);
    await find.save();
    return res.json({success : true , token : token} )
})

