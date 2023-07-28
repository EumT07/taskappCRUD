"use strict"
import * as dotenv from "dotenv"
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "node:url";
import {
    resetPasswordEmail,
} from "../mail/Template/emailTemplate.js";
import {
    taskAppError
} from "../error/handlerError.js";
import { sendMail, sendErrorMail,notificationAppMail } from "../mail/mail.js";

dotenv.config();

//Getting: Environment Variables
const cookieRecovery = process.env.COOKRECOVERY;
const cookieAccessToken = process.env.COOKREACCESS;
const SECRET = process.env.SECRET_KEY_JWT;


//* Create a new file for this
//Searching: email / user
export const searchUser = async (req,res) => {
    try {
        //Requing: user info
        const {data} = req.body;
        //Checking if data is: An Email (@ .com/.ve/.org) or simple text
        //Regular expression by Google bard
        const regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const isAnEmail = regex.test(data);
        //Creating new variables
        let email = null;
        let username = null;
        let user = null;
        
        //Checking if data is Empty
        if(data === ""){
            return res.status(404).redirect("/api/recovery/search")
        }

        //Checking if data is an Email
        if(isAnEmail){
            //Search email
            email = data;//Or user data value instead of
            user = await User.findOne({email: email});
        }else{
            //Search user
            username = data;//Or user data value
            user = await User.findOne({username: username});
        }

        //Checking is user exist or not
        if(!user){
            return res.status(400).redirect(`/api/auth/signup/?data=${data}`);
        }
    
        //Creating a new token 
        const token = jwt.sign({id: user._id}, SECRET,{
            expiresIn: "5m"
        });

        //Creating Cookie: Recovery Cookie
        res.cookie(cookieRecovery,token,{
            maxAge: 250 * 1000, //5 minutes
            secure: true,
            httpOnly: true,
            sameSite: "lax"
        });

        //Return
        return res.status(200).redirect("/api/recovery/options");
    } catch (error) {
        console.log("There is an Error: Recovery: Searching user".red.bold);
        const message = taskAppError(res,"taskAppError: controller Settings Searching user",500);
        // sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
}
//Reset Password *email
export const resetPassword = async (req,res)=>{
    try {
        const {userid, newPassword, confirmNewPassword} = req.body;
        //Salt
        const salt = await bcrypt.genSalt(12);
        //Encrypting Password
        const hashPassword = await bcrypt.hash(newPassword, salt);
        //Assigning password to user
        await User.findOneAndUpdate({_id: userid},{password: hashPassword});
        //Deleting Cookies
        res.clearCookie(cookieAccessToken);

        //Send Email
        const user = await User.findById(userid);
        const subjectText = `Your Password has been reseted`;
        const htmlContent = resetPasswordEmail(user.username);
        // await sendMail(user.email,subjectText,htmlContent);

        //Send notification to taskAppEmail
        const htmlNotification = `
            <h1> Reset Account </h1> 
            <hr>
            <p> The password of this user <b> ${user.email} </b> has been reseted</p>
        `
        // await notificationAppMail(htmlNotification);

        //Return
        return res.status(202).redirect("/api/auth/signin");
    } catch (error) {
        console.log("There is an Error: Recovery: Reset Password".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: controller Settings Reset Password",500);
        // sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
}