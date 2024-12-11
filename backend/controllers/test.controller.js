import Test from "../models/test.model.js";

export const getTests = async(req,res)=>{
    try {
        const test = await Test.find({}).select('-question').sort({ date: -1, start: 1, end: 1 });
        res.status(200).json(test);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tests", error: error.message });
    }
}

export const getParticularTest = async(req,res)=>{
    try {
        const {id} = req.params;
        const test = await Test.findById(id).select('-question');
        if (!test) {
            return res.status(404).json({ message: "Test not found." });
        }
        res.status(201).json(test);
    } catch (error) {
        console.error("Error fetching test:", error);
        res.status(500).json({ message: "An error occurred while fetching the test." });
    }    
}

export const getQuestions = async(req,res)=>{
    const {id} = req.params;
    try {
        const test = await Test.findById(id).select('-question.correctAnswer');
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }
        res.json(test);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}