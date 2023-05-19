"use strict"
import User from "../models/user.js";
import SecretQt from "../models/secretqt.js";
import PIN from "../models/pincode.js";
import bcrypt from "bcryptjs";

//Cookies
const cookieapp = process.env.COOKIENAME;
const cookiepassword = process.env.COOKPINPASS;
const cookiesecretqts = process.env.COOKPINSECRETQTS;


//Set security questions
export const secretQuestions = async (req,res)=>{
    const userID = req.body.userid;
    const body = req.body;
    const setSecretqt = new SecretQt(body);
    setSecretqt.user = userID;
    await setSecretqt.save();
    return res.status(202).redirect("/api/settings/pincode");
}
//Pin code
export const pincode = async (req,res) => {
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
    return res.status(202).redirect("/dashboard");
}

//Update user
export const updateUser = async (req,res) => {
    const userID = req.body.userID;
    const {username,name,lastname,country} = req.body;
    const data = {
        username: username,
        name: name,
        lastname: lastname,
        country: country
    }
    await User.findByIdAndUpdate({_id: userID}, data);
    return await res.status(202).redirect("/api/settings/profile");
}

//Change password 
export const changePassword = async (req,res) => {
    const {userid, newPassword, confirmNewPassword} = req.body;
    const salt = await bcrypt.genSalt(12);
    const new_password = await bcrypt.hash(newPassword, salt);
    await User.findOneAndUpdate({_id: userid},{password: new_password});
    res.clearCookie(cookieapp);
    res.clearCookie(cookiepassword);
    res.clearCookie(cookiesecretqts);
    return res.status(202).redirect("/api/auth/signin");
}

//Change secret Password
export const changeSecretquestions = async (req,res)=> {
    const userid = req.body.userid;
    const data = req.body;
    await SecretQt.findOneAndUpdate({user: userid}, data);
    res.clearCookie(cookiesecretqts);
    return res.status(202).redirect("/api/settings/profile");
}

//Search email
export const searchEmail = async (req,res) => {
    const email = req.body.email;
    const user = await User.findOne({email: email});

    if(!user){
        return res.status(404).json({message: "User not found"})
    }
    return res.status(200).json({message: `User: ${user.email}`});
}

//Reset Account

//Remove Account
export const removeAcc = async (req,res) => {
    const {id} = req.params;
    await User.deleteOne({_id: id});
    await SecretQt.deleteOne({user: id});
    return res.status(202).redirect("/");
}