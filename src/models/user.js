"use strict"
import Mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "colors";

//Create the user model
const userSchema = new Mongoose.Schema(
  {
    username: { type: String, unique: true },
    name: String,
    lastName: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
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
userSchema.statics.comparePassword = async (password) => {
  return await bcrypt.compare(password, passwordToComapare);
};

export default Mongoose.model("User", userSchema);
