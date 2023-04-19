"user strict"
import { Router } from "express";
import {verifyToken}  from "../middlewares/verifytoken.js";

const router = Router();
//Lading Page
router
    .get("/", (req,res)=>{
        res.status(200).json({
            page: "Home",
            description:"Here we will find our LandingPAge"
        });
    });
//Dashboard
router
    .get("/dashboard", verifyToken ,(req,res)=>{
        res.status(200).json({
            page: "Dashboard",
            description:"Here we will find our: DashBoard"
        });
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