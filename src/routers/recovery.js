"user strict"
import { Router } from "express";
import User from "../models/user.js";
import Secretqt from "../models/secretqt.js";
import { searchUser, resetPassword } from "../controllers/recovery.js";
import {
    verifyPinCode
} from "../middlewares/verifytoken.js"
import {
    verifyRecoveryToken,
    verifyPinAccess,
    verifyAccessToken,
    verifySecretAnswers,
    verifySecretqtsAccess,
    checkCookie_ResetPassword,
    checkToken_ResetPassword,
    sendEmail_resetPassword,
    getAccssEmail_resetPassword
} from "../middlewares/recovery.js"

const router = Router();

//Search Email - User.
router
    .get("/search",(req,res)=>{
        res.render("./recovery/searchemail.ejs", {
            title: "Search"
        })
    })
    .post("/searchuser", searchUser)

//Options: Creating a new token: to view option
router
    .get("/options", verifyRecoveryToken, (req,res)=>{
        res.render("./recovery/options.ejs", {
            title: "Options"
        })
    })

//PINCode
router 
    .get("/pincode", verifyRecoveryToken, async (req,res)=>{
        const user = await User.findById(req.ID);
        res.render("./recovery/pincode.ejs",{
            title: "PIN",
            user
        })
    })
    .post("/pinaccess",verifyPinCode, verifyPinAccess)
//Secrete QTS
router
    .get("/secretqts", verifyRecoveryToken, async (req,res) => {
        const secretQts = await Secretqt.find({user: req.ID})
        res.render("./recovery/secretqts.ejs",{
            title: "Security Questions",
            secretQts
        });
    })
    .post("/secretanswers", verifySecretAnswers, verifySecretqtsAccess)
//Email *
router
    .get("/email", verifyRecoveryToken, sendEmail_resetPassword)
    
//Reset Password: by Cookies
router
    .get("/resetpassword", verifyAccessToken, async (req, res)=>{
        const user = await User.findById(req.ID);
        res.render("./recovery/resetpass.ejs",{
            title: "Reset Password",
            user
        })
    })
    .post("/resetpassword", checkCookie_ResetPassword, resetPassword)

//reset Password: by Email token
router
    .get("/resetpassword/:token", getAccssEmail_resetPassword ,async (req, res)=>{
        const user = await User.findById(req.userID);
        const {token} = req.params;
        res.render("./recovery/resetpass2.ejs",{
            title: "Reset Password",
            user,
            token
        })
    })
    
    .post("/resetpassword2", checkToken_ResetPassword ,resetPassword)

export default router;