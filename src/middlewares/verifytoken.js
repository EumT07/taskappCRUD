"use strict"
import * as dotenv from "dotenv";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
dotenv.config();

//Verify Token
export const verifyToken = async (req, res, next) => {
    const SECRET = process.env.SECRET_KEY_JWT;
    const cookieName = process.env.COOKIENAME;
    const token = req.cookies[cookieName] || req.headers[cookieName];
    
    try {
        if(!token){
            return res.status(404).json({message: "No token Provided"});
        }
        //Decode Token
        const tokenDecoded = jwt.verify(token, SECRET);
        req.userID = tokenDecoded.id;

        //Identify user
        const user = await User.findById(req.userID);

        //Check if user exists or not.
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        //If user exists go on
        next();


    } catch (error) {
        console.log("There is an error: Verify Token ".red.bold, error.message);
    }
}