"user strict"
import { Router } from "express";
import {
    sigup,
    sigin,
    closeSession
} from "../controllers/auth.js";

const router = Router();

// Register Uer

//Login Out
router
    .get("/signup",(req,res)=>{
        res.status(200).json({
            page: "signup",
            description:"Here we will find our: signup PAge"
        });
    })
    .post("/signup", sigup)

//Login In
router
    .get("/signin", (req,res)=>{
        res.status(200).json({
            page: "signin",
            description:"Here we will find our: sagnin Page"
        });
    })
    .post("/signin",sigin)

//Log out

export default router;