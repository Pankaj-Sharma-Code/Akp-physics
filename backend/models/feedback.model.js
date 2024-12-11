import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    star: {type:Number,default:0},
    feed: {type:String,default:""},
    type: {type:String,default:"General Feedback"}
});

const Feedback = mongoose.model("Feedback",feedbackSchema);

export default Feedback;