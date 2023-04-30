"user strict"
import { Router } from "express";
import User from "../models/user.js";
import {verifyToken}  from "../middlewares/verifytoken.js";
import { secretQuestions } from "../controllers/usersettigns.js";

const router = Router();

//Settings
router
    .get("/", (req,res)=>{
        res.status(200).json({
            page: "Settings",
            description:"Here we will find our: settings"
        });
    });

//Secret Quetions
router
    .get("/secretquestions", verifyToken, async (req,res)=>{
        const user = await User.findById(req.userID);
        res.render("./settings/secretqts.ejs", {
            title: "Secret Questions",
            user
        });
    })
    .post("/secretquestions", secretQuestions )

//Change Password

//Change secretqt

//Reset Password

//Reset Secretqt

export default router;