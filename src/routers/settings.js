"user strict"
import { Router } from "express";
import User from "../models/user.js";
import {verifyToken, }  from "../middlewares/verifytoken.js";
import {
    checkUsername
} from "../middlewares/verifysignup.js";
import {
    secretQuestions,
    updateUser,
    removeAcc
 } from "../controllers/usersettigns.js";

const router = Router();

//Profile
router 
    .get("/profile", verifyToken, async (req, res) =>{
        const user =  await User.findById(req.userID);
        res.render("./settings/profile.ejs", {
            title: "Profile",
            user
        })
    });

//Updatting user
router
    .post("/updateUser", checkUsername ,updateUser);

//Remove user
router
    .get("/removeAcc/:id", removeAcc);

//Settings
// router
//     .get("/", verifyToken, async (req,res)=>{
//         const user =  await User.findById(req.userID);
//         res.render("./settings/settings.ejs", {
//             title: "settings",
//             user
//         })
//     });

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