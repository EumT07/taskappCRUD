"use strict"
import * as dotenv from "dotenv"
import User from "../models/user.js";
import Tasks from "../models/tasks.js";
import Category from "../models/category.js"
import {
    taskAppError
} from "../error/handlerError.js";
import {
    sendMail,
    sendErrorMail,
    notificationAppMail
} from "../mail/mail.js";


dotenv.config();

/**
 * todo: TASK SECTION
 */
//*Create a new task and new category at the same time
export const createNewTask = async (req, res) => {
    console.log(req.body);
    try {
        const {title, description, category, priority, userID, dateline} = req.body;
        const date = new Date();
        
        //Is category an Array or not?
        //*Creating a new category and a new task
        if(Array.isArray(category)){

            if(priority.toLowerCase() === "priority"){
                //*Add new Features (Notification with messages)
                res.status(404).redirect("/dashboard")
                return;
            }

            if(category[1] === ""){
                const getCategory = await Category.findOne({user: userID},{name:category[0]});

                if(getCategory){
                    const task = await new Tasks({
                        title: title,
                        description: description,
                        category: getCategory._id,
                        priority: priority,
                        month: date.getMonth(),
                        dateline: dateline,
                        user: userID
                    });
                    await task.save();
                    res.status(202).redirect("/dashboard")
                    return;
                }
              
                res.status(404).redirect("/dashboard")
                return;
            }
            //GEt all user's categories
            const allcategory = await Category.find({user: userID});
            
            if(allcategory.length === 0 || allcategory.length > 0){
                // Creating a new Category
                const newCategory = await new Category({
                    name: category[1],
                    user: userID
                });
                await newCategory.save();

                //Creating new task
                const task = await new Tasks({
                    title: title,
                    description: description,
                    category: newCategory._id,
                    priority: priority,
                    month: date.getMonth(),
                    dateline: dateline,
                    user: userID
                });
                await task.save();
                res.status(202).redirect("/dashboard")
                return
            }

            res.status(202).redirect("/dashboard");
            return;
        }

        //*Category is not an array
        //Checking is category is one of thme (categories | leves)
        if(category.toLowerCase() === "category" || category.toLowerCase() === "categories"){
            //*Add new Features (Notification with messages)
            res.status(404).redirect("/dashboard")
            return;
        }

        //*Search category to use.
        //Creating new task with a category what was created
        const categoryList = await Category.find({user: userID});

        categoryList.forEach( async categories => {
            if(categories.name === category){
                const task = await new Tasks({
                    title: title,
                    description: description,
                    category: categories._id,
                    priority: priority, 
                    month: date.getMonth(),
                    dateline: dateline,
                    user: userID
                });
                task.save(); 
            }
        })
        
        res.status(202).redirect("/dashboard");
        return;
    } catch (error) {
        console.log("There is an error: Creating new Task".red.bold, + error.message);
        const message = taskAppError(res,"taskAppError: controller dashboard Creating new Task",500);
        // sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
}
//*dateline
export const dateline = async (req,res,next) => {
    try {
        const user = await User.findById(req.userID);
        const tasks = await Tasks.find({user: user.id});
        const date = new Date();
        const dateNow = date.getTime();
    
        tasks.forEach( async (task) => {
            if(task.dateline){
                const date2 = new Date(task.dateline)
                let subtraction = date2.getTime() - dateNow;
                let days = Math.round(subtraction / (1000*60*60*24));
                 
                if(days === 0 || days < 0){
                    //Send message
                    console.log(`
                        User ID: ${user.id}
                        Task Title: ${task.title}
                        Task Description: ${task.description}
                    `);
                    //*Add sendmessage here
                    //Change dateline -> done don't send email again
                    await Tasks.findByIdAndUpdate({_id: task.id},{dateline: "lost"});
                    return;
                }
                return;
            }
        })
        next();
    } catch (error) {
        console.log("Error Dateline", error);
    }
}
//*Updating Task
export const updateTask = async (req,res) =>{
    try {
        const {id} = req.params;
        const {title,description,priority, dateline} = req.body;

        if(title.length === 0 || description.length === 0 || priority.length === 0) {
            return res.status(202).redirect("/dashboard");
        }
        const data = {
            title: title,
            description: description,
            priority: priority,
            dateline: dateline
        }
        //Finding taks
        const tasks = await Tasks.findByIdAndUpdate({_id: id}, data);

        return res.status(202).redirect("/dashboard");
    } catch (error) {
        console.log("There is an Error: Updating Task".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: controller dashboard Updating Task",500);
        // sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
}
//*Task Done
export const completeTask = async (req,res) =>{
    try {
        const {id} = req.params;
        //Find task and update status
        await Tasks.findByIdAndUpdate({_id: id},{status: true});
        return res.status(202).redirect("/dashboard");
    } catch (error) {
        console.log("There is an Error: Completing Task".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: controller dashboard Completing Task",500);
        // sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
}
//* Cancel Task done
export const cancelCompleteTask = async (req,res) =>{
    try {
        const {id} = req.params;
        //Find task and update status
        await Tasks.findByIdAndUpdate({_id: id},{status: false});
        return res.status(202).redirect("/dashboard");
    } catch (error) {
        console.log("There is an Error: Canceling Complete Task".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: controller dashboard Reseting Completed Task",500);
        // sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
}

//*Deleting Task
export const deleteTask = async (req,res)=>{
    try {
        const {id} = req.params;
        //Deleting task
        await Tasks.deleteOne({_id: id});
        return res.status(202).redirect("/dashboard");
    } catch (error) {
        console.log("There is an Error: Deleting Task".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: controller dashboard Deleting Task",500);
        // sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
}
//*Delete Category
export const deleteCategory = async(req,res) =>{
    try {
        const {id} = req.params;
        //Delete category
        await Category.deleteOne({_id: id});
        await Tasks.deleteMany({category: id});
        return res.status(202).redirect("/dashboard");
    } catch (error) {
        console.log("There is an Error: Deleting Task".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: controller dashboard Deleting category",500);
        // sendErrorMail(message);
        return res.status(503).redirect("/api/failrequest");
    }
}