"user strict"
import User from "../models/user.js";
import { Router } from "express";
import {
    singup,
    singin,
    closeSession,
    setSecretQuestions,
    setPinCode
} from "../controllers/auth.js";
import {
    checkUserSignup,
    checkUserPassword,
    checkUserSignin,checkEmptyFieldPincode,checkEmptyFieldSecreteqts
} from "../middlewares/verifysignup.js";
import {
    taskApp_Token
 }  from "../middlewares/verifytoken.js";

const router = Router();

/*  Creating Users */

//Sign Up: Creating a new user
router
    .get("/signup",(req,res)=>{
        res.render("./register/signup.ejs", {title: "Sign Up"});
    })
    .post("/signup", [checkUserSignup, checkUserPassword] ,singup)

//Sign In
router
    .get("/signin", (req,res)=>{
        res.render("./register/signin.ejs", {title: "Sign In"});
    })
    .post("/signin", checkUserSignin ,singin)

//Assigning: Secret Quetions to each user
router
    .get("/secretquestions", taskApp_Token, async (req,res)=>{
        const user = await User.findById(req.userID);
        res.render("./register/secretqts.ejs", {
            title: "Secret Questions",
            user
        });
    })
    .post("/secretquestions", checkEmptyFieldSecreteqts ,setSecretQuestions)

//Assigning: Pin code to each user
router
    .get("/pincode", taskApp_Token, async (req,res)=>{
        const user =  await User.findById(req.userID);
        res.render("./register/pincode.ejs", {
            title: "Pin Code",
            user
        })
    }) 
    .post("/pincode", checkEmptyFieldPincode ,setPinCode)   

//Log out: Closing all session
router
    .get("/logout", closeSession);
    
export default router;