"use strict"
import * as dotenv from "dotenv";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

//Creating Secret varible
const SECRET = process.env.SECRET_KEY_JWT;
const cookieName = process.env.COOKIENAME;
export const sigup = async (req,res) => {
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
            maxAge: 60*60,
            secure: true,
            httpOnly: true,
            sameSite: "lax"
        });
        return res.status(200)
    } catch (error) {
        console.log("There is an error: creating user ".red.bold, error.message);
    }
};
export const sigin = async (req,res) => {
    const {email,password} = req.body;
    try {
        //Search user into data base
        const user = await User.findOne({email: email});
        //if user not exist
        if(!user){
            console.log("User not found");
            return;
        }
        //Checking password 
        const comparePassword = await User.comparePassword(password, user.password);

        if(!comparePassword){
            console.log("Wrong Password");
            return;
        }
        //Creating a token
        const token = jwt.sign({id: user._id}, SECRET,{
            expiresIn: "24h"
        });
        console.log(token);
        //Create our cookies
        res.cookie(cookieName,token,{
            maxAge: 60*60,
            secure: true,
            httpOnly: true,
            sameSite: "lax"
        });

    } catch (error) {
        console.log("There is an error: Signin user ".red.bold, error.message);
    }
};
export const closeSession = async (req,res) => {
    res.clearCookie("app-access-token");
    req.session.destroy((err)=>{
        if(err){
            res.status(404).json({message: "error Closing session"});
        }else{
            return res.status(200).json({message: "Successfuly"})
        }
    });
};