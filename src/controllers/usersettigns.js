"use strict"
import * as dotenv from "dotenv"
import User from "../models/user.js";
import SecretQt from "../models/secretqt.js";
import PIN from "../models/pincode.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
dotenv.config();

//Cookies
const cookieapp = process.env.COOKIENAME;
const cookiepassword = process.env.COOKPINPASS;
const cookiesecretqts = process.env.COOKPINSECRETQTS;
const cookieRecovery = process.env.COOKRECOVERY;
const cookieAccessToken = process.env.COOKREACCESS;
const SECRET = process.env.SECRET_KEY_JWT;


//Creating: security questions
export const secretQuestions = async (req,res)=>{
    try {
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
        //Encrypting answers
        const answer1Encrypted = await SecretQt.encryptsecretqts(answer1);
        const answer2Encrypted = await SecretQt.encryptsecretqts(answer2);
        const answer3Encrypted = await SecretQt.encryptsecretqts(answer3);
        //Saving info
        const setSecretqt = new SecretQt({
            question1: question1,
            answer1: answer1Encrypted,
            question2: question2,
            answer2: answer2Encrypted,
            question3: question3,
            answer3: answer3Encrypted,
        });
        setSecretqt.user = userID;
        await setSecretqt.save();
        return res.status(202).redirect("/api/settings/pincode");
    } catch (error) {
        console.log("There is an Error: Settings: Secret Questions".red.bold, error.message);
    }
}
//Creating: Pin code
export const pincode = async (req,res) => {
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

        //Creating PIN
        const pin = new PIN({
            pin1: pin1Encrypted,
            pin2: pin2Encrypted,
            pin3: pin3Encrypted,
            pin4: pin4Encrypted,
            pin5: pin5Encrypted,
            pin6: pin6Encrypted,
        });
        pin.user = userID;
        //Saving 
        await pin.save();
        //Return
        return res.status(202).redirect("/dashboard");
    } catch (error) {
        console.log("There is an Error: Settings: Pin code".red.bold, error.message);
    }
}

//Updating: user info
export const updateUser = async (req,res) => {
    try {
        //Getting user info
        const userID = req.body.userID;
        const {username,name,lastname,country} = req.body;
        const data = {
            username: username,
            name: name,
            lastname: lastname,
            country: country
        }
        //Updating
        await User.findByIdAndUpdate({_id: userID}, data);
        //Return
        return await res.status(202).redirect("/api/settings/profile");
    } catch (error) {
        console.log("There is an Erro: Setting-Profile: Updating user".red.bold, error.message);
    }
}

//Changing: password 
export const changePassword = async (req,res) => {
    try {
        //Getting user info
        const {userid, newPassword, confirmNewPassword} = req.body;
        const salt = await bcrypt.genSalt(12);
        const new_password = await bcrypt.hash(newPassword, salt);
        //updating Data
        await User.findOneAndUpdate({_id: userid},{password: new_password});
        //Cleaning all cookies
        res.clearCookie(cookieapp);
        res.clearCookie(cookiepassword);
        res.clearCookie(cookiesecretqts);
        //Return
        return res.status(202).redirect("/api/auth/signin");
    } catch (error) {
        console.log("There is an Error: Setting: Changing Password".red.bold, Error.message);
    }
}

//Changing: secret Password
export const changeSecretquestions = async (req,res)=> {
    try {
        //Getting info
        const userid = req.body.userid;
        const data = req.body;
        //Updating all data
        await SecretQt.findOneAndUpdate({user: userid}, data);
        //Cleaning cookies
        res.clearCookie(cookiesecretqts);
        //Return
        return res.status(202).redirect("/api/settings/profile");
    } catch (error) {
        
    }
}

//Searching: email / user
export const searchUser = async (req,res) => {
    try {
        //Requing: user info
        const {data} = req.body;
        //Checking if data is: An Email (@ .com/.ve/.org) or simple text
        //Regular expression
        const regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const isAnEmail = regex.test(data);
        //Creating new variables
        let email = null;
        let username = null;
        let user = null;
        
        //Checking if data is Empty
        if(data === ""){
            return console.log("Empty".yellow.Bold);
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

        //Creating Cookie
        res.cookie(cookieRecovery,token,{
            maxAge: 400 * 1000,
            secure: true,
            httpOnly: true,
            sameSite: "lax"
        });

        //Return
        return res.status(200).redirect("/api/recovery/options");
    } catch (error) {
        console.log("There is an Error: Recovery: Searching user".red.bold);
    }
}

//Reset Password
export const resetPassword = async (req,res)=>{
    try {
        const {userid, newPassword, confirmNewPassword} = req.body;
        const salt = await bcrypt.genSalt(12);
        //Encrypting Password
        const hashPassword = await bcrypt.hash(newPassword, salt);
        await User.findOneAndUpdate({_id: userid},{password: hashPassword});
        //Deleting Cookies
        res.clearCookie(cookieAccessToken);
        //Return
        return res.status(202).redirect("/api/auth/signin");
    } catch (error) {
        console.log("There is an Error: Recovery: Reset Password".red.bold, error.message);
    }
}

//Reset Account

//Remove Account
export const removeAcc = async (req,res) => {
    try {
        const {id} = req.params;
        //Removing User from dataBase 
        await User.deleteOne({_id: id});
        //Removing Secret Questions from database
        await SecretQt.deleteOne({user: id});
        //Removing PIN Code From dataBase
        await PIN.deleteOne({user: id});
        //Removing Tasks From dataBase

        //Return
        return res.status(202).redirect("/");
    } catch (error) {
        
    }
}