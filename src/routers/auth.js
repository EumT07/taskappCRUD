"user strict"
import { Router } from "express";
import {
    singup,
    singin,
    closeSession
} from "../controllers/auth.js";
import {
    checkUserSignup,
    checkPassword,
    checkUserSignin
} from "../middlewares/verifysignup.js";

const router = Router();

// Register Uer

//Login Out
router
    .get("/signup",(req,res)=>{
        res.render("./register/signup.ejs", {title: "Sign Up"})
    })
    .post("/signup", [checkUserSignup, checkPassword] ,singup)

//Login In
router
    .get("/signin", (req,res)=>{
        res.render("./register/signin.ejs", {title: "Sign In"})
    })
    .post("/signin", checkUserSignin ,singin)

//Log out
router
    .get("/logout", closeSession);
    
export default router;