"use strict"
import Mongoose from "mongoose";
import "colors";
const taskSchema = new Mongoose.Schema(
    {
        title: String,
        description: String,
        category: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },
        priority: String,
        status: {
            type: Boolean,
            default: false
        },
        user: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        month: String,
        dateline: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

export default Mongoose.model("Task",taskSchema)