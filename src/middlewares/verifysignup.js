"Use strict"
import User from "../models/user.js";

//Checking if user exist or not
export const checkUserSignup = async (req, res, next)=>{
    const {username, email, password, confirm_password} = req.body;
    try {
        const user = await User.findOne({username: username});
        
        //Checking username
        if(user){
            req.flash("errSignup", "This Username is already taken"),
            req.flash("username", username),
            req.flash("email", email),
            req.flash("password", password),
            req.flash("confirmPassword", confirm_password)
            return res.redirect("/api/auth/signup");
        }

        //Checking email
        const userEmail = await User.findOne({email: email});
        if(userEmail){
            req.flash("errSignup", "This email is already taken"),
            req.flash("username", username),
            req.flash("email", email),
            req.flash("password", password),
            req.flash("confirmPassword", confirm_password)
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