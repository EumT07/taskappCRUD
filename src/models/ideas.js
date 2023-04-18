"use strict"
import Mongoose from "mongoose";
import "colors";

//Creating ideas model
const ideasSchema = new Mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
    },
    description: String,
    priority: String,
    user: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default Mongoose.model("Ideas", ideasSchema);
