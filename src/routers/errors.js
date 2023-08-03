import { Router } from "express";

const router = Router();

//Error Page
router
    .get("/error", (req,res)=>{
        res.render("./error/error.ejs")
    })
    .get("/token", (req,res)=>{
        res.render("./error/token.ejs")
    })
    .get("/session", (req,res)=>{
        res.render("./error/session.ejs")
    })
    .get("/failrequest", (req,res)=>{
        res.render("./error/failrequest.ejs")
    })


export default router;