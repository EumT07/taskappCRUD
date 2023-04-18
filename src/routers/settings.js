"user strict"
import { Router } from "express";

const router = Router();

router
    .get("/", (req,res)=>{
        res.status(200).json({
            page: "Settings",
            description:"Here we will find our: settings"
        });
    });

export default router;