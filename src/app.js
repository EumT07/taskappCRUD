import * as dotenv from "dotenv";
import express  from "express";
import morgan from "morgan";
import helmet from "helmet"
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import engine from "ejs-mate";
import session from "express-session";
import flash from "connect-flash"



//import Routes
dotenv.config();
import homeRoute from "./routers/home.js";
import settingsRoute from "./routers/settings.js";
import authRoute from "./routers/auth.js"



//App
const app = express();


//Settings
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "./views"));
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("PORT", process.env.PORT || 3002);

//middlewres

//Take each request and show on terminal
app.use(morgan("dev"));
//Red, JSON, formats, request and params from POST
app.use(express.json());
//Helmet
app.use(helmet());
//Flash connect
app.use(flash());
// Recognizes the incoming Request Object as strings or arrays.
app.use(express.urlencoded({extended: false}));
//Cookies
app.use(cookieParser());
//Session
app.use(session({
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: true
}));

//Conect Flash
app.use((req,res,next) => {
    //User data
    app.locals.username = req.flash("username");
    app.locals.email = req.flash("email");
    app.locals.password = req.flash("password");
    app.locals.confirm_pass = req.flash("confirmPassword");

    //User register
    app.locals.errSignup = req.flash("errSignup");
    app.locals.errSignin = req.flash("errSignin");
    
    next();
})


//export Routes
app.use(homeRoute);
app.use("/api/settings",settingsRoute);
app.use("/api/auth",authRoute);

//Static files: css, javascript
app.use(express.static(path.join(__dirname, "./public")));

//Export
export default app;
