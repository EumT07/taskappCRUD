"user strict"
import User from "../models/user.js";
import { Router } from "express";
import {verifyToken}  from "../middlewares/verifytoken.js";

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
        res.render("dashboard.ejs", {
            title: "Dashboard",
            user
        });
    })


export default router;