"use strict"
import Mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "colors";

//Create the user model
const userSchema = new Mongoose.Schema(
  {
    username: { type: String, unique: true },
    name: String,
    lastname: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    country: String,
    gender: String,
    roles: [
      {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
    taskHigh: Number,
    taskmiddle: Number,
    tasklow: Number,
    totalTasks: Number,
    imgPath: String
  },
  {
    timestamps: true,
    versionkey: false,
  }
);

//Encrypt password:
userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

//Compare
userSchema.statics.comparePassword = async (password, passwordToComapare) => {
  return await bcrypt.compare(password, passwordToComapare);
};

export default Mongoose.model("User", userSchema);
