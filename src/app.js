import * as dotenv from "dotenv";
import express  from "express";
import morgan from "morgan";
import helmet from "helmet"
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import engine from "ejs-mate";
import session from "express-session";
import flash from "connect-flash";

dotenv.config();
//Getting all routes
import homeRoute from "./routers/home.js";
import settingsRoute from "./routers/settings.js";
import authRoute from "./routers/auth.js";
import search from "./routers/recovery.js";
import errors from "./routers/errors.js";

//Import Roles and Admin
import { createRoles, adminRole} from "./controllers/admin.js";

/** Create APP */
const app = express();
createRoles();
adminRole();

/** __Filename:  root-file */
const __filename = fileURLToPath(import.meta.url);
/** __Dirname: root:folder  */
const __dirname = path.dirname(__filename);
/** Show views- ejs(html) */
app.set("views", path.join(__dirname, "./views"));
app.engine("ejs", engine);
app.set("view engine", "ejs");
/** Run Port: 3000 */
app.set("PORT", process.env.PORT || 3002);
/**Take each request and show on terminal*/
app.use(morgan("dev"));
/** Red, JSON, formats, request and params from POST */
app.use(express.json());
/** Helmet */
// helps you secure your Node.js application by setting several HTTP headers. It acts as a middleware for Express and similar technologies, automatically adding or removing HTTP headers to comply with web security standards.
app.use(helmet());
/** Flash connect */
app.use(flash());
/** Recognizes the incoming Request Object as strings or arrays. */
app.use(express.urlencoded({extended: false}));
/** Cookies */
app.use(cookieParser());
/** Session */
app.use(session({
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: true
}));

/** Get Flash messages */
app.use((req,res,next) => {
    //flash message: User data
    app.locals.id = req.flash("id");
    app.locals.username = req.flash("username");
    app.locals.email = req.flash("email");
    app.locals.password = req.flash("password");
    app.locals.confirmPassword = req.flash("confirmPassword");

    //flash message: Users Errors
    app.locals.errSignup = req.flash("errSignup");
    app.locals.errSignin = req.flash("errSignin");
    app.locals.errnewpass = req.flash("errnewpass")

    //flash message: Users Not Found
    app.locals.usernameFound = req.flash("usernameFound");
    app.locals.usernameErr = req.flash("usernameErr");
    
    //flash message: Empty field Secretquestions
    app.locals.emptyField = req.flash("emptyField")

    //flash message: PinCode
    app.locals.successPIN = req.flash("successPIN");
    app.locals.errorPIN = req.flash("errorPIN");
    
    //flash message: *Get a Link 
    app.locals.link = req.flash("link");
    
    //flash message: Styles
    app.locals.successStyle = req.flash("successStyle");
    app.locals.errorStyle = req.flash("errorStyle");
    app.locals.inputError = req.flash("inputError");
    //flash message: Style: Secrets QT
    app.locals.inputCss1 = req.flash("inputCss1")
    app.locals.inputCss2 = req.flash("inputCss2")
    app.locals.inputCss3 = req.flash("inputCss3")
    //flash message: Send answer to secretform
    app.locals.answer1 = req.flash("answer1") 
    app.locals.answer2 = req.flash("answer2") 
    app.locals.answer3 = req.flash("answer3")
    
    //Sent emal To pinchange
    app.locals.emailSent = req.flash("emailSent");

    //Image error
    app.locals.imgErr = req.flash("imgErr")
    next();
})

/**
 * Export All route
 */
app.use(homeRoute);
app.use("/api/settings",settingsRoute);
app.use("/api/auth",authRoute);
app.use("/api/recovery",search);
app.use("/api",errors);

//Static files: css, javascript
app.use(express.static(path.join(__dirname, "./public")));

export default app;
