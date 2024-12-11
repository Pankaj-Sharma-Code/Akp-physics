import Contest from "../models/contest.model.js";
import ContestAnswers from "../models/contestAnswers.model.js";
import User from "../models/user.model.js";

export const isSubmitted = async (req, res) => {
    try {
        const { contestId } = req.params;
        const user = await User.findById(req.user._id);
        const submissionStatus = await ContestAnswers.findOne({ userId: user._id, contestId:contestId }, { submitted: 1 });
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
    const { contestId } = req.params;
    try {
        const { answer, questionIndex } = req.body;
        const user = await User.findById(req.user._id);
        let userAnswer = await ContestAnswers.findOne({ userId: user._id, contestId: contestId });
        if (!userAnswer) {
            userAnswer = new ContestAnswers({
                username: user.username,
                userId: user._id,
                answers: [],
                contestId: contestId,
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
    const {contestId} = req.params;
    try {
        const user = await User.findById(req.user._id);
        let userAnswers = await ContestAnswers.findOne({ userId:user._id, contestId:contestId });
        if (!userAnswers) {
            userAnswers = new ContestAnswers({ userId:user._id, contestId:contestId , answers: [], submitted: 1 });
        }
        userAnswers.submitted = 1;
        const contest = await Contest.findById(contestId);
        if (!contest || !contest.question.length) {
            return res.status(404).json({ message: 'No questions found for this test' });
        }
        let correct = 0, incorrect = 0, skipped = 0;
        contest.question.forEach((question, index) => {
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
        userAnswers.maxMarks = contest.question.length * 4;
        userAnswers.obtainedMarks = (correct * 4) - incorrect;
        await userAnswers.save();
        res.status(200).json({message: 'Test submitted successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Error submitting test', error });
        console.log(error);
    }
}


export const getResult = async(req,res)=>{
    const contestId = req.params.contestId;
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const answer = await ContestAnswers.findOne({userId:user._id,contestId:contestId});
            res.status(200).json(answer);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }



export const getCorrectAnswer = async (req, res) => {
    const { contestId } = req.params;
    try {
      const contest = await Contest.findById(contestId).select('question.correctAnswer');
      if (!contest) {
        return res.status(404).json({ message: 'Test not found' });
      }
      if (!contest.question || contest.question.length === 0) {
        return res.status(400).json({ message: 'No questions available in the test' });
      }
      const correctAnswers = contest.question.map(question => question.correctAnswer);
      res.json({ correctAnswers });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const getUserRank = async (req,res) => { 
    const { contestId } = req.params;
    try {
      const users = await ContestAnswers.find({ contestId })
        .sort({ obtainedMarks: -1, submitted: 1 }) 
        .lean(); 
      const ranks = users.map((user, index) => ({
        userId: user.userId,
        obtainedMarks: user.obtainedMarks,
        submitted: user.submitted,
        rank: index + 1,
      }));
  
    res.json(ranks);
    } catch (error) {
      console.error("Error calculating ranks for all users:", error);
      throw new Error(
        "An error occurred while fetching user ranks. Please try again later."
      );
    }
  };
  