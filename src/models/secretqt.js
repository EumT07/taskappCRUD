"use strict"
import Mongoose from "mongoose";

const secretQtSchema = new Mongoose.Schema(
    {
        question1: String,
        answer1: String,
        question2: String,
        answer2: String,
        question3: String,
        answer3: String,
        user: {
                type: Mongoose.Schema.Types.ObjectId,
                ref: "User",
        }
    }
);

export default Mongoose.model("SecretQt", secretQtSchema);