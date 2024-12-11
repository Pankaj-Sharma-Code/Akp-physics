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

const contestSchema = new mongoose.Schema(
    {
        contestname: { type: String, required: true},
        date: {type: Date,required:true},
        start: {type: String,required:true},
        end: {type: String, required: true},
        syllabus: {type: String},
        question: [questionSchema],
        featured: {type:Boolean,default:false},
        registered: [{type: mongoose.Schema.Types.ObjectId,ref: "User"}]
    },
    { timestamps: true }
);

const Contest = new mongoose.model("Contest",contestSchema);

export default Contest;