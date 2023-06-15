"use strict"
import User from "../models/user.js";
import {
    taskAppError
} from "../error/handlerError.js";
import { sendMail, sendErrorMail } from "../mail/mail.js";

//Updating User: username
export const checkUsername = async (req,res,next) => {
    try {
        //New username 
        const newusername = req.body.username;
        console.log(req.body.userID);
    
        //Searching user 
        const userID = req.body.userID;
        const user = await User.findById({_id: userID});
    
        //Searching username in our dta
        const usernameFound = await User.find({username: newusername});
    
        //Is the same user?
        if(user.username === newusername){
            return next();;
        }
        //is  Data Empty
        if(usernameFound.length === 0){
           return next();
        }
        
        //User exist
        if(usernameFound){
            //Css style
            req.flash("usernameFound", "inputUserName");
            //error message
            req.flash("usernameErr", `${newusername} is already exist   `);
            //Return
            return res.status(202).redirect("/api/settings/profile");
        }
    } catch (error) {
        const messge = taskAppError(res,"taskAppError: Setting-Profile: check username", 404);
        // sendErrorMail(messge)
    }
}

//Updating: Old password to a new passwords
export const checkNewPassword = async (req, res, next) => {
    //Checking data users
    const {newPassword, confirmNewPassword} = req.body;
  
    //Regular Expresion
    const characteresLng = (/(?=^.{8,}$)/).test(newPassword);
    const anyNumber = (/(?=.*\d)/).test(newPassword);
    const lowerLetter = (/(?=.*[a-z])/).test(newPassword);
    const anyUppserLetter = (/(?=.*[A-Z])/).test(newPassword);
    const notSpace = (/^\S+$/).test(newPassword);

    try {
        if(newPassword != confirmNewPassword ){
            req.flash("errnewpass", "Password are different")
            return res.redirect("/api/settings/changepassword");
        }else if(!characteresLng){
            //pass length > 8
            req.flash("errnewpass", "Password must have at least 8 characteres [letters-Numbers]")
            return res.redirect("/api/settings/changepassword");
        }else if(!lowerLetter){
            //pass must have an Upper letter
            req.flash("errnewpass", "Password must have at least a letter")
            return res.redirect("/api/settings/changepassword");
        }else if(!anyNumber){
            //pass must have numbers
            req.flash("errnewpass", "Password must have at least a number")
            return res.redirect("/api/settings/changepassword");
        }else if(!anyUppserLetter){
            //pass must have an Upper letter
            req.flash("errnewpass", "Password must have at least an Upper letter")
            return res.redirect("/api/settings/changepassword");
        }else if(!notSpace){
            //pass must not have any space
            req.flash("errnewpass", "Password must not have any blank space")
            return res.redirect("/api/settings/changepassword");
        }

        return next();
    } catch (error) {
        console.log("There is an error: Middlewate-Signup: Verifying new password".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: Middlewate-Signup: Verifying new password",401);
        // sendErrorMail(message);
    }
}
