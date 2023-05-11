"user strict"
import { Router } from "express";
import User from "../models/user.js";
import {
    verifyToken,
    verifyPinCode
 }  from "../middlewares/verifytoken.js";
import {
    checkUsername
} from "../middlewares/verifysignup.js";
import {
    secretQuestions,
    updateUser,
    removeAcc,
    pincode
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

//Checking Pin > change password
router
    .post("/pinchangepass", verifyPinCode)
    .post("/pinchangesecretqts", verifyPinCode)

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

//Pin code
router
    .get("/pincode", verifyToken, async (req,res)=>{
        const user =  await User.findById(req.userID);
        res.render("./settings/pincode.ejs", {
            title: "Pin Code",
            user
        })
    })
    .post("/pincode", pincode)

//Change Password
router
    .get("/changepassword", verifyToken, async (req, res)=>{
        const user = await User.findById(req.userID);
        res.render("./settings/changepass.ejs",{
            title: "Change Password",
            user
        });
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