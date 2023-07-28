"Use strict"
import User from "../models/user.js";
import {
    taskAppError
} from "../error/handlerError.js";
import { sendMail, sendErrorMail } from "../mail/mail.js";

//Checking if user exist or not
export const checkUserSignup = async (req, res, next)=>{
    try {
        const {username, email, password, confirmPassword} = req.body;
        const user = await User.findOne({username: username});
        
        //Checking username
        if(user){
            req.flash("errSignup", "This Username is already taken"),
            req.flash("username", username),
            req.flash("email", email),
            req.flash("password", password),
            req.flash("confirmPassword", confirmPassword)
            return res.redirect("/api/auth/signup");
        }

        //Checking email
        const userEmail = await User.findOne({email: email});
        if(userEmail){
            req.flash("errSignup", "This email is already taken"),
            req.flash("username", username),
            req.flash("email", email),
            req.flash("password", password),
            req.flash("confirmPassword", confirmPassword)
            return res.redirect("/api/auth/signup");
        };

        //Success
       return next();
    } catch (error) {
        const message = taskAppError(res, "taskAppError: Signup --> check User Signup", 500);
        // sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
}

//Cheking Password
export const checkUserPassword = async (req, res, next) => {
    //Checking data users
    const { email, username, password, confirmPassword} = req.body;
   
    //Regular Expresion
    const characteresLng = (/(?=^.{8,}$)/).test(password);
    const anyNumber = (/(?=.*\d)/).test(password);
    const lowerLetter = (/(?=.*[a-z])/).test(password);
    const anyUppserLetter = (/(?=.*[A-Z])/).test(password);
    const notSpace = (/^\S+$/).test(password);

    //Check this *
    try {
        if(password != confirmPassword ){
            req.flash("errSignup", "Password are different");
            req.flash("username", username);
            req.flash("email", email);
            req.flash("password", password);
            req.flash("confirmPassword", confirmPassword);
            return res.redirect("/api/auth/signup");
        }else if(!characteresLng){
            //pass length > 8
            req.flash("errSignup", "Password must have at least 8 characteres [letters-Numbers]");
            req.flash("username", username);
            req.flash("email", email);
            req.flash("password", password);
            req.flash("confirmPassword", confirmPassword);
            return res.redirect("/api/auth/signup");
        }else if(!lowerLetter){
            //pass must have an Upper letter
            req.flash("errSignup", "Password must have at least a letter");
            req.flash("username", username);
            req.flash("email", email);
            req.flash("password", password);
            req.flash("confirmPassword", confirmPassword);
            return res.redirect("/api/auth/signup");
        }else if(!anyNumber){
            //pass must have numbers
            req.flash("errSignup", "Password must have at least a number");
            req.flash("username", username);
            req.flash("email", email);
            req.flash("password", password);
            req.flash("confirmPassword", confirmPassword);
            return res.redirect("/api/auth/signup");
        }else if(!anyUppserLetter){
            //pass must have an Upper letter
            req.flash("errSignup", "Password must have at least an Upper letter");
            req.flash("username", username);
            req.flash("email", email);
            req.flash("password", password);
            req.flash("confirmPassword", confirmPassword);
            return res.redirect("/api/auth/signup");
        }else if(!notSpace){
            //pass must not have any space
            req.flash("errSignup", "Password must not have any blank space");
            req.flash("username", username);
            req.flash("email", email);
            req.flash("password", password);
            req.flash("confirmPassword", confirmPassword);
            return res.redirect("/api/auth/signup");
        }

        return next();
    } catch (error) {
        const message = taskAppError(res,"taskAppError: Signup --> Check Password ", 500);
        // sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
}

export const checkUserSignin = async (req,res,next) => {
    try {
        const {email, password} = req.body;
        //Getting user Info from DB
        const user = await User.findOne({email: email});
        //Checking is user Exist or not
        if(!user){
            req.flash("errSignin", "User not found");
            req.flash("email", email);
            return res.redirect("/api/auth/signin");
        }
        //Comparing password 
        const comparePassword = await User.comparePassword(password, user.password);
        //Is the same password or not?
        if(!comparePassword){
            req.flash("errSignin", "Wrong password");
            req.flash("email", email)
            return res.redirect("/api/auth/signin");
        }
        //Return
        return next();
    } catch (error) {
        const message = taskAppError(res,"taskAppError: Signin --> Check User Signin", 500);
        // sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
}

//Verify Pincode Fild
export const checkEmptyFieldPincode = async (req,res,next) => {
    try {
        const {pin1,pin2,pin3,pin4,pin5,pin6} = req.body;

        //Figuring out if field are empty
        const regExpPin1 = (/^$/).test(pin1);
        const regExpPin2 = (/^$/).test(pin2);
        const regExpPin3 = (/^$/).test(pin3);
        const regExpPin4 = (/^$/).test(pin4);
        const regExpPin5 = (/^$/).test(pin5);
        const regExpPin6 = (/^$/).test(pin6);

        if(regExpPin1 || regExpPin2 || regExpPin3 || regExpPin4 || regExpPin5 || regExpPin6){
            req.flash("emptyField", "It must not have Empty field")
            res.status(303).redirect("/api/auth/pincode");
            return;
        }
    
        return next();
    } catch (error) {
        const message = taskAppError(res,"taskAppError: Check Empty Field: pincode",500);
        // sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
}

//Verify Secret QTS Fild 
export const checkEmptyFieldSecreteqts = async (req,res,next) => {
   try {
        const {answer1,answer2,answer3} = req.body;

        //Cheacking Answers 
        const regExAnswer1 = (/^$/).test(answer1);
        const regExAnswer2 = (/^$/).test(answer2);
        const regExAnswer3 = (/^$/).test(answer3);

        if(regExAnswer1 || regExAnswer2 || regExAnswer3){
            req.flash("emptyField", "It must not have Empty field");
            res.status(303).redirect("/api/auth/secretquestions");
            return;
        }

        return next();
   } catch (error) {
    const message = taskAppError(res,"taskAppError: Check Empty Field: secretqts",500);
    // sendErrorMail(message);
    return res.status(500).redirect("/api/failrequest");
   }
}

