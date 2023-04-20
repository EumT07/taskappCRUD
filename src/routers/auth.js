"user strict"
import { Router } from "express";
import {
    sigup,
    sigin,
    closeSession
} from "../controllers/auth.js";
import {
    checkUser,
    checkPassword
} from "../middlewares/verifysignup.js";

const router = Router();

// Register Uer

//Login Out
router
    .get("/signup",(req,res)=>{
        res.render("./register/signup.ejs", {title: "Sign Up"})
    })
    .post("/signup", [checkUser, checkPassword] ,sigup)

//Login In
router
    .get("/signin", (req,res)=>{
        res.render("./register/signin.ejs", {title: "Sign in"})
    })
    .post("/signin", sigin)

//Log out
router
    .get("/logout", closeSession);
    
export default router;