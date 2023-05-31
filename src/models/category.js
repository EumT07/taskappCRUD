"use strict"
import Mongoose from "mongoose";
import "colors";

//Creating ideas model
const categorySchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    user: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
  },
  {
    timestamps: true
  });

export default Mongoose.model("Category",categorySchema);
