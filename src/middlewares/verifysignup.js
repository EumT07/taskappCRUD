"Use strict"
import User from "../models/user.js";

//Checking if user exist or not
export const checkUserSignup = async (req, res, next)=>{
    const {username, email, password, confirmPassword} = req.body;
    
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
       return next();
    } catch (error) {
        // return res.status(501).json(error.message);
        console.log("There is an error: Signup: Check user ".red.bold, error.message);
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

        return next();
    } catch (error) {
        console.log("There is an error: Signup: Check Password ".red.bold, error.message);
    }
}

export const checkUserSignin = async (req,res,next) => {
    const {email, password} = req.body;
    try {
        //Getting user Info 
        const user = await User.findOne({email: email});
        //Checking is user Exist or not
        if(!user){
            req.flash("errSignin", "User not found");
            req.flash("email", email);
            return res.redirect("/api/auth/signin");
        }
        //Comparing password 
        const comparePassword = await User.comparePassword(password, user.password);
        //Is the same password or not?
        if(!comparePassword){
            req.flash("errSignin", "Wrong password");
            req.flash("email", email)
            return res.redirect("/api/auth/signin");
        }
        //Return
        return next();
    } catch (error) {
        console.log("There is an error: Signin: Check User ".red.bold, error.message);
    }

}

//Updating User: username
export const checkUsername = async (req,res,next) => {
    try {
        //New username 
        const newusername = req.body.username;
    
        //Searching user 
        const userID = req.body.userID;
        const user = await User.findById({_id: userID});
    
        //Searching username in our dta
        const usernameFound = await User.find({username: newusername});
    
        //Is the same user?
        if(user.username === newusername){
            return next();;
        }
        //is  Data Empty
        if(usernameFound.length === 0){
           return next();
        }
        
        //USer exist
        if(usernameFound){
            //Css style
            req.flash("usernameFound", "inputUserName");
            //error message
            req.flash("usernameErr", `${newusername} is already exist   `);
            //Return
            return res.status(202).redirect("/api/settings/profile");
        }
    } catch (error) {
        console.log("There is an error: Setting-Profile: check user name".red.bold, error.message);
    }

}

//Updating: Old password to a new passwords
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

        return next();
    } catch (error) {
        console.log("There is an error: Middlewate-Signup: Verifying new password".red.bold, error.message);
    }
}

//Reset Password to a new One
export const checkResetPassword = async (req,res,next) => {
    //Checking data users
    const {newPassword, confirmNewPassword} = req.body;
    //Regular Expresion
    const characteresLng = (/(?=^.{8,}$)/).test(newPassword);
    const anyNumber = (/(?=.*\d)/).test(newPassword);
    const lowerLetter = (/(?=.*[a-z])/).test(newPassword);
    const anyUppserLetter = (/(?=.*[A-Z])/).test(newPassword);
    const notSpace = (/^\S+$/).test(newPassword);

    try {
        if(newPassword !== confirmNewPassword ){
            req.flash("errnewpass", "Password are different")
            return res.redirect("/api/recovery/resetpassword");
        }else if(!characteresLng){
            //pass length > 8
            req.flash("errnewpass", "Password must have at least 8 characteres [letters-Numbers]")
            return res.redirect("/api/recovery/resetpassword");
        }else if(!lowerLetter){
            //pass must have an Upper letter
            req.flash("errnewpass", "Password must have at least a letter")
            return res.redirect("/api/recovery/resetpassword");
        }else if(!anyNumber){
            //pass must have numbers
            req.flash("errnewpass", "Password must have at least a number")
            return res.redirect("/api/recovery/resetpassword");
        }else if(!anyUppserLetter){
            //pass must have an Upper letter
            req.flash("errnewpass", "Password must have at least an Upper letter")
            return res.redirect("/api/recovery/resetpassword");
        }else if(!notSpace){
            //pass must not have any space
            req.flash("errnewpass", "Password must not have any blank space")
            return res.redirect("/api/recovery/resetpassword");
        }

        return next();
    } catch (error) {
        console.log("There is an error: Middleware-Signup- Path: Recovery-Reset Password".red.bold, error.message);
    }
}

//Verify Pincode Fild
export const checkEmptyFieldPincode = async (req,res,next) => {
    const {pin1,pin2,pin3,pin4,pin5,pin6} = req.body;

    const regExpPin1 = (/^$/).test(pin1)
    const regExpPin2 = (/^$/).test(pin2)
    const regExpPin3 = (/^$/).test(pin3)
    const regExpPin4 = (/^$/).test(pin4)
    const regExpPin5 = (/^$/).test(pin5)
    const regExpPin6 = (/^$/).test(pin6)

    try {
        if(regExpPin1 || regExpPin2 || regExpPin3 || regExpPin4 || regExpPin5 || regExpPin6){
            req.flash("emptyField", "It must not have Empty field")
            res.status(303).redirect("/api/settings/pincode");
            return;
        }
    
        return next();
    } catch (error) {
        console.log("There is an Error: Check Empty Field: pincode".red.bold, error.message);
    }
}

//Verify Secret QTS Fild 
export const checkEmptyFieldSecreteqts = async (req,res,next) => {
    const {answer1,answer2,answer3} = req.body;

    const regExAnswer1 = (/^$/).test(answer1);
    const regExAnswer2 = (/^$/).test(answer2);
    const regExAnswer3 = (/^$/).test(answer3);
    
   try {
        if(regExAnswer1 || regExAnswer2 || regExAnswer3){
            req.flash("emptyField", "It must not have Empty field")
            res.status(303).redirect("/api/settings/secretquestions");
            return;
        }

        return next();
   } catch (error) {
        console.log("There is an Error: Check Empty Field: secretqts".red.bold, error.message);
   }
}

