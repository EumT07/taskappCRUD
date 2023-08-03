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
        //Render
        res.render("./dashboard/controladmin.ejs",{users});
        
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