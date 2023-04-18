"use strict"
import Mongoose from "mongoose";
import "colors";

const taskSchema = new Mongoose.Schema(
    {
        title:String,
        description: String,
        priority: String,
        status: {
            type: Boolean,
            default: false
        },
        user: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }
);

export default Mongoose.model("Task",taskSchema)