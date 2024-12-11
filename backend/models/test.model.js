import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
    text: {type:String},
    img: {type: String},
});

const questionSchema = new mongoose.Schema({
    question: { type: String},
    img: {type:String},
    options: [optionSchema],
    correctAnswer: { type: Number, required: true }
});

const testSchema = new mongoose.Schema(
    {
        testname: { type: String, required: true},
        date: {type: Date,required:true},
        start: {type: String,required:true},
        end: {type: String, required: true},
        question: [questionSchema],
    },
    { timestamps: true }
);

const Test = new mongoose.model("Test",testSchema);

export default Test;