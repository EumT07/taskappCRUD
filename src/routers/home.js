"user strict"
import User from "../models/user.js";
import Task from "../models/tasks.js";
import Category from "../models/category.js";
import { Router } from "express";
import {verifyToken}  from "../middlewares/verifytoken.js";
import {createNewTask} from "../controllers/usersettings.js"

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
    .get("/dashboard", verifyToken, async (req,res)=>{
        const user = await User.findById(req.userID);
        const tasks = await Task.find({user: user.id});
        const categories = await Category.find({user: user.id});
        res.render("./dashboard/dashboard.ejs", {
            title: "Dashboard",
            user,
            tasks,
            categories
        });
    })
    .post("/newtask", createNewTask)


export default router;