import mongoose from "mongoose";

const contestAnswerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String },
    answers: { type: [String], default: [] },
    contestId: { type: String, required: true },
    submitted: { type: Number, default: 0 },
    correct: {type:Number, default:null},
    incorrect: {type:Number, default:null},
    skipped: {type:Number, default:null},
    maxMarks: {type:Number, default:null},
    obtainedMarks: {type:Number, default:null}
},{timestamps:true});

const ContestAnswers = mongoose.model("ContestAnswers",contestAnswerSchema);

export default ContestAnswers;