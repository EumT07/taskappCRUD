/**
 * Import Mongoose database
 * @module Database
*/
import Mongoose from "mongoose";
import "colors";
import { sendErrorMail } from "./mail/mail.js";
import {taskAppError} from "./error/handlerError.js"

const mongoURL = process.env.MONGO_URL;

async function startDataBase() {
    try {
        const dataBase = await Mongoose.connect(`mongodb://localhost/${mongoURL}`,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4
        });
        console.log("DataBase is connected to: ".bgBlue, dataBase.connection.name);
    } catch (error) {
        console.log("Erro Connection data base: ".red.bold, error.message);
        const message = taskAppError(res = null,"Error Trying to connect with database:",500);
        // sendErrorMail(message);
    }
}
startDataBase();