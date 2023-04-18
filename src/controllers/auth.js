"use strict"
import * as dotenv from "dotenv";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const sigup = async (req,res) => {
    const {
        username,
        name,
        lastName,
        email,
        password,
        confirmPassword
    } = req.body;
    //Creating Secret varible
    const SECRET = process.env.SECRET_KEY_JWT;
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
        res.cookie("app-access-token",token,{
            maxAge: 60*60,
            secure: true,
            httpOnly: true,
            sameSite: "lax"
        })
        return res.status(200)
    } catch (error) {
        console.log("There is an error: creating user ".red.bold, error.message);
    }
};
export const sigin = async (req,res) => {
    const {email,password} = req.body;
    console.log(req.body);
};
export const closeSession = async (req,res) => {};