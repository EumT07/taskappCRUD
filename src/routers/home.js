"user strict"
import User from "../models/user.js";
import Task from "../models/tasks.js";
import Image from "../models/profileImg.js";
import Category from "../models/category.js";
import { Router } from "express";
import {taskApp_Token,verify_adminToken,isAdmin}  from "../middlewares/verifytoken.js";
import {
    createNewTask,
    updateTask,
    deleteTask,
    deleteCategory,
    completeTask,
    cancelCompleteTask,
    dateline
} from "../controllers/task.js"

const router = Router();
//Lading Page
router
    .get("/", async (req,res)=>{
        const user = await User.findById(req.userID);
        res.render("index.ejs", {title: "Taskapp", user});
    });
//Suscribe email
router
    .post("/", async (req, res)=>{
        const value = req.body.data;
        res.redirect(`/api/auth/signup/?data=${value}`)
    })

//Dashboard
router
    .get("/dashboard", taskApp_Token, dateline, async (req,res)=>{
        const user = await User.findById(req.userID);
        const tasks = await Task.find({user: user.id});
        const categories = await Category.find({user: user.id});
        const img = await Image.findOne({user: user.id})
        console.log();
         //Updating user's tasks
         let high_value = 0;
         let middle_value = 0;
         let low_value = 0;
         let imguser = null;
         if(img){
            imguser = img["path"];
         }
         tasks.forEach(tasks => {
             if(tasks.priority.toLowerCase() === "high"){
                 high_value += 1;
             } else if(tasks.priority.toLowerCase() === "middle"){
                 middle_value += 1;
             }else if(tasks.priority.toLowerCase() === "low"){
                 low_value += 1;
             }
         })
     
         let totalTasks = high_value + middle_value + low_value;
         //Create a object
         let data = {
             taskHigh: high_value,
             taskmiddle: middle_value,
             tasklow: low_value,
             totalTasks: totalTasks,
             imgPath: imguser
         }
        //  Saving and updating
         await User.findByIdAndUpdate({_id: user.id},data)

        res.render("./dashboard/dashboard.ejs", {
            title: "Dashboard",
            user,
            tasks,
            categories,
            img
        });
    })
    .post("/newtask", createNewTask)

router
    .get("/updateTask/:id", taskApp_Token, async (req,res) => {
        const {id} = req.params;
        const task = await Task.findById(id);
        const user = await User.findById(task.user);
        const category = await Category.findById(task.category);
        res.render("./dashboard/update.ejs", {
            title: "Updating Task",
            task,
            category,
            user
        });
    })
    .post("/updateTask/:id", updateTask)

//Delete Task and Category
router
    .get("/completeTask/:id", taskApp_Token,completeTask)
    .get("/cancelCompleteTask/:id",taskApp_Token, cancelCompleteTask)
    .get("/deleteTask/:id",taskApp_Token, deleteTask)
    .get("/deleteCategory/:id",taskApp_Token, deleteCategory)

router
    .get("/controladmin", [verify_adminToken, isAdmin], async (req,res)=>{
        //Get users
        const users = await User.find();
        const tasks = await Task.find();

        //Chart js
        //Create Variables

        //Het tasks total
        let highCount = 0;
        let middleCount = 0;
        let lowCount = 0;
        let completeTaskCount = 0;

        //month Obejct
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
        //Task priority by months
        let highMonths_count = {
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
        let middleMonths_count = {
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
        let lowMonths_count = {
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
                if(tasks[i].priority.toLowerCase() === "high"){
                    highMonths_count.january += 1;
                }
                if(tasks[i].priority.toLowerCase() === "middle"){
                    middleMonths_count.january += 1;
                }
                if(tasks[i].priority.toLowerCase() === "low"){
                    lowMonths_count.january += 1;
                }
                
                if(tasks[i].status === true){
                    tasksMonthCompleted.january += 1;
                }else{
                    tasksMonthDoing.january += 1;
                }
            }
            if(tasks[i].month === "1"){
                months.february += 1;
                if(tasks[i].priority.toLowerCase() === "high"){
                    highMonths_count.february += 1;
                }
                if(tasks[i].priority.toLowerCase() === "middle"){
                    middleMonths_count.february+= 1;
                }
                if(tasks[i].priority.toLowerCase() === "low"){
                    lowMonths_count.february += 1;
                }
                
                if(tasks[i].status === true){
                    tasksMonthCompleted.february += 1;
                }else{
                    tasksMonthDoing.february += 1;
                }
            }
            if(tasks[i].month === "2"){
                months.march += 1;
                if(tasks[i].priority.toLowerCase() === "high"){
                    highMonths_count.march += 1;
                }
                if(tasks[i].priority.toLowerCase() === "middle"){
                    middleMonths_count.march += 1;
                }
                if(tasks[i].priority.toLowerCase() === "low"){
                    lowMonths_count.march += 1;
                }
                
                if(tasks[i].status === true){
                    tasksMonthCompleted.march += 1;
                }else{
                    tasksMonthDoing.march += 1;
                }
            }
            if(tasks[i].month === "3"){
                months.april += 1;
                if(tasks[i].priority.toLowerCase() === "high"){
                    highMonths_count.april += 1;
                }
                if(tasks[i].priority.toLowerCase() === "middle"){
                    middleMonths_count.april += 1;
                }
                if(tasks[i].priority.toLowerCase() === "low"){
                    lowMonths_count.april += 1;
                }
                
                if(tasks[i].status === true){
                    tasksMonthCompleted.april += 1;
                }else{
                    tasksMonthDoing.april += 1;
                }
            }
            if(tasks[i].month === "4"){
                months.may += 1;
                if(tasks[i].priority.toLowerCase() === "high"){
                    highMonths_count.may += 1;
                }
                if(tasks[i].priority.toLowerCase() === "middle"){
                    middleMonths_count.may += 1;
                }
                if(tasks[i].priority.toLowerCase() === "low"){
                    lowMonths_count.may += 1;
                }
                
                if(tasks[i].status === true){
                    tasksMonthCompleted.may += 1;
                }else{
                    tasksMonthDoing.may += 1;
                }
            }
            if(tasks[i].month === "5"){
                months.june += 1;
                if(tasks[i].priority.toLowerCase() === "high"){
                    highMonths_count.june += 1;
                }
                if(tasks[i].priority.toLowerCase() === "middle"){
                    middleMonths_count.june += 1;
                }
                if(tasks[i].priority.toLowerCase() === "low"){
                    lowMonths_count.june += 1;
                }
                
                if(tasks[i].status === true){
                    tasksMonthCompleted.june += 1;
                }else{
                    tasksMonthDoing.june += 1;
                }
            }
            if(tasks[i].month === "6"){
                months.july += 1;
                if(tasks[i].priority.toLowerCase() === "high"){
                    highMonths_count.july += 1;
                }
                if(tasks[i].priority.toLowerCase() === "middle"){
                    middleMonths_count.july += 1;
                }
                if(tasks[i].priority.toLowerCase() === "low"){
                    lowMonths_count.july += 1;
                }
                
                if(tasks[i].status === true){
                    tasksMonthCompleted.july += 1;
                }else{
                    tasksMonthDoing.july += 1;
                }
            }
            if(tasks[i].month === "7"){
                months.august += 1;
                if(tasks[i].priority.toLowerCase() === "high"){
                    highMonths_count.august += 1;
                }
                if(tasks[i].priority.toLowerCase() === "middle"){
                    middleMonths_count.august += 1;
                }
                if(tasks[i].priority.toLowerCase() === "low"){
                    lowMonths_count.august += 1;
                }
                
                if(tasks[i].status === true){
                    tasksMonthCompleted.august += 1;
                }else{
                    tasksMonthDoing.august += 1;
                }
            }
            if(tasks[i].month === "8"){
                months.september += 1;
                if(tasks[i].priority.toLowerCase() === "high"){
                    highMonths_count.september += 1;
                }if(tasks[i].priority.toLowerCase() === "middle"){
                    middleMonths_count.september += 1;
                }if(tasks[i].priority.toLowerCase() === "low"){
                    lowMonths_count.september += 1;
                }
                
                if(tasks[i].status === true){
                    tasksMonthCompleted.september += 1;
                }else{
                    tasksMonthDoing.september += 1;
                }
            }
            if(tasks[i].month === "9"){
                months.october += 1;
                if(tasks[i].priority.toLowerCase() === "high"){
                    highMonths_count.october += 1;
                }
                if(tasks[i].priority.toLowerCase() === "middle"){
                    middleMonths_count.october += 1;
                }
                if(tasks[i].priority.toLowerCase() === "low"){
                    lowMonths_count.october += 1;
                }

                if(tasks[i].status === true){
                    tasksMonthCompleted.october += 1;
                }else{
                    tasksMonthDoing.october += 1;
                }
            }
            if(tasks[i].month === "10"){
                months.november += 1;
                if(tasks[i].priority.toLowerCase() === "high"){
                    highMonths_count.november += 1;
                }
                if(tasks[i].priority.toLowerCase() === "middle"){
                    middleMonths_count.november += 1;
                }
                if(tasks[i].priority.toLowerCase() === "low"){
                    lowMonths_count.november += 1;
                }

                if(tasks[i].status === true){
                    tasksMonthCompleted.november += 1;
                }else{
                    tasksMonthDoing.november += 1;
                }
            }
            if(tasks[i].month === "11"){
                months.december += 1;
                if(tasks[i].priority.toLowerCase() === "high"){
                    highMonths_count.december += 1;
                }
                if(tasks[i].priority.toLowerCase() === "middle"){
                    middleMonths_count.december += 1;
                }
                if(tasks[i].priority.toLowerCase() === "low"){
                    lowMonths_count.december += 1;
                }

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
        let tasks_highMonths = JSON.stringify(highMonths_count);
        let tasks_middleMonths = JSON.stringify(middleMonths_count);
        let tasks_lowMonths = JSON.stringify(lowMonths_count);
        //Display Chart-js
        res.set("Content-Security-Policy", "default-src *; style-src 'self' http://\* 'unsafe-inline'; script-src 'self' http://\* 'unsafe-inline' 'unsafe-eval'");

        //Render
        res.render("./dashboard/controladmin.ejs",{
            users,
            tasks,
            highCount,
            middleCount,
            lowCount,
            completeTaskCount,
            doingTaskCount,
            monthValues,
            tasksCompleted,
            tasksDoing,
            tasks_highMonths,
            tasks_middleMonths,
            tasks_lowMonths
        });
        
    })

router
    .get("/privacy-policy", async (req,res)=>{
        const user = await User.findById(req.userID);
        res.render("./politics/privacy.ejs",{
            title: "Politc Policy",
            user
        })
    })
    .get("/termsandconditions", async (req,res)=>{
        const user = await User.findById(req.userID);
        res.render("./politics/terms.ejs",{
            title: "Term and Conditions",
            user
        })
    });

export default router;