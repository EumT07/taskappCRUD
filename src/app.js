import * as dotenv from "dotenv";
import express  from "express";
import morgan from "morgan";
import helmet from "helmet"
import cookieParser from "cookie-parser";


//import Routes
dotenv.config();
import homeRoute from "./routers/home.js";
import settingsRoute from "./routers/settings.js";
import authRoute from "./routers/auth.js"



//App
const app = express();


//Settings
app.set("PORT", process.env.PORT || 3002);

//middlewres

//Take each request and show on terminal
app.use(morgan("dev"));
//Red, JSON, formats, request and params from POST
app.use(express.json());
//Helmet
app.use(helmet());
// Recognizes the incoming Request Object as strings or arrays.
app.use(express.urlencoded({extended: false}));
//Cookies
app.use(cookieParser(process.env.cookieSecret))


//export Routes
app.use("/home",homeRoute);
app.use("/api/settings",settingsRoute);
app.use("/api/auth",authRoute);


//Export
export default app;
