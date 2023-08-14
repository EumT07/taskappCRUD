"use strict"
import * as dotenv from "dotenv"
import User from "../models/user.js";
import SecretQt from "../models/secretqt.js";
import Tasks from "../models/tasks.js";
import Image from "../models/profileImg.js";
import Category from "../models/category.js"
import PIN from "../models/pincode.js";
import bcrypt from "bcryptjs";
import fs from "node:fs";//File system
import path from "node:path"
import { fileURLToPath } from "node:url";
import {
    changePasswordEmail,
    changeSecretqtsEmail,
    resetAccEmail,
    removetAccEmail } from "../mail/Template/emailTemplate.js";
import {
    taskAppError
} from "../error/handlerError.js";
import {
    sendMail,
    sendErrorMail,
    notificationAppMail
} from "../mail/mail.js";

dotenv.config();

//Getting: Environment Variables
const cookieapp = process.env.COOKIENAME;
const cookiepassword = process.env.COOKPINPASS;
const cookiesecretqts = process.env.COOKPINSECRETQTS;
const cookieAccessToken = process.env.COOKREACCESS;


/** __Filename:  root-file */
const __filename = fileURLToPath(import.meta.url);
/** __Dirname: root:folder  */
const __dirname = path.dirname(__filename);

//Update: Profile Section

//* Set new photo Profile to each user 
export const profilePhotoUpdate = async(req,res,next) => {
    try {
        //Getting user info
        const userID = req.body.userID;
        if(req.file === undefined){
            return next();
        }
        if(req.file.size >= 2500000){
            req.flash("imgErr","imageError");
            await res.status(404).redirect("/api/settings/profile");
            return 

        }
        //Getting data
        const {filename, originalname, mimetype,size} = req.file;
        
        const imgObject = {
            filename: filename,
            path: '/uploads/' + filename,
            originalname,
            mimetype,
            size
        }

        //Search img by user ID
        const photoUserFound = await Image.findOne({user: userID});

        //Check if user has photo
        if(photoUserFound){
            //Get path filename
            const photoUrl = photoUserFound.filename;
            const pathUrl = path.join(__dirname, "../public/uploads")
            
            // Delete photo already exist in uploads
            fs.unlinkSync(`${pathUrl}/${photoUrl}`)

            await Image.findOneAndUpdate({user: userID}, imgObject);
            return next();
        }

        //Create a new photo
        const profileImg = new Image(imgObject);
        profileImg.user = userID;

        await profileImg.save();
        
        next();
    } catch (error) {
        console.log("There is an Error: controllers/usersettings -> profilePhotoUpdate".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: controller Setting-ProfilePhoto - Updating user ",500);
        // sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
}
//* Delete photo by id
export const deleteProfilePhoto = async(req,res,next) => {
   try {
     //req id
     const {id} = req.params;

    //Search img by user ID
    const photoUserFound = await Image.findById(id);

    //Get path filename
    const photoUrl = photoUserFound.filename;
    const pathUrl = path.join(__dirname, "../public/uploads")

    // Delete photo already exist in uploads
    fs.unlinkSync(`${pathUrl}/${photoUrl}`)

    //Search img by Img ID
    await Image.deleteOne({_id: id});
    // Return
     return await res.status(202).redirect("/api/settings/profile");
   } catch (error) {
        console.log("There is an Error: controllers/usersettings deleteProfilePhoto");
        const message = taskAppError(res,"taskAppError: controllers/usersettings deleteProfilePhoto",500);
        // sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
   }

}
//Updating: user info 
export const updateProfile_UserInfo = async (req,res) => {
    try {
        //Getting user info
        const userID = req.body.userID;

        const {username,name,lastname,gender,country} = req.body;
        console.log(req.body);
        //Saving Data updated
        const data = {
            username: username.toLowerCase(),
            name: name.toLowerCase(),
            lastname: lastname.toLowerCase(),
            country: country.toLowerCase(),
            gender: gender.toLowerCase()
        }
        // Updating
        await User.findByIdAndUpdate({_id: userID}, data);
        // Return
        return await res.status(202).redirect("/api/settings/profile");
    } catch (error) {
        console.log("There is an Error: controllers/usersettings updateProfile_UserInfo".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: controller Settings Updating user",500);
        // sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
}

//Update: Profile Security

// Change: pin *email
export const changePinCode = async (req,res)=>{
    try {
    //Gettin user id
    const userID = req.body.userID;
    //Getting all pins
    const {pin1,pin2,pin3,pin4,pin5,pin6} = req.body;
    //Encrypting pins
    const pin1Encrypted = await PIN.encryptPinCode(pin1);
    const pin2Encrypted = await PIN.encryptPinCode(pin2);
    const pin3Encrypted = await PIN.encryptPinCode(pin3);
    const pin4Encrypted = await PIN.encryptPinCode(pin4);
    const pin5Encrypted = await PIN.encryptPinCode(pin5);
    const pin6Encrypted = await PIN.encryptPinCode(pin6);

    //Saving each PIN into models
    const pines = {
        pin1: pin1Encrypted,
        pin2: pin2Encrypted,
        pin3: pin3Encrypted,
        pin4: pin4Encrypted,
        pin5: pin5Encrypted,
        pin6: pin6Encrypted,
    };
    //Updating
    await PIN.findOneAndUpdate({user: userID},pines); 
    //Return
    return res.status(202).redirect("/api/settings/profile?data=changepinreq");
    } catch (error) {
        console.log("There is an Error: controllers/usersettings -> changePinCode".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: controller Settings - Pin code ",500);
        // sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
}

//Changing: password *email
export const changePassword = async (req,res) => {
    try {
        //Getting user info
        const {userid, newPassword, confirmNewPassword} = req.body;
        const salt = await bcrypt.genSalt(12);
        const new_password = await bcrypt.hash(newPassword, salt);
        //updating password
        await User.findOneAndUpdate({_id: userid},{password: new_password});
        //Cleaning all cookies
        res.clearCookie(cookieapp);
        res.clearCookie(cookiepassword);
        res.clearCookie(cookiesecretqts);

        //Send message
        const user = await User.findById(userid);
        const subjectText = `Your Password Has been changed`;
        const htmlContent = changePasswordEmail(user.username);
        // await sendMail(user.email,subjectText,htmlContent);

        //Return
        return res.status(202).redirect("/api/auth/signin");
    } catch (error) {
        console.log("There is an Error: controllers/usersettings -> ChangePassword".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: controller Settings Changing Password",500);
        // sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
}

//Changing: secret Password *email
export const changeSecretquestions = async (req,res)=> {
    try {
        //Getting info
        const userid = req.body.userid;
        const {
            question1,
            answer1,
            question2,
            answer2,
            question3,
            answer3,
        } = req.body;
        //Encrypting answers
        const answer1Encrypted = await SecretQt.encryptsecretqts(answer1);
        const answer2Encrypted = await SecretQt.encryptsecretqts(answer2);
        const answer3Encrypted = await SecretQt.encryptsecretqts(answer3);
        //Saving info
        const data = {
            question1: question1,
            answer1: answer1Encrypted,
            question2: question2,
            answer2: answer2Encrypted,
            question3: question3,
            answer3: answer3Encrypted,
        };
        //Updating all data
        await SecretQt.findOneAndUpdate({user: userid}, data);
        //Cleaning cookies
        res.clearCookie(cookiesecretqts);
        
        //Send message
        const user = await User.findById(userid);
        const subjectText = `Your Secret questions has been changed`;
        const htmlContent = changeSecretqtsEmail(user.username);
        // await sendMail(user.email,subjectText,htmlContent);

        //Return
        return res.status(202).redirect("/api/settings/profile");
    } catch (error) {
        console.log("There is an Error: controllers/usersettings -> changeSecretquestions".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: controller Settings Changing Secret Questions",500);
        // sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
}

//Reset Account *email
export const resetAcc = async (req,res) => {
    try {
        //Get user id
        const {id} = req.params;
        //Removing Tasks From dataBase
        await Tasks.deleteMany({user: id});
        //REmoving Category frim database
        await Category.deleteMany({user: id});

        //Cleaning all cookies
        // res.clearCookie(cookieapp);
        // res.clearCookie(cookieAccessToken);

        //Send message
        const user = await User.findById(id);
        const subjectText = `Your Account has been reseted`;
        const htmlContent = resetAccEmail(user.username);
        // await sendMail(user.email,subjectText,htmlContent);

        //Send notification to taskAppEmail
        const htmlNotification = `
            <h1> Reset Account </h1> 
            <hr>
            <p> The account with this mail <b> ${user.email} </b> has been reseted</p>
        `
        // await notificationAppMail(htmlNotification);

        //Return
        return await res.status(202).redirect("/api/settings/profile/?data=accountdiv");
    } catch (error) {
        console.log("There is an Error: controllers/usersettings -> ResetAcc".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: controller Settings Reset Acc",500);
        // sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
}
//Remove Account *email
export const removeAcc = async (req,res) => {
    try {
        //Get user id
        const {id} = req.params;
        //Removing Secret Questions from database
        await SecretQt.deleteOne({user: id});
        //Removing PIN Code From dataBase
        await PIN.deleteOne({user: id});
        //Removing Tasks From dataBase
        await Tasks.deleteMany({user: id});
        //REmoving Category frim database
        await Category.deleteMany({user: id});
        
        //Cleaning cookies
        res.clearCookie(cookieapp);
        res.clearCookie(cookieAccessToken);

        //Delete user photo from upload folder
        //Search img by user ID
        const photoUserFound = await Image.findOne({user: id});

        //Get path filename
        const photoUrl = photoUserFound.filename;
        const pathUrl = path.join(__dirname, "../public/uploads")

        // Delete photo already exist in uploads
        fs.unlinkSync(`${pathUrl}/${photoUrl}`)

        //Send message to User
        const user = await User.findById(id);
        const subjectText = `Your Account has been deleted`;
        const htmlContent = removetAccEmail(user.username);
        // await sendMail(user.email, subjectText, htmlContent);

        //Send notification to taskAppEmail
        const htmlNotification = `
            <h1> Remove Account </h1> 
            <hr>
            <p> The account with this mail <b> ${user.email} </b> has been deleted</p>
        `
        // await notificationAppMail(htmlNotification);
        //Remove picture from database
        await Image.deleteOne({user: id});
        //Removing User from dataBase 
        await User.deleteOne({_id: id});
        //Return
        return res.status(202).redirect("/");
    } catch (error) {
        console.log("There is an Error: controllers/usersettings -> removeAcc".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: controller Settings Remove Acc",500);
        // sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
}

