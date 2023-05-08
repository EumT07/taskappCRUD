"use strict"
import User from "../models/user.js";
import SecretQt from "../models/secretqt.js";
import bcrypt from "bcryptjs";

//Set security questions
export const secretQuestions = async (req,res)=>{
    const userID = req.body.userid;
    const body = req.body;
    const setSecretqt = new SecretQt(body);
    setSecretqt.user = userID;
    await setSecretqt.save();
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
    const {email,password, confirmPassword} = req.body;

    if(password !== confirmPassword){
        return res.status(200).json({message: "Password are different"});
    }else if(password.length <= 8){
        return res.status(200).json({message: "Must have more than 8 characteres"});
    }
    const salt = await bcrypt.genSalt(12);
    const newPassword = await bcrypt.hash(password, salt);
    await User.findOneAndUpdate({email: email},{password: newPassword});

    return res.status(200).json({message:"Password have changed"});
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