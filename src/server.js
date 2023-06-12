/** Import app file */
import app from "./app.js";
/** Import database file */
import "./database.js";
import "colors";
import { sendErrorMail } from "./mail/mail.js";
import {taskAppError} from "./error/handlerError.js";

/** Run our API in PORT : 3000 */
app.listen(app.get("PORT"),()=>{
    try{
        console.log(` This server is running on http://localhost:${app.get("PORT")} `.bgYellow.black.bold);
        console.log("Made by EumT07".bgGreen);
    }catch(err){
        console.log(`There is an Error started app: ${err}`.bgRed);
        const message = taskAppError(res,`There is an Error started app: ${err}`,500);
        sendErrorMail(message);  
    }
})