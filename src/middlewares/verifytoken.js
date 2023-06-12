"use strict"
import * as dotenv from "dotenv";
import User from "../models/user.js";
import Secretqt from "../models/secretqt.js";
import PIN from "../models/pincode.js";
import jwt from "jsonwebtoken";
import {
    taskAppError
} from "../error/handlerError.js"
import { sendMail, sendErrorMail } from "../mail/mail.js";
dotenv.config();
//Token Variables
const SECRET = process.env.SECRET_KEY_JWT;//JWT
const deleteCookie = process.env.COOKRECOVERY;//REcovery


//Verify Token
export const verifyToken = async (req, res, next) => {
    
    const cookieName = process.env.COOKIENAME;
    const token = req.cookies[cookieName] || req.headers[cookieName];
    
    try {
        //Check is token exists or not
        if(!token){
            return res.status(404).redirect("/api/auth/signin")
        }
        //Decoded-Token
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
        const message = taskAppError(res,"taskApp-Error: Middlewate-token : Verify Token ",401)
        sendErrorMail(message)
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
       
        //Check Pins-Encrypted
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
        //return
        return next();
    } catch (error) {
        const message = taskAppError(res,"taskApp-Error: Verify Pin ",401);
        sendErrorMail(message)
    }
}

//Creating token-pass
export const creatingPassToken = async (req, res, next) => {
    req.verify;
    req.ID;
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
        res.cookie(cookieName,token,{
            maxAge: 250 * 1000,
            secure: true,
            httpOnly: true,
            sameSite: "lax"
        });

        return next();
    } catch (error) {
        const message = taskAppError(res,"There is an error: Middleware-token: Creating pass-token ",401);
        sendErrorMail(message) 
    }

}
//Creating token-secretqts
export const creatingSecretqtsToken = async (req, res, next) => {
    req.verify;
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
        res.cookie(cookieName,token,{
            maxAge: 250 * 1000,
            secure: true,
            httpOnly: true,
            sameSite: "lax"
        });

        return next();
    } catch (error) {
        const message = taskAppError(res,"taskAppError: Middleware-Token:  Creating SecretQts Token" );
        sendErrorMail(message)
    }
}

//Verify token Pass
export const verifyPassToken = async (req,res,next) => {
    const cookieName = process.env.COOKPINPASS;
    const token = req.cookies[cookieName] || req.headers[cookieName];
    try {
        if(!token){
            return res.status(404).json({message: "You need to provide token"});
        }
        //decode-Token
        const tokenDecoded = jwt.verify(token, SECRET);
        //Getting ID
        req.userID =  tokenDecoded.id;
        // Return
        return next();
    } catch (error) {
        console.log("There is an error: Verify Token pass ".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: Verify Token pass ",401 );
        sendErrorMail(message)
    }
}

//verify token secre qts
export const verifySecretqtsToken = async (req,res,next) => {
    const cookieName = process.env.COOKPINSECRETQTS;
    const token = req.cookies[cookieName] || req.headers[cookieName];
    try {
        if(!token){
            return res.status(404).json({message: "You need to provide token"});
        }
        //decode Token
        const tokenDecoded = jwt.verify(token, SECRET);
        //Getting user ID
        req.userID =  tokenDecoded.id;

        return next();
    } catch (error) {
        console.log("There is an error: Verify Token secretqts ".red.bold, error.message);
        const message = taskAppError(res,"There is an error: Verify Token secretqts ",401 )
        sendErrorMail(message)
    }
}

//Verify token to reset password
export const verifyRecoveryToken = async (req,res,next) => {
    const SECRET = process.env.SECRET_KEY_JWT;
    const cookieName = process.env.COOKRECOVERY;
    const token = req.cookies[cookieName] || req.headers[cookieName];

    //Checking token:
    try {
        if(!token){
            return res.status(404).redirect("/api/recovery/search")
        }
        //Decode Token
        const tokenDecoded = jwt.verify(token,SECRET);
        req.ID = tokenDecoded.id;
        //Return
        return next();
    } catch (error) {
        console.log("There is an error: Middleware-Token: Verify recovery Token ".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: Middleware-Token: Verify recovery Token ",401);
        sendErrorMail(message)
    }

}

//Verify pincode and create a new token to reset password
export const verifyPinAccess = async (req,res,next) => {
    const cookieName = process.env.COOKIESACCESS;
    const SECRET = process.env.SECRET_KEY_JWT;
    req.ID;
    req.verify;
    try {
        if(!req.verify){
            req.flash("errorPIN","Incorrect PIN, try again..!!");
            req.flash("errorStyle", "errorStyle");
            req.flash("inputError", "inputError")
            return res.status(404).redirect("/api/recovery/pincode")
        }
        //Delete previous cookie
        res.clearCookie(deleteCookie)

        //Creating a new Access-token
        const token = jwt.sign({id: req.ID},SECRET,{
            expiresIn: "4m"
        });

        //Creating Cookie
        res.cookie(cookieName,token,{
            maxAge: 250 * 1000,
            secure: true,
            httpOnly: true,
            sameSite: "lax"
        });
    
        return res.status(200).redirect("/api/recovery/resetpassword")
    } catch (error) {
        console.log("There is an error: Middlewate-token:Verify Pin access/creating new token".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: Middlewate-token:Verify Pin access/creating new token",401);
        sendErrorMail(message)
    }

}
//Verify secret answers
export const verifySecretAnswers = async(req,res,next) => {
    try {
        //Getting answers
        const {answer1, answer2, answer3, userid} = req.body;
        //GEtting answers from database
        const answers = await Secretqt.findOne({user: userid});
        //Creating a variable to know if user is verify or not
        req.verifyUser = null;
        req.ID = userid;
        //Comparing values
        const resultAnswer1 = await Secretqt.comparesecretqts(answer1, answers.answer1);
        const resultAnswer2 = await Secretqt.comparesecretqts(answer2, answers.answer2);
        const resultAnswer3 = await Secretqt.comparesecretqts(answer3, answers.answer3);
    
        //Answer 1
        if(resultAnswer1){
            req.flash("inputCss1", "inputSucces");
        }else{
            req.flash("inputCss1", "inputErr");
        }
        //Answer 1
        if(resultAnswer2){
            req.flash("inputCss2", "inputSucces");
        }else{
            req.flash("inputCss2", "inputErr");
        }   
        //Answer 3
        if(resultAnswer3){
            req.flash("inputCss3", "inputSucces");
        }else{
            req.flash("inputCss3", "inputErr");
        }
        
        //Asign value to variable
        if(resultAnswer1 && resultAnswer2 && resultAnswer3){
            req.verifyUser = true;
        }else{
            req.verifyUser = false;
        }
        
        if(!req.verifyUser){
            req.flash("answer1", `${answer1}`)
            req.flash("answer2", `${answer2}`)
            req.flash("answer3", `${answer3}`)
            return res.status(404).redirect("/api/recovery/secretqts")
        }

        return next();
    } catch (error) {
        console.log("There is an error: Verifying Answers Encrypted ".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: Verifying Answers Encrypted ",401);
        sendErrorMail(message);
    }


}

//Verify Secrets answers and creating a new token access to reset password
export const verifySecretqtsAccess = async (req,res,next) => {
    const cookieName = process.env.COOKIESACCESS;
    const SECRET = process.env.SECRET_KEY_JWT;
    
    req.verifyUser;
    try {
        if(!req.verifyUser){
            return res.status(404).redirect("/api/recovery/secretqts")
        }
        //Delete previous cookie
        res.clearCookie(deleteCookie)

        //Creating token
        const token = jwt.sign({id: req.ID},SECRET,{
            expiresIn: "4m"
        });

        //Creating Cookie
        res.cookie(cookieName,token,{
            maxAge: 400 * 1000,
            secure: true,
            httpOnly: true,
            sameSite: "lax"
        });
    
        return res.status(200).redirect("/api/recovery/resetpassword")
    } catch (error) {
        console.log("There is an error: Verify secreteqts access ".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: Verify secreteqts access ",401);
        sendErrorMail(message);
    }
}

//verifying AccesToken to reset password
export const verifyAccessToken = async (req,res,next) => {
    const cookieName = process.env.COOKIESACCESS;
    const token = req.cookies[cookieName] || req.headers[cookieName];

    //Checking token:
    try {
        if(!token){
            return res.status(404).redirect("/api/recovery/search")
        }
        //Token exists Decode Token
        const tokenDecoded = jwt.verify(token,SECRET);
        req.ID = tokenDecoded.id;
        return next();
    } catch (error) {
        console.log("There is an error: Verify recovery Token ".red.bold, error.message);
        const message = taskAppError(res,"taskAppEror: Verify recovery Token ",401);
        sendErrorMail(message)
    }
}
