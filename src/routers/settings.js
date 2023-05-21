"user strict"
import { Router } from "express";
import User from "../models/user.js";
import {
    verifyToken,
    verifyPinCode,
    creatingPassToken,
    creatingSecretqtsToken,
    verifyPassToken,
    verifySecretqtsToken
 }  from "../middlewares/verifytoken.js";
import {
    checkUsername,
    checkNewPassword
} from "../middlewares/verifysignup.js";
import {
    secretQuestions,
    updateUser,
    removeAcc,
    pincode,
    changePassword,
    changeSecretquestions
 } from "../controllers/usersettigns.js";


const router = Router();

//Asigning: Secret Quetions to each user
router
    .get("/secretquestions", verifyToken, async (req,res)=>{
        const user = await User.findById(req.userID);
        res.render("./settings/secretqts.ejs", {
            title: "Secret Questions",
            user
        });
    })
    .post("/secretquestions", secretQuestions)

//Asigning: Pin code to each user
router
    .get("/pincode", verifyToken, async (req,res)=>{
        const user =  await User.findById(req.userID);
        res.render("./settings/pincode.ejs", {
            title: "Pin Code",
            user
        })
    })
    .post("/pincode", pincode) 

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

//Profile Page : 
router
    //Checking Pin to change password
    .post("/pinchangepass", [verifyPinCode, creatingPassToken], (req,res) => {
        req.flash("id", `${req.ID}`);
        return res.status(200).redirect("/api/settings/changepassword");
    })
    //Checking Secret Questions to change password
    .post("/pinchangesecretqts", [verifyPinCode, creatingSecretqtsToken],(req, res)=>{
        req.flash("id", `${req.ID}`)
        return res.status(200).redirect("/api/settings/changesecretquestions");
    })

//Change Password
router
    .get("/changepassword",  verifyPassToken, async (req, res)=>{
        const user = await User.findById(req.userID);
        res.render("./settings/changepass.ejs",{
            title: "Change Password",
            user
        });
    })
    .post("/changepassword", checkNewPassword ,changePassword)

//change Secret Questions
router
    .get("/changesecretquestions",  verifySecretqtsToken ,async (req, res)=>{
        const user = await User.findById(req.userID);
        res.render("./settings/changesecretqts.ejs",{
            title: "Change Secret Questions",
            user
        });
    })
    .post("/changesecretquestions", changeSecretquestions)

//Profile Page: Remove user
router
    .get("/removeAcc/:id", removeAcc)

export default router;