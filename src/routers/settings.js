"user strict"
import { Router } from "express";
import User from "../models/user.js";
import Image from "../models/profileImg.js";
import Task from "../models/tasks.js";
import {
    taskApp_Token,
    verifyPinCode,
    creatingPassToken,
    creatingSecretqtsToken,
    verifyPassToken,
    verifySecretqtsToken,
    sendToken_to_userEmail,
    verifyToken_from_UserEmail,
    emptyField_changePinCode,
    emptyField_changesecretqts
 }  from "../middlewares/verifytoken.js";
import {
    checkEmptyFieldPincode
} from "../middlewares/verifysignup.js";
import {
    checkUsername,
    checkNewPassword
} from "../middlewares/updates.js";
import {
    profilePhotoUpdate,
    updateProfile_UserInfo,
    removeAcc,
    changePassword,
    changeSecretquestions,
    resetAcc,
    deleteProfilePhoto,
    changePinCode
 } from "../controllers/usersettings.js";
import upload from "../middlewares/multer.js";


const router = Router();

//Profile Page
router 
    .get("/profile", taskApp_Token, async (req, res) =>{
        const user =  await User.findById(req.userID);
        const img = await Image.findOne({user: user.id})
        const tasks = await Task.find({user: user.id});
        res.render("./settings/profile.ejs", {
            title: "Profile",
            user,
            img,
            tasks
        })
    })

//Profile Page: Updatting user (name, lastname, country)
router
    .post("/updateUser", [upload, profilePhotoUpdate ,checkUsername ], updateProfile_UserInfo)
    .get("/removephoto/:id", deleteProfilePhoto)

//Profile Page : Updating Security

router
    //Checking email to change pincode
    .post("/pincodeEmail", sendToken_to_userEmail)

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

//Change Pincode: Not ready

router
    .get("/changepincode/:token", verifyToken_from_UserEmail,(req,res)=>{
        const {id} = req.userID;
        const {token} = req.params;
        res.render("./settings/changepincode.ejs",{
            title: "Change pin-code",
            id,token
        });
    })
    .post("/changepincode", emptyField_changePinCode, changePinCode )

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

//change Secret Questions: * emptyfield
router
    .get("/changesecretquestions",  verifySecretqtsToken ,async (req, res)=>{
        const user = await User.findById(req.userID);
        res.render("./settings/changesecretqts.ejs",{
            title: "Change Secret Questions",
            user
        });
    })
    .post("/changesecretquestions", emptyField_changesecretqts ,changeSecretquestions)

//Profile Page: Remove user
router
    .get("/resetAcc/:id", resetAcc)
    .get("/removeAcc/:id", removeAcc)

export default router;