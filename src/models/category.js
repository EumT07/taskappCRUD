"use strict"
import Mongoose from "mongoose";
import "colors";

//Creating Categories model
const categorySchema = new Mongoose.Schema(
  {
    name: {
      type: String
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
