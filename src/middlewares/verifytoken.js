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
            return res.status(404).redirect("/api/auth/signin")
        }

        //If user exists go on
        return next();


    } catch (error) {
        console.log("There is an error: Verify Token ".red.bold, error.message);
    }
}

//Verify Pincode
export const verifyPinCode = async (req, res,next) => {
    try {
        //getting user
        const userID = req.body.userID;
        req.ID = userID;
        //Pin to compare
        const {pin1,pin2,pin3,pin4,pin5,pin6} = req.body;
        const pinListA = [pin1,pin2,pin3,pin4,pin5,pin6];
    
        //Pin from user-database
        const pinUser = await PIN.findOne({user: userID});

        const pinListB = [
            pinUser.pin1,
            pinUser.pin2,
            pinUser.pin3,
            pinUser.pin4,
            pinUser.pin5,
            pinUser.pin6
        ];

        //Creating a variable
        req.verify = null;
       
        //Check Pins
        for (let i = 0; i < pinListB.length; i++) {
            const value = await PIN.comparePincode(pinListA[i], pinListB[i]);
            if(value){
                req.verify = true;
                continue;
            }else{
                req.verify = false;
                break;
            }
        }
        
        return next();
    } catch (error) {
        console.log("There is an error: Verify Pin ".red.bold, error.message);
        if(error){
            res.status(404).redirect("/dashboard")
            return; 
        }
    }
}

//Creating token-pass
export const creatingtokenPass = async (req, res, next) => {
    req.verify;
    req.ID;
    const SECRET = process.env.SECRET_KEY_JWT;
    const cookieName = process.env.COOKPINPASS;
    
    try {
        if(!req.verify){
            req.flash("errorPIN","Sorry Incorrect PIN, try again..!!");
            req.flash("errorStyle", "errorStyle");
            return res.status(200).redirect("/api/settings/profile?data=changepass");
        }
        //Gettin user
        const user = await User.findById(req.ID);

        //Creating token
        const token = jwt.sign({id: user._id},SECRET,{
            expiresIn: "4m"
        })

        //Creating Cookie
        //Create our cookies
        res.cookie(cookieName,token,{
            maxAge: 250 * 1000,
            secure: true,
            httpOnly: true,
            sameSite: "lax"
        });

        return next();
    } catch (error) {
        console.log("There is an error: CookieToken pass ".red.bold, error.message);  
    }

}
//Creating token-secretqts
export const creatingtokenSecretqts = async (req, res, next) => {
    req.verify = req.body;
    const SECRET = process.env.SECRET_KEY_JWT;
    const cookieName = process.env.COOKPINSECRETQTS;
    try {
        if(!req.verify){
            req.flash("errorPIN","Sorry Incorrect PIN, try again..!!");
            req.flash("errorStyle", "errorStyle");
            return res.status(200).redirect("/api/settings/profile?data=changesecretqts");
        }
        //Gettin user
        const user = await User.findById(req.ID);

        //Creating token
        const token = jwt.sign({id: user._id},SECRET,{
            expiresIn: "4m"
        })

        //Creating Cookie
        //Create our cookies
        res.cookie(cookieName,token,{
            secure: true,
            httpOnly: true,
            sameSite: "lax"
        });

        return next();
    } catch (error) {
        console.log("There is an error: CookieToken secretqts ".red.bold, error.message);  
    }
}

//Verify token Pass
export const verifytokenpass = async (req,res,next) => {
    const SECRET = process.env.SECRET_KEY_JWT;
    const cookieName = process.env.COOKPINPASS;
    const token = req.cookies[cookieName] || req.headers[cookieName];
    try {
        if(!token){
            return res.status(404).json({message: "You need to provide token"});
        }
        //decode Token
        const tokenDecoded = jwt.verify(token, SECRET);
        req.userID =  tokenDecoded.id;

        return next();
    } catch (error) {
        console.log("There is an error: Verify Token pass ".red.bold, error.message);
    }
}

//verify token secre qts
export const verifytokensecretqts = async (req,res,next) => {
    const SECRET = process.env.SECRET_KEY_JWT;
    const cookieName = process.env.COOKPINSECRETQTS;
    const token = req.cookies[cookieName] || req.headers[cookieName];
    try {
        if(!token){
            return res.status(404).json({message: "You need to provide token"});
        }
        //decode Token
        const tokenDecoded = jwt.verify(token, SECRET);
        req.userID =  tokenDecoded.id;

        return next();
    } catch (error) {
        console.log("There is an error: Verify Token secretqts ".red.bold, error.message);
    }
}
