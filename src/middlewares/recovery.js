"use strict"
import * as dotenv from "dotenv";
import Secretqt from "../models/secretqt.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import {
    taskAppError
} from "../error/handlerError.js"
import { sendMail, sendErrorMail } from "../mail/mail.js";
import { emailResetPassword } from "../mail/Template/emailTemplate.js";
dotenv.config();
//Token Variables
const SECRET = process.env.SECRET_KEY_JWT;//JWT
const recoveryCookie = process.env.COOKRECOVERY;//REcovery


//Todo: Verify token to reset password -> Options view
export const verifyRecoveryToken = async (req,res,next) => {
    const SECRET = process.env.SECRET_KEY_JWT;
    const cookieName = process.env.COOKRECOVERY;
    const token = req.cookies[cookieName] || req.headers[cookieName];

    //Checking token:
    try {
        if(!token){
            return res.status(404).redirect("/api/token")
        }
        //Decode Token
        const tokenDecoded = jwt.verify(token,SECRET);

        //Creating a new variable
        req.ID = tokenDecoded.id;
    
        //Return
        return next();
    } catch (error) {
        console.log("There is an error: Middleware-Token: Verify recovery Token ".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: Middleware-Token: Verify recovery Token ",500);
        sendErrorMail(message)
        return res.status(503).redirect("/api/token")
    }

}

export const sendEmail_resetPassword = async (req, res, next) => {
  
    try {
        //Search user by id
        const user = await User.findById(req.ID);

        //Delete old cookie 
        res.clearCookie(recoveryCookie)

        //Creating a new token in order to be able to change the password
        const token = jwt.sign({id: user.id},SECRET,{
            expiresIn: "30m"
        })

        //*Sending Email
        //Creating link to send to email
        const subjectText = `Hello, ${user.username}, reset Password`
        const url = `${token}`;
        const htmlContent = emailResetPassword(user.username,url);
        await sendMail(user.email,subjectText,htmlContent);

        console.log(url);
        return;
    } catch (error) {
        console.log("There is an error: Middlewate-token:Sending an email to user".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: Middlewate-token:Sending an email to user",500);
        sendErrorMail(message)
        return res.status(503).redirect("/api/failrequest");
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
            req.flash("inputError", "inputError");
            return res.status(404).redirect("/api/recovery/pincode");
        }
        //Delete previous cookie
        res.clearCookie(recoveryCookie);

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
    
        return res.status(200).redirect("/api/recovery/resetpassword");
    } catch (error) {
        console.log("There is an error: Middlewate-token:Verify Pin access/creating new token".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: Middlewate-token:Verify Pin access/creating new token",500);
        sendErrorMail(message)
        return res.status(503).redirect("/api/failrequest");
    }

}

//Verify secret answers
export const verifySecretAnswers = async(req,res,next) => {
    try {
        //Getting answers
        const {answer1, answer2, answer3, userid} = req.body;
        req.ID = userid;
        //GEtting answers from database
        const answers = await Secretqt.findOne({user: userid});

        //Creating a variable to know if user is verify or not
        req.verifyUser = null;
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
        
        //If user is not verify
        if(!req.verifyUser){
            req.flash("answer1", `${answer1}`)
            req.flash("answer2", `${answer2}`)
            req.flash("answer3", `${answer3}`)
            return res.status(404).redirect("/api/recovery/secretqts")
        }

        return next();
    } catch (error) {
        console.log("There is an error: Verifying Answers Encrypted ".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: Verifying Answers Encrypted ",500);
        sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }


}

//Verify Secrets answers and creating a new token access to reset password
export const verifySecretqtsAccess = async (req,res,next) => {
    try {
        const cookieName = process.env.COOKIESACCESS;
        const SECRET = process.env.SECRET_KEY_JWT;
        
        req.verifyUser;

        if(!req.verifyUser){
            return res.status(404).redirect("/api/recovery/secretqts")
        }
        //Delete previous cookie
        res.clearCookie(recoveryCookie)

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
        const message = taskAppError(res,"taskAppError: Verify secreteqts access ",500);
        sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
}

//Todo: User has access to resetpassword
//Get Link from email

export const getAccssEmail_resetPassword = async (req,res,next)=>{
    try {
        //Getting token
        const {token} = req.params;

        if(!token){
            return res.status(404).redirect("/api/token")
        }

        //decode-Token
        const id = jwt.verify(token, SECRET);
        //Pass id into a variable;
        req.userID = id.id;
        res.clearCookie(recoveryCookie);
        next();
    } catch (error) {
        console.log("Error verifying Email pin",error);
        const message = taskAppError(res,"taskAppError: Error verifying Email pin ",500);
        sendErrorMail(message);
        return res.status(503).redirect("/api/token")
    }
}

//verifying AccesToken to reset password
export const verifyAccessToken = async (req,res,next) => {
    const cookieName = process.env.COOKIESACCESS;
    const token = req.cookies[cookieName] || req.headers[cookieName];

    //Checking token:
    try {
        if(!token){
            return res.status(404).redirect("/api/token")
        }
        //Token exists Decode Token
        const tokenDecoded = jwt.verify(token,SECRET);
        req.ID = tokenDecoded.id;
        return next();
    } catch (error) {
        console.log("There is an error: Verify recovery Token ".red.bold, error.message);
        const message = taskAppError(res,"taskAppEror: Verify recovery Token ",401);
        sendErrorMail(message)
        return res.status(404).redirect("/api/token")
    }
}

//Todo: check before rest password
//Reset Password to a new One by cookies
export const checkCookie_ResetPassword = async (req,res,next) => {
    //Checking data users
    const {newPassword, confirmNewPassword} = req.body;
    //Regular Expresion
    const characteresLng = (/(?=^.{8,}$)/).test(newPassword);
    const anyNumber = (/(?=.*\d)/).test(newPassword);
    const lowerLetter = (/(?=.*[a-z])/).test(newPassword);
    const anyUppserLetter = (/(?=.*[A-Z])/).test(newPassword);
    const notSpace = (/^\S+$/).test(newPassword);

    try {
        if(newPassword !== confirmNewPassword ){
            req.flash("errnewpass", "Password are different");
            return res.redirect("/api/recovery/resetpassword");
        }else if(!characteresLng){
            //pass length > 8
            req.flash("errnewpass", "Password must have at least 8 characteres [letters-Numbers]")
            return res.redirect("/api/recovery/resetpassword");
        }else if(!lowerLetter){
            //pass must have an Upper letter
            req.flash("errnewpass", "Password must have at least a letter");
            return res.redirect("/api/recovery/resetpassword");
        }else if(!anyNumber){
            //pass must have numbers
            req.flash("errnewpass", "Password must have at least a number");
            return res.redirect("/api/recovery/resetpassword");
        }else if(!anyUppserLetter){
            //pass must have an Upper letter
            req.flash("errnewpass", "Password must have at least an Upper letter");
            return res.redirect("/api/recovery/resetpassword");
        }else if(!notSpace){
            //pass must not have any space
            req.flash("errnewpass", "Password must not have any blank space");
            return res.redirect("/api/recovery/resetpassword");
        }

        return next();
    } catch (error) {
        const message = taskAppError(res,"taskAppError: Middleware-Signup- Path: Recovery-Reset Password", 500);
        sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
}

//Reset Password to a new One by token
export const checkToken_ResetPassword = async (req,res,next) => {
    //Checking data users
    const {newPassword, confirmNewPassword,token} = req.body;
    //Regular Expresion
    const characteresLng = (/(?=^.{8,}$)/).test(newPassword);
    const anyNumber = (/(?=.*\d)/).test(newPassword);
    const lowerLetter = (/(?=.*[a-z])/).test(newPassword);
    const anyUppserLetter = (/(?=.*[A-Z])/).test(newPassword);
    const notSpace = (/^\S+$/).test(newPassword);

    try {
        if(newPassword !== confirmNewPassword ){
            req.flash("errnewpass", "Password are different");
            return res.redirect(`/api/recovery/resetpassword/${token}`);
        }else if(!characteresLng){
            //pass length > 8
            req.flash("errnewpass", "Password must have at least 8 characteres [letters-Numbers]");
            return res.redirect(`/api/recovery/resetpassword/${token}`);
        }else if(!lowerLetter){
            //pass must have an Upper letter
            req.flash("errnewpass", "Password must have at least a letter");
            return res.redirect(`/api/recovery/resetpassword/${token}`);
        }else if(!anyNumber){
            //pass must have numbers
            req.flash("errnewpass", "Password must have at least a number");
            return res.redirect(`/api/recovery/resetpassword/${token}`);
        }else if(!anyUppserLetter){
            //pass must have an Upper letter
            req.flash("errnewpass", "Password must have at least an Upper letter");
            return res.redirect(`/api/recovery/resetpassword/${token}`);
        }else if(!notSpace){
            //pass must not have any space
            req.flash("errnewpass", "Password must not have any blank space");
            return res.redirect(`/api/recovery/resetpassword/${token}`);
        }

        return next();
    } catch (error) {
        const message = taskAppError(res,"taskAppError: Middleware-Signup- Path: Recovery-Reset Password", 500);
        console.log(message);
        sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
}