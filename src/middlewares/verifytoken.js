"use strict"
import * as dotenv from "dotenv";
import User from "../models/user.js";
import PIN from "../models/pincode.js";
import jwt from "jsonwebtoken";
dotenv.config();

//Verify Token
export const verifyToken = async (req, res, next) => {
    const SECRET = process.env.SECRET_KEY_JWT;
    const cookieName = process.env.COOKIENAME;
    const token = req.cookies[cookieName] || req.headers[cookieName];
    
    try {
        if(!token){
            return res.status(404).redirect("/api/auth/signin")
        }
        //Decode Token
        const tokenDecoded = jwt.verify(token, SECRET);
        req.userID = tokenDecoded.id;

        //Identify user
        const user = await User.findById(req.userID);

        //Check if user exists or not.
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        //If user exists go on
        next();


    } catch (error) {
        console.log("There is an error: Verify Token ".red.bold, error.message);
    }
}

//Verify Pincode
export const verifyPinCode = async (req, res,next) => {
    //getting user
    const userID = req.body.userID;

    //
    const {pin1,pin2,pin3,pin4,pin5,pin6} = req.body;
    const pinListA = [pin1,pin2,pin3,pin4,pin5,pin6];
    
    //
    const pinUser = await PIN.findOne({user: userID});
    const pinListB = [pinUser.pin1,pinUser.pin2,pinUser.pin3,pinUser.pin4,pinUser.pin5,pinUser.pin6];


    let result = null;
       
    for (let i = 0; i < pinListB.length; i++) {
        console.log(pinListA[i] + ":" + pinListB[i] );

        if(pinListA[i] == pinListB[i]){
            result = true;
            console.log("Good");
            continue;
        }else{
            console.log("Sorry");
            result = false;
            break;
        }
    
    }

    if (!result){
        console.log("Verificacion incorrecta");
    }else{
        console.log("Correcta");
    }


    console.log(`
    userID: ${userID}
    Pin List A: ${pinListA}
    Pin List B: ${pinListB}
    valor final: ${result}
    `);
}