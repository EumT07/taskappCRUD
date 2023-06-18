"use strict"
import * as dotenv from "dotenv"
import Tasks from "../models/tasks.js";
import Category from "../models/category.js"
import {
    taskAppError
} from "../error/handlerError.js";
import { sendMail, sendErrorMail,notificationAppMail } from "../mail/mail.js";

dotenv.config();


/**
 * todo: TASK SECTION
 */
//*Create a new task and new category at the same time
export const createNewTask = async (req, res) => {
    try {
        const {title, description, category, priority, userID} = req.body;
        const date = new Date();
        //Is category an Array or not?
        //*Creating a new category and a new task
        if(Array.isArray(category)){
            //Search if category exist
             const categorySelected = await Category.findOne({name: category[1]});

             if(categorySelected){
                //Creating new task
                const task = await new Tasks({
                    title: title,
                    description: description,
                    category: categorySelected._id,
                    priority: priority,
                    month: date.getMonth(),
                    user: userID
                });
                task.save();
                res.status(202).redirect("/dashboard")
                return;
             }

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
                user: userID
            });
            await task.save();
            res.status(202).redirect("/dashboard")
            return;
        }

        //*Category is not an array
        //Checking is category is one of thme (categories | leves)
        if(category.toLowerCase() === "categories" || priority.toLowerCase() === "levels"){
            //*Add new Notification with messages
            res.status(404).redirect("/dashboard")
            return;
        }

        //*Search category to use.
        const categorySelected = await Category.findOne({name: category});

        //Creating new task with a category what was created
        const task = await new Tasks({
            title: title,
            description: description,
            category: categorySelected._id,
            priority: priority, 
            month: date.getMonth(),
            user: userID
        });
        task.save();
        res.status(202).redirect("/dashboard");
        return;
    } catch (error) {
        console.log("There is an error: Creating new Task".red.bold, + error.message);
        const message = taskAppError(res,"taskAppError: controller dashboard Creating new Task",500);
        // sendErrorMail(message);
        return res.status(404).redirect("/api/failrequest");
    }
}

//*Updating Task
export const updateTask = async (req,res) =>{
    try {
        const {id} = req.params;
        const {title,description,priority} = req.body;

        // if(title.length === 0 || description.length === 0 || priority.length === 0) {
        //     return res.status(202).redirect("/dashboard");
        // }
        const data = {
            title: title,
            description: description,
            priority: priority
        }
        //Finding taks
        const tasks = await Tasks.findByIdAndUpdate({_id: id}, data);

        return res.status(202).redirect("/dashboard");
    } catch (error) {
        console.log("There is an Error: Updating Task".red.bold, error.message);
        const message = taskAppError(res,"taskAppError: controller dashboard Updating Task",500);
        // sendErrorMail(message);
        return res.status(404).redirect("/api/failrequest");
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
        return res.status(404).redirect("/api/failrequest");
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
        return res.status(404).redirect("/api/failrequest");
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
        return res.status(404).redirect("/api/failrequest");
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
        return res.status(404).redirect("/api/failrequest");
    }
}