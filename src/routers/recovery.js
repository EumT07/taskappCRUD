"user strict"
import { Router } from "express";
import User from "../models/user.js";
import Secretqt from "../models/secretqt.js";
import { searchUser, resetPassword  } from "../controllers/usersettings.js";
import {checkResetPassword} from "../middlewares/verifysignup.js"
import {
    verifyRecoveryToken,
    verifyPinCode,
    verifyPinAccess,
    verifyAccessToken,
    verifySecretAnswers,
    verifySecretqtsAccess
} from "../middlewares/verifytoken.js"

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
//Reset Password
router
    .get("/resetpassword", verifyAccessToken, async (req, res)=>{
        const user = await User.findById(req.ID);
        res.render("./recovery/resetpass.ejs",{
            title: "Reset Password",
            user
        })
    })
    .post("/resetpassword", checkResetPassword, resetPassword)

export default router;