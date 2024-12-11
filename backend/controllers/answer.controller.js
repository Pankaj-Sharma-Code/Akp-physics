import Answers from "../models/answer.model.js";
import User from "../models/user.model.js";
import Test from "../models/test.model.js";

export const isSubmitted = async (req, res) => {
    try {
        const { test_id } = req.params;
        const user = await User.findById(req.user._id);
        const submissionStatus = await Answers.findOne({ userId: user._id, testId:test_id }, { submitted: 1 });
        if (submissionStatus) {
            res.status(200).json(submissionStatus.submitted);
        } else {
            res.status(404).json({ message: "No submission found for this user." });
        }
    } catch (error) {
        console.error("Error checking submission status:", error);
        res.status(500).json({ message: "An error occurred while checking submission status." });
    }
};


export const updateAnswer = async (req, res) => {
    const { test_id } = req.params;
    try {
        const { answer, questionIndex } = req.body;
        const user = await User.findById(req.user._id);
        let userAnswer = await Answers.findOne({ userId: user._id, testId: test_id });
        if (!userAnswer) {
            userAnswer = new Answers({
                username: user.username,
                userId: user._id,
                answers: [],
                testId: test_id,
            });
        }
        if (!userAnswer.answers[questionIndex]) {
            userAnswer.answers[questionIndex] = null;
        }
        userAnswer.answers[questionIndex] = answer;
        await userAnswer.save();
        res.status(200).json({ message: 'Answer updated successfully', answers: userAnswer.answers });
    } catch (error) {
        res.status(500).json({ message: 'Error updating answer', error });
    }
};


export const submitTest = async(req,res)=>{
    const {test_id} = req.params;
    try {
        const user = await User.findById(req.user._id);
        let userAnswers = await Answers.findOne({ userId:user._id, testId:test_id });
        if (!userAnswers) {
            userAnswers = new Answers({ userId:user._id, testId:test_id, answers: [], submitted: 1 });
        }
        userAnswers.submitted = 1;
        const test = await Test.findById(test_id);
        if (!test || !test.question.length) {
            return res.status(404).json({ message: 'No questions found for this test' });
        }
        let correct = 0, incorrect = 0, skipped = 0;
        test.question.forEach((question, index) => {
            const answer = userAnswers.answers[index];
            if (!answer) {
                skipped++;
            } else if (parseInt(answer) === parseInt(question.correctAnswer)) {
                correct++;
            } else {
                incorrect++;
            }
        });
        userAnswers.correct = correct;
        userAnswers.incorrect = incorrect;
        userAnswers.skipped = skipped;
        userAnswers.maxMarks = test.question.length * 4;
        userAnswers.obtainedMarks = (correct * 4) - incorrect;
        await userAnswers.save();
        res.status(200).json({message: 'Test submitted successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Error submitting test', error });
        console.log(error);
    }
}


export const getResult = async(req,res)=>{
    const test_id = req.params.test_id;
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const answer = await Answers.findOne({userId:user._id,testId:test_id});
            if (!answer) {
                return res.status(404).json({ message: 'Answer not found' });
            }
            res.status(200).json(answer);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }


export const getResultList = async(req,res)=>{
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const resultList = await Answers.find({userId:user._id,submitted:1});
        if (resultList.length === 0) {
            return res.status(404).json({message: 'No Submission found'});
        }
        res.status(200).json(resultList);
    } catch (error) {
        res.status(500).json({message:"Server error"});
    }
}


export const getCorrectAnswer = async (req, res) => {
    const { test_id } = req.params;
    try {
      const test = await Test.findById(test_id).select('question.correctAnswer');
      if (!test) {
        return res.status(404).json({ message: 'Test not found' });
      }
      if (!test.question || test.question.length === 0) {
        return res.status(400).json({ message: 'No questions available in the test' });
      }
      const correctAnswers = test.question.map(question => question.correctAnswer);
      res.json({ correctAnswers });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  