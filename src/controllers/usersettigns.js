"use strict"
import User from "../models/user.js";
import SecretQt from "../models/secretqt.js";
import bcrypt from "bcryptjs";

//Set security questions
export const secretQuestions = async (req,res)=>{
    const userID = req.body.userID;
    const body = req.body;
    const setSecretqt = new SecretQt(body);
    setSecretqt.user = userID;
    await setSecretqt.save();
    return res.status(202).json({
        message: "Secret questions was creating successfuly"
    })
}