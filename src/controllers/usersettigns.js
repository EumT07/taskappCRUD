"use strict"
import User from "../models/user.js";
import SecretQt from "../models/secretqt.js";
import PIN from "../models/pincode.js";
import bcrypt from "bcryptjs";

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
    const userID = req.body.userid;
    const pinData = req.body;
    const pin = new PIN(pinData);
    pin.user = userID;
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
    return res.status(202).redirect("/api/auth/signin");
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