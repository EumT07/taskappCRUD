"use strict"
import Mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "colors";

const secretQtSchema = new Mongoose.Schema(
    {
        question1: {
            type: String,
            required: true
        },
        answer1: {
            type: String,
            required: true
        },
        question2: {
            type: String,
            required: true
        },
        answer2: {
            type: String,
            required: true
        },
        question3: {
            type: String,
            required: true
        },
        answer3: {
            type: String,
            required: true
        },
        user: {
                type: Mongoose.Schema.Types.ObjectId,
                ref: "User",
        }
    }
);

//Encrypting security answers
secretQtSchema.statics.encryptsecretqts = async (answer) => {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(answer, salt);
}

//Comparing answers
secretQtSchema.statics.comparesecretqts = async (answer, answerToCompare) => {
    return await bcrypt.compare(answer, answerToCompare)
}
export default Mongoose.model("SecretQt", secretQtSchema);