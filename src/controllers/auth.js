"use strict"
import * as dotenv from "dotenv";
import User from "../models/user.js";
import SecretQt from "../models/secretqt.js";
import PIN from "../models/pincode.js";
import Roles from "../models/roles.js";
import {welcomeEmail} from "../mail/Template/emailTemplate.js"
import jwt from "jsonwebtoken";
import { 
    sendMail,
    sendErrorMail,
    notificationAppMail
} from "../mail/mail.js";
import {
    taskAppError
} from "../error/handlerError.js"

dotenv.config();

const SECRET = process.env.SECRET_KEY_JWT;//Jeson Web token Key
const cookieUserName = process.env.COOKIENAME;//taskApp Token Users
const cookieAdmin = process.env.COOKIEADMIN;//taskApp Token Users
/**
 * Creatting user 
 * Getting: all data in order to create a new user Account
 */
export const singup = async (req,res) => {
    const {
        username,
        email,
        password
    } = req.body;
    try {
        //Getting password to encrypt password
        const encryptPassword = await User.encryptPassword(password);
        
        //Save info in mongoDB
        const newUser = new User({
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password: encryptPassword
        });
        //get Role
        const role = await Roles.find({name:"user"});
        newUser.roles = [role._id];

        //Saving data
        const savedUser = await newUser.save();

        //Send message
        const subjectText = `Hello, ${username} Welcome to TaskApp.!!`;
        const htmlContent = welcomeEmail(username);
        await sendMail(email,subjectText,htmlContent);

        //Send notification to taskAppEmail
        const htmlNotification = `
            <h1> New User </h1> 
            <hr>
            <p> User: <b> ${email} </b> has registered in the APP</p>
        `
        await notificationAppMail(htmlNotification);
        
        //Creating a token
        const token = jwt.sign({id:savedUser._id},SECRET,{
            expiresIn: "1h"
        });
       
        //Create our cookies (Cookiename, Token)
        //It helps us to create a middlaware to allow the user to be in our app
        res.cookie(cookieUserName,token,{
            maxAge: 3600 * 1000, //1 hour
            secure: true,
            httpOnly: true,
            sameSite: "lax"
        });
        return res.redirect("/api/auth/secretquestions");
    } catch (error) {
        console.log("There is an error: Auth: Signup ".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: controller Auth - Signup ",500);
        await sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
};
/**
 * Getting access to app
 */
export const singin = async (req,res) => {
    const {email} = req.body;
    try {
        // Getting user by Email
        const user = await User.findOne({email: email}).populate("roles");
        
        //Creating a token
        const token = jwt.sign({id: user._id}, SECRET,{
            expiresIn: "1h"
        });
        
        //Create our cookies
        res.cookie(cookieUserName,token,{
            maxAge: 3600 * 1000, //1 hour
            secure: true,
            httpOnly: true,
            sameSite: "lax"
        });

        return res.status(202).redirect("/dashboard");
    } catch (error) {
        console.log("There is an error: Auth: Signin".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: controller Auth - Signin ",500);
        sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
};
/** Admin */
export const adminSignin = async (req,res) => {
    try {
        const {email} = req.body;
        // Getting user by Email
        const admin = await User.findOne({email: email}).populate("roles");
        
        //Creating a token
        const token = jwt.sign({id: admin._id}, SECRET,{
            expiresIn: "1h"
        });
        
        //Create our cookies
        res.cookie(cookieAdmin,token,{
            maxAge: 3600 * 1000, //1 hour
            secure: true,
            httpOnly: true,
            sameSite: "lax"
        });

        return res.status(202).redirect("/controladmin");
    } catch (error) {
        console.log("There is an error: Auth: admin Sign in".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: controller Auth - Signin ",500);
        sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
}

// Creating SecurityQuestions
export const setSecretQuestions = async (req,res)=>{
    //Getting data: Questions and Answers from form
    const userID = req.body.userid;
    const {
        question1,
        answer1,
        question2,
        answer2,
        question3,
        answer3,
    } = req.body;
    try {
        //Encrypting answers
        const answer1Encrypted = await SecretQt.encryptsecretqts(answer1);
        const answer2Encrypted = await SecretQt.encryptsecretqts(answer2);
        const answer3Encrypted = await SecretQt.encryptsecretqts(answer3);
        //Saving info
        const setSecretqt = new SecretQt({
            question1: question1.toLowerCase(),
            answer1: answer1Encrypted,
            question2: question2.toLowerCase(),
            answer2: answer2Encrypted,
            question3: question3.toLowerCase(),
            answer3: answer3Encrypted,
        });
        //Saving user ID to identify each scretesqts
        setSecretqt.user = userID;
        await setSecretqt.save();
        return res.status(202).redirect("/api/auth/pincode");
    } catch (error) {
        console.log("There is an Error: Settings: Secret Questions".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: controller Settings - Secret Questions ",500);
        sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
}
//Creating: Pin code
export const setPinCode = async (req,res) => {
    try {
        //Gettin user id
        const userID = req.body.userid;
        //Getting all pins
        const {pin1,pin2,pin3,pin4,pin5,pin6} = req.body;
        //Encrypting pins
        const pin1Encrypted = await PIN.encryptPinCode(pin1);
        const pin2Encrypted = await PIN.encryptPinCode(pin2);
        const pin3Encrypted = await PIN.encryptPinCode(pin3);
        const pin4Encrypted = await PIN.encryptPinCode(pin4);
        const pin5Encrypted = await PIN.encryptPinCode(pin5);
        const pin6Encrypted = await PIN.encryptPinCode(pin6);

        //Saving each PIN into models
        const pin = new PIN({
            pin1: pin1Encrypted,
            pin2: pin2Encrypted,
            pin3: pin3Encrypted,
            pin4: pin4Encrypted,
            pin5: pin5Encrypted,
            pin6: pin6Encrypted,
        });
        //Addin userID
        pin.user = userID;
        //Saving 
        await pin.save();
        //Return
        return res.status(202).redirect("/dashboard");
    } catch (error) {
        console.log("There is an Error: Settings: Pin code".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: controller Settings - Pin code ",500);
        sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
}
//Logout
export const closeSession = async (req,res) => {
    try {
        res.clearCookie(cookieUserName);
        req.session.destroy();
        return res.status(200).redirect("/");
    } catch (error) {
        console.log("There is an Error: Auth: CloseSession ".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: controller Auth - CloseSession ",500);
        sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
};

//Logout Admin
export const closeAdminSession = async (req,res) => {
    try {
        res.clearCookie(cookieAdmin);
        req.session.destroy();
        return res.status(200).redirect("/api/auth/admin");
    } catch (error) {
        console.log("There is an Error: Auth: CloseSession ".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: controller Auth - CloseSession ",500);
        sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
};

