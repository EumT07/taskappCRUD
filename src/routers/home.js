"user strict"
import { Router } from "express";

const router = Router();
//Lading Page
router
    .get("/", (req,res)=>{
        res.status(200).json({
            page: "Home",
            description:"Here we will find our LandingPAge"
        });
    });
router
    .get("/dashboard",(req,res)=>{
        res.status(200).json({
            page: "Dashboard",
            description:"Here we will find our: DashBoard"
        });
    })

export default router;