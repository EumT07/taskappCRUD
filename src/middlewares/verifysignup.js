"Use strict"
import User from "../models/user.js";

//Checking if user exist or not
export const checkUserSignup = async (req, res, next)=>{
    const {username, email, password, confirmPassword} = req.body;
    console.log(confirmPassword);
    try {
        const user = await User.findOne({username: username});
        
        //Checking username
        if(user){
            req.flash("errSignup", "This Username is already taken"),
            req.flash("username", username),
            req.flash("email", email),
            req.flash("password", password),
            req.flash("confirmPassword", confirmPassword)
            return res.redirect("/api/auth/signup");
        }

        //Checking email
        const userEmail = await User.findOne({email: email});
        if(userEmail){
            req.flash("errSignup", "This email is already taken"),
            req.flash("username", username),
            req.flash("email", email),
            req.flash("password", password),
            req.flash("confirmPassword", confirmPassword)
            return res.redirect("/api/auth/signup");
        };

        //Success
       next();
    } catch (error) {
        // return res.status(501).json(error.message);
        console.log("There is an error: Verify user ".red.bold, error.message);
    }
}

//Cheking Password
export const checkPassword = async (req, res, next) => {
    //Checking data users
    const { email, username, password, confirmPassword} = req.body;
   
    //Regular Expresion
    const characteresLng = (/(?=^.{8,}$)/).test(password);
    const anyNumber = (/(?=.*\d)/).test(password);
    const lowerLetter = (/(?=.*[a-z])/).test(password);
    const anyUppserLetter = (/(?=.*[A-Z])/).test(password);
    const notSpace = (/^\S+$/).test(password);

    try {
        if(password != confirmPassword ){
            req.flash("errSignup", "Password are different")
            req.flash("username", username),
            req.flash("email", email),
            req.flash("password", password),
            req.flash("confirmPassword", confirmPassword)
            return res.redirect("/api/auth/signup");
        }else if(!characteresLng){
            //pass length > 8
            req.flash("errSignup", "Password must have at least 8 characteres [letters-Numbers]"),
            req.flash("username", username),
            req.flash("email", email),
            req.flash("password", password),
            req.flash("confirmPassword", confirmPassword)
            return res.redirect("/api/auth/signup");
        }else if(!lowerLetter){
            //pass must have an Upper letter
            req.flash("errSignup", "Password must have at least a letter"),
            req.flash("username", username),
            req.flash("email", email),
            req.flash("password", password),
            req.flash("confirmPassword", confirmPassword)
            return res.redirect("/api/auth/signup");
        }else if(!anyNumber){
            //pass must have numbers
            req.flash("errSignup", "Password must have at least a number"),
            req.flash("username", username),
            req.flash("email", email),
            req.flash("password", password),
            req.flash("confirmPassword", confirmPassword)
            return res.redirect("/api/auth/signup");
        }else if(!anyUppserLetter){
            //pass must have an Upper letter
            req.flash("errSignup", "Password must have at least an Upper letter"),
            req.flash("username", username),
            req.flash("email", email),
            req.flash("password", password),
            req.flash("confirmPassword", confirmPassword)
            return res.redirect("/api/auth/signup");
        }else if(!notSpace){
            //pass must not have any space
            req.flash("errSignup", "Password must not have any blank space"),
            req.flash("username", username),
            req.flash("email", email),
            req.flash("password", password),
            req.flash("confirmPassword", confirmPassword)
            return res.redirect("/api/auth/signup");
        }

        next();
    } catch (error) {
        console.log("There is an error: Verify user ".red.bold, error.message);
    }
}

export const checkUserSignin = async (req,res,next) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email: email});

        if(!user){
            req.flash("errSignin", "User not found");
            req.flash("email", email);
            return res.redirect("/api/auth/signin");
        }

        const comparePassword = await User.comparePassword(password, user.password);

        if(!comparePassword){
            req.flash("errSignin", "Wrong password");
            req.flash("email", email)
            return res.redirect("/api/auth/signin");
        }

        next();
    } catch (error) {
        console.log("There is an error: Email user ".red.bold, error.message);
    }

}

//Check username
export const checkUsername = async (req,res,next) => {
    try {
        //New username 
        const newusername = req.body.username;
    
        //Searching user 
        const userID = req.body.userID;
        const user = await User.findById({_id: userID});
    
        //Searching username in our dta
        const usernameFound = await User.find({username: newusername});
    

        if(user.username === newusername){
            next();
            return;
        }

        if(usernameFound.length === 0){
            next();
           return;
        }
    
        if(usernameFound){
            //Css style
            req.flash("usernameFound", "inputUserName");
            //error message
            req.flash("usernameErr", `${newusername} is already exist   `);
            return res.status(202).redirect("/api/settings/profile");
        }
    } catch (error) {
        console.log("There is an error: Checking new user".red.bold, error.message);
    }

}

//Checking new passwords
export const checkNewPassword = async (req, res, next) => {
    //Checking data users
    const {newPassword, confirmNewPassword} = req.body;
  
    //Regular Expresion
    const characteresLng = (/(?=^.{8,}$)/).test(newPassword);
    const anyNumber = (/(?=.*\d)/).test(newPassword);
    const lowerLetter = (/(?=.*[a-z])/).test(newPassword);
    const anyUppserLetter = (/(?=.*[A-Z])/).test(newPassword);
    const notSpace = (/^\S+$/).test(newPassword);

    try {
        if(newPassword != confirmNewPassword ){
            req.flash("errnewpass", "Password are different")
            return res.redirect("/api/settings/changepassword");
        }else if(!characteresLng){
            //pass length > 8
            req.flash("errnewpass", "Password must have at least 8 characteres [letters-Numbers]")
            return res.redirect("/api/settings/changepassword");
        }else if(!lowerLetter){
            //pass must have an Upper letter
            req.flash("errnewpass", "Password must have at least a letter")
            return res.redirect("/api/settings/changepassword");
        }else if(!anyNumber){
            //pass must have numbers
            req.flash("errnewpass", "Password must have at least a number")
            return res.redirect("/api/settings/changepassword");
        }else if(!anyUppserLetter){
            //pass must have an Upper letter
            req.flash("errnewpass", "Password must have at least an Upper letter")
            return res.redirect("/api/settings/changepassword");
        }else if(!notSpace){
            //pass must not have any space
            req.flash("errnewpass", "Password must not have any blank space")
            return res.redirect("/api/settings/changepassword");
        }

        next();
    } catch (error) {
        console.log("There is an error: Cverifying new password".red.bold, error.message);
    }
}