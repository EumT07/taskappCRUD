"use strict"
import * as dotenv from "dotenv";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
dotenv.config();

//Creating Secret varible
const SECRET = process.env.SECRET_KEY_JWT;
const cookieName = process.env.COOKIENAME;
export const singup = async (req,res) => {
    const {
        username,
        name,
        lastName,
        email,
        password,
        confirmPassword
    } = req.body;
    try {
        //Getting password and encrypt password
        const encryptPassword = await User.encryptPassword(password);
        //Save info in mongo data base
        const newUser = new User({
            username,
            name,
            lastName,
            email,
            password: encryptPassword
        });

        //Saving data
        const savedUser = await newUser.save();
        //Creating a token
        const token = jwt.sign({id:savedUser._id},SECRET,{
            expiresIn: "24h"
        });
       
        //Create our cookies
        res.cookie(cookieName,token,{
            maxAge: 3600 * 1000,
            secure: true,
            httpOnly: true,
            sameSite: "lax"
        });
        return res.redirect("/api/settings/secretquestions")
    } catch (error) {
        console.log("There is an error: creating user ".red.bold, error.message);
    }
};
export const singin = async (req,res) => {
    const {email} = req.body;
    try {
        // Getting user
        const user = await User.findOne({email: email})
        //Creating a token
        const token = jwt.sign({id: user._id}, SECRET,{
            expiresIn: "24h"
        });
        
        //Create our cookies
        res.cookie(cookieName,token,{
            maxAge: 3600 * 1000,
            secure: true,
            httpOnly: true,
            sameSite: "lax"
        });

        return res.status(202).redirect("/dashboard")
    } catch (error) {
        console.log("There is an error: Signin user ".red.bold, error.message);
    }
};
export const closeSession = async (req,res) => {
    res.clearCookie(cookieName);
    req.session.destroy((err)=>{
        if(err){
            res.status(404).json({message: "error Closing session"});
        }else{
            return res.status(200).redirect("/")
        }
    });
};