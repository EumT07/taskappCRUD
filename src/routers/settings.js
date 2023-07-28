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

        //Create Variables
        let highCount = 0;
        let middleCount = 0;
        let lowCount = 0;
        let completeTaskCount = 0;

        //Get how many task by priority user have.
        for (let i = 0; i < tasks.length; i++) {
            if(tasks[i].priority.toLowerCase() === "high"){
                highCount += 1;
            }
            if(tasks[i].priority.toLowerCase() === "middle") {
                middleCount += 1;
            }
            if(tasks[i].priority.toLowerCase() === "low") {
                lowCount += 1;
            }
            if(tasks[i].status === true){
                completeTaskCount += 1;
            }
        }

        //Doing tasks
        let doingTaskCount = tasks.length - completeTaskCount;
        //It allow to display chart-js
        res.set("Content-Security-Policy", "default-src *; style-src 'self' http://\* 'unsafe-inline'; script-src 'self' http://\* 'unsafe-inline' 'unsafe-eval'");
        res.render("./settings/profile.ejs", {
            title: "Profile",
            user,
            img,
            tasks,highCount,middleCount,lowCount,completeTaskCount,doingTaskCount
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

//Graphics
router
    .get("/graphics",taskApp_Token, async (req,res)=>{
        const user = await User.findById(req.userID);
        const img = await Image.findOne({user: user.id})
        const tasks = await Task.find({user: user.id});

        //Create Variables
        let highCount = 0;
        let middleCount = 0;
        let lowCount = 0;
        let completeTaskCount = 0;
        let months = {
            january: 0,
            february: 0,
            march: 0,
            april: 0,
            may: 0,
            june: 0,
            july: 0,
            august: 0,
            september: 0,
            october: 0,
            november: 0,
            december: 0,
        };
        let tasksMonthCompleted = {
            january: 0,
            february: 0,
            march: 0,
            april: 0,
            may: 0,
            june: 0,
            july: 0,
            august: 0,
            september: 0,
            october: 0,
            november: 0,
            december: 0,
        }
        let tasksMonthDoing = {
            january: 0,
            february: 0,
            march: 0,
            april: 0,
            may: 0,
            june: 0,
            july: 0,
            august: 0,
            september: 0,
            october: 0,
            november: 0,
            december: 0,
        }

        //Get how many task by priority user have.
        for (let i = 0; i < tasks.length; i++) {
            if(tasks[i].priority.toLowerCase() === "high"){
                highCount += 1;
            }
            if(tasks[i].priority.toLowerCase() === "middle") {
                middleCount += 1;
            }
            if(tasks[i].priority.toLowerCase() === "low") {
                lowCount += 1;
            }
            if(tasks[i].status === true){
                completeTaskCount += 1;
            }
        }

        //GEt month total
        for (let i = 0; i < tasks.length; i++){
            if(tasks[i].month === "0"){
                months.january += 1;
                if(tasks[i].status === true){
                    tasksMonthCompleted.january += 1;
                }else{
                    tasksMonthDoing.january += 1;
                }
            }
            if(tasks[i].month === "1"){
                months.february += 1;
                if(tasks[i].status === true){
                    tasksMonthCompleted.february += 1;
                }else{
                    tasksMonthDoing.february += 1;
                }
            }
            if(tasks[i].month === "2"){
                months.march += 1;
                if(tasks[i].status === true){
                    tasksMonthCompleted.march += 1;
                }else{
                    tasksMonthDoing.march += 1;
                }
            }
            if(tasks[i].month === "3"){
                months.april += 1;
                if(tasks[i].status === true){
                    tasksMonthCompleted.april += 1;
                }else{
                    tasksMonthDoing.april += 1;
                }
            }
            if(tasks[i].month === "4"){
                months.may += 1;
                if(tasks[i].status === true){
                    tasksMonthCompleted.may += 1;
                }else{
                    tasksMonthDoing.may += 1;
                }
            }
            if(tasks[i].month === "5"){
                months.june += 1;
                if(tasks[i].status === true){
                    tasksMonthCompleted.june += 1;
                }else{
                    tasksMonthDoing.june += 1;
                }
            }
            if(tasks[i].month === "6"){
                months.july += 1;
                if(tasks[i].status === true){
                    tasksMonthCompleted.july += 1;
                }else{
                    tasksMonthDoing.july += 1;
                }
            }
            if(tasks[i].month === "7"){
                months.august += 1;
                if(tasks[i].status === true){
                    tasksMonthCompleted.august += 1;
                }else{
                    tasksMonthDoing.august += 1;
                }
            }
            if(tasks[i].month === "8"){
                months.september += 1;
                if(tasks[i].status === true){
                    tasksMonthCompleted.september += 1;
                }else{
                    tasksMonthDoing.september += 1;
                }
            }
            if(tasks[i].month === "9"){
                months.october += 1;
                if(tasks[i].status === true){
                    tasksMonthCompleted.october += 1;
                }else{
                    tasksMonthDoing.october += 1;
                }
            }
            if(tasks[i].month === "10"){
                months.november += 1;
                if(tasks[i].status === true){
                    tasksMonthCompleted.november += 1;
                }else{
                    tasksMonthDoing.november += 1;
                }
            }
            if(tasks[i].month === "11"){
                months.december += 1;
                if(tasks[i].status === true){
                    tasksMonthCompleted.december += 1;
                }else{
                    tasksMonthDoing.december += 1;
                }
            }
        }
        //Doing tasks
        let doingTaskCount = tasks.length - completeTaskCount;
        //Creatting JSON
        let monthValues = JSON.stringify(months);
        let tasksCompleted = JSON.stringify(tasksMonthCompleted);
        let tasksDoing = JSON.stringify(tasksMonthDoing);
        //Display Chart-js
        res.set("Content-Security-Policy", "default-src *; style-src 'self' http://\* 'unsafe-inline'; script-src 'self' http://\* 'unsafe-inline' 'unsafe-eval'");
        res.render("./settings/graphics.ejs", {
            title: "Taks Graphics",
            user,
            img,
            tasks,
            highCount,middleCount,
            lowCount,
            completeTaskCount,
            doingTaskCount,
            monthValues,
            tasksCompleted,
            tasksDoing
        })
    })

export default router;