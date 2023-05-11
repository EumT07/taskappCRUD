"use strict"
import Mongoose from "mongoose";
import "colors";

const pinNumberSchema = new Mongoose.Schema({
    pin1: {
        type: Number,
        maxlength: 1,
        required: true
    },
    pin2: {
        type: Number,
        maxlength: 1,
        required: true
    },
    pin3: {
        type: Number,
        maxlength: 1,
        required: true
    },
    pin3: {
        type: Number,
        maxlength: 1,
        required: true
    },
    pin4: {
        type: Number,
        maxlength: 1,
        required: true
    },
    pin5: {
        type: Number,
        maxlength: 1,
        required: true
    },
    pin6: {
        type: Number,
        maxlength: 1,
        required: true
    },
    user: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

export default Mongoose.model("PIN", pinNumberSchema)