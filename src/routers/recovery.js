"user strict"
import { Router } from "express";
import User from "../models/user.js";

const router = Router();

//Search Email - User.
router
    .get("/search",(req,res)=>{
        res.render("./recovery/searchemail.ejs", {
            title: "Search"
        })
    })

//Options: Create a token
router
    .get("/options",(req,res)=>{
        res.render("./recovery/options.ejs", {
            title: "Reset Password"
        })
    })

//PINCode
router 
    .get("/pincode", (req,res)=>{
        res.render("./recovery/pincode.ejs",{
            title: "PIN"
        })
    })

//Secrete QTS



//Reset Password
router
    .get("/resetpassword",  async (req, res)=>{
        res.render("./recovery/resetpass.ejs",{
            title: "Reset Password",
        });
    })


export default router;