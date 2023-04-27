"user strict"
import { Router } from "express";
import {verifyToken}  from "../middlewares/verifytoken.js";

const router = Router();
//Lading Page
router
    .get("/", (req,res)=>{
        res.render("index.ejs", {title: "Taskapp"});
    });
//Dashboard
router
    .get("/dashboard",(req,res)=>{
        res.render("dashboard.ejs", {title: "Dashboard"});
    })
//Profile
router 
    .get("/profile", verifyToken, (req, res) =>{
        res.status(200).json({
            page: "Profile",
            description:"Here we will find our: Profile"
        });
    })
export default router;