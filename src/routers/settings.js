"user strict"
import * as dotenv from "dotenv";
import { Router } from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import {
    verifyToken,
    verifyPinCode,
    creatingtokenPass,
    creatingtokenSecretqts,
    verifytokenpass,
    verifytokensecretqts
 }  from "../middlewares/verifytoken.js";
import {
    checkPassword,
    checkUsername,
    checkNewPassword
} from "../middlewares/verifysignup.js";
import {
    secretQuestions,
    updateUser,
    removeAcc,
    pincode,
    changePassword
 } from "../controllers/usersettigns.js";

dotenv.config();

const router = Router();

//Profile Page
router 
    .get("/profile", verifyToken, async (req, res) =>{
        const user =  await User.findById(req.userID);
        res.render("./settings/profile.ejs", {
            title: "Profile",
            user
        })
    })

//Profile Page: Updatting user
router
    .post("/updateUser", checkUsername ,updateUser)

//Profile Page: Remove user
router
    .get("/removeAcc/:id", removeAcc)

//Profile Page: Secret Quetions
router
    .get("/secretquestions", verifyToken, async (req,res)=>{
        const user = await User.findById(req.userID);
        res.render("./settings/secretqts.ejs", {
            title: "Secret Questions",
            user
        })
    })
    .post("/secretquestions", secretQuestions )

//Profile Page: Pin code
router
    .get("/pincode", verifyToken, async (req,res)=>{
        const user =  await User.findById(req.userID);
        res.render("./settings/pincode.ejs", {
            title: "Pin Code",
            user
        })
    })
    .post("/pincode", pincode) 

//Profile Page : Checking Pin > change password
router
    .post("/pinchangepass", [verifyPinCode, creatingtokenPass], (req,res) => {
        req.flash("id", `${req.ID}`);
        return res.status(200).redirect("/api/settings/changepassword");
    })
    .post("/pinchangesecretqts", [verifyPinCode, creatingtokenSecretqts],(req, res)=>{
        req.flash("id", `${req.ID}`)
        return res.status(200).redirect("/api/settings/changesecretquestions");
    })


//Change Password
router
    .get("/changepassword",  verifytokenpass, async (req, res)=>{
        const user = await User.findById(req.userID);
        res.render("./settings/changepass.ejs",{
            title: "Change Password",
            user
        })
    })
    .post("/changepassword", checkNewPassword ,changePassword)

//change Secret Questions
router
    .get("/changesecretquestions",  verifytokensecretqts ,async (req, res)=>{
        const user = await User.findById(req.userID);
        res.render("./settings/changesecretqts.ejs",{
            title: "Change Secret Questions",
            user
        })
    })

//Reset Password
.get("/resetpassword", verifyToken, async (req, res)=>{
    const user = await User.findById(req.userID);
    res.render("./settings/resetpass.ejs",{
        title: "Reset Password",
        user
    });
})


export default router;