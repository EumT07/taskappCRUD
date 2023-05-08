"use strict"
import Mongoose from "mongoose";
import "colors";

const pinNumberSchema = new Mongoose.Schema({
    pinNumber: {
        type: Number,
        required: true
    },
    user: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

export default Mongoose.model("PIN", pinNumberSchema)