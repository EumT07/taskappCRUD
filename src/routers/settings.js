"user strict"
import { Router } from "express";
import User from "../models/user.js";
import {
    verifyToken,
    verifyPinCode
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
    .post("/pinchangepass", verifyPinCode, (req,res) => {
        if(!req.result){
            req.flash("errorPIN","Sorry Incorrect PIN, try again..!!");
            req.flash("errorStyle", "errorStyle");
            return res.status(200).redirect("/api/settings/profile?data=changepass");
        }else{
            req.flash("id", `${req.ID}`);
            req.flash("link", "/api/settings/changepassword");
            req.flash("successStyle", "successStyle");
            req.flash("successPIN"," ¡¡¡ change !!! ");
            return res.status(200).redirect("/api/settings/profile?data=changepass");
        }
    })
    .post("/pinchangesecretqts", verifyPinCode, (req, res)=>{
        if(!req.result){
            req.flash("errorPIN","Sorry Incorrect PIN, try again..!!");
            req.flash("errorStyle", "errorStyle");
            return res.status(200).redirect("/api/settings/profile?data=changesecretqts");
        }else{
            req.flash("id", `${req.ID}`)
            req.flash("link", "/api/settings/changesecretquestions");
            req.flash("successStyle", "successStyle");
            req.flash("successPIN"," ¡¡¡ change !!! ");
            return res.status(200).redirect("/api/settings/profile?data=changesecretqts");
        }
    })


//Change Password
router
    .get("/changepassword", verifyToken, async (req, res)=>{
        const user = await User.findById(req.userID);
        res.render("./settings/changepass.ejs",{
            title: "Change Password",
            user
        })
    })
    .post("/changepassword", checkNewPassword ,changePassword)

//change Secret Questions
router
    .get("/changesecretquestions", verifyToken,  async (req, res)=>{
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