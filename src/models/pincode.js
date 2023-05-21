"use strict"
import Mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "colors";

const pinNumberSchema = new Mongoose.Schema({
    pin1: {
        type: String,
        required: true
    },
    pin2: {
        type: String,
        required: true
    },
    pin3: {
        type: String,
        required: true
    },
    pin3: {
        type: String,
        required: true
    },
    pin4: {
        type: String,
        required: true
    },
    pin5: {
        type: String,
        required: true
    },
    pin6: {
        type: String,
        required: true
    },
    user: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

//Encrypting Pins code
pinNumberSchema.statics.encryptPinCode = async (pinCode) => {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(pinCode, salt);
}

//Compare Pins code
pinNumberSchema.statics.comparePincode = async (pinCode, pinCodeToCompare) => {
    return await bcrypt.compare(pinCode, pinCodeToCompare);
}

export default Mongoose.model("PIN", pinNumberSchema);