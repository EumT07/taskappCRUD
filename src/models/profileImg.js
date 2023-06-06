import Mongoose from "mongoose";

const imageSchema = new Mongoose.Schema({
    filename: {type: String},
    path: {type: String},
    originalname: {type: String},
    mimetype: {type: String},
    size: { type: Number},
    created_at: {type: Date, default: Date.now()},
    user: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

export default  Mongoose.model('Image', imageSchema);