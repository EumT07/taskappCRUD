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
import {
    linkpinEmail } from "../mail/Template/emailTemplate.js";
dotenv.config();
//Token Variables
const SECRET = process.env.SECRET_KEY_JWT;//JWT

//Verify Principal token to access into page 
export const taskApp_Token = async (req, res, next) => {
    
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
        // sendErrorMail(message)
    }
}

//Verify Pincode : Insert Pincode in order to makes new changes (pass / secretsqts)
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
        // sendErrorMail(message)
    }
}

//Todo: Check Empty Files PIN / Secret qts

//Verify Pincode Fild *Errohandling
export const emptyField_changePinCode = async (req,res,next) => {
    const {pin1,pin2,pin3,pin4,pin5,pin6,token} = req.body;

    //Figuring out if field are empty
    const regExpPin1 = (/^$/).test(pin1)
    const regExpPin2 = (/^$/).test(pin2)
    const regExpPin3 = (/^$/).test(pin3)
    const regExpPin4 = (/^$/).test(pin4)
    const regExpPin5 = (/^$/).test(pin5)
    const regExpPin6 = (/^$/).test(pin6)

    try {
        if(regExpPin1 || regExpPin2 || regExpPin3 || regExpPin4 || regExpPin5 || regExpPin6){
            req.flash("emptyField", "It must not have Empty field")
            res.status(303).redirect(`/api/settings/changepincode/${token}`);
            return;
        }
    
        return next();
    } catch (error) {
        const message = taskAppError(res,"taskAppError: Check Empty Field: pincode",404);
        // sendErrorMail(message);
    }
}

//Verify Secret QTS Fild  *Errohandling
export const emptyField_changesecretqts = async (req,res,next) => {
    const {answer1,answer2,answer3} = req.body;

    const regExAnswer1 = (/^$/).test(answer1);
    const regExAnswer2 = (/^$/).test(answer2);
    const regExAnswer3 = (/^$/).test(answer3);
    
   try {
        if(regExAnswer1 || regExAnswer2 || regExAnswer3){
            req.flash("emptyField", "It must not have Empty field")
            res.status(404).redirect("/api/settings/changesecretquestions")
            return;
        }

        return next();
   } catch (error) {
    const message = taskAppError(res,"taskAppError: Check Empty Field: secretqts",404);
    // sendErrorMail(message);
   }
}

//todo: Creating new tokens

//Creating link / sending email to users in order to change pin code *Errohandling
export const sendToken_to_userEmail = async (req, res, next)=>{
    try {
        const {email, userID} = req.body;
        //Get user
        const user = await User.findById(userID);

        if(email !== user.email ){
            return console.log("Not Email");
        }

        //Create a new token
        const token = jwt.sign({id: user._id}, SECRET,{
            expiresIn: "30m"
        });

        //Creating link to send to email
        const subjectText = `Hello, ${user.username}, Change PinCode`
        const url = `${token}`;
        const htmlContent = linkpinEmail(user.username,url);
        console.log(htmlContent);
        // await sendMail(user.email,subjectText,htmlContent);
        return res.status(200).redirect("/api/settings/profile?data=changepinreq");

    } catch (error) {
        console.log("Error Creating Email pin",error);
    }
}
//Creating token-pass : It allow to update users' passwords.
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
        // sendErrorMail(message) 
    }

}
//Creating token-secretqts: It allow to update users' secret questions
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
        // sendErrorMail(message)
    }
}

//todo: Verifying tokens

//Verifying token from email *Errohandling
export const verifyToken_from_UserEmail = async ( req,res,next)=>{
    try {
        //Getting token
        const {token} = req.params;

        if(!token){
            return res.status(404).redirect("/error");
        }

        //decode-Token
        const id = jwt.verify(token, SECRET);

        //Pass id into a variable;
        req.userID = id.id;
        next();
    } catch (error) {
        console.log("Error verifying Email pin",error);
    }
}

//Verify token Pass --> Will change password
export const verifyPassToken = async (req,res,next) => {
    const cookieName = process.env.COOKPINPASS;
    const token = req.cookies[cookieName] || req.headers[cookieName];
    try {
        if(!token){
            return res.status(404).redirect("/error");
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
        // sendErrorMail(message)
    }
}

//verify token secre qts --> will change Secret Questions
export const verifySecretqtsToken = async (req,res,next) => {
    const cookieName = process.env.COOKPINSECRETQTS;
    const token = req.cookies[cookieName] || req.headers[cookieName];
    try {
        if(!token){
            return res.status(404).redirect("/error");
        }
        //decode Token
        const tokenDecoded = jwt.verify(token, SECRET);
        //Getting user ID
        req.userID =  tokenDecoded.id;

        return next();
    } catch (error) {
        console.log("There is an error: Verify Token secretqts ".red.bold, error.message);
        const message = taskAppError(res,"There is an error: Verify Token secretqts ",401 )
        // sendErrorMail(message)
    }
}


