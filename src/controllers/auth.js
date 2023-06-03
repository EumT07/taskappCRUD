"use strict"
import * as dotenv from "dotenv";
import User from "../models/user.js";
import Category from "../models/category.js"
import jwt from "jsonwebtoken";
dotenv.config();

const SECRET = process.env.SECRET_KEY_JWT;
const cookieName = process.env.COOKIENAME;
/**
 * Creatting user 
 * Getting: all data in order to create a new user Account
 */
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
        //Getting password to encrypt password
        const encryptPassword = await User.encryptPassword(password);
        //Save info in mongoDB
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
       
        //Create our cookies (Cookiename, Token)
        //It helps us to create a middlaware to allow the user to be in our app
        res.cookie(cookieName,token,{
            maxAge: 3600 * 1000,
            secure: true,
            httpOnly: true,
            sameSite: "lax"
        });
        return res.redirect("/api/settings/secretquestions");
    } catch (error) {
        console.log("There is an error: Auth: Signup ".red.bold, error.message);
    }
};
/**
 * Getting access to app
 */
export const singin = async (req,res) => {
    const {email} = req.body;
    try {
        // Getting user by Email
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

        return res.status(202).redirect("/dashboard");
    } catch (error) {
        console.log("There is an error: Auth: Signin".red.bold, error.message);
    }
};
//Logout
export const closeSession = async (req,res) => {
    try {
        res.clearCookie(cookieName);
        req.session.destroy();
        return res.status(200).redirect("/");
    } catch (error) {
        console.log("There is an Error: Auth: CloseSession ".red.bold, error.message);
    }
};