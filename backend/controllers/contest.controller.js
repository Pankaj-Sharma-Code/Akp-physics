import Contest from "../models/contest.model.js";
import ContestAnswers from "../models/contestAnswers.model.js";

const parseTime = (timeString) => {
    const [timePart, modifier] = timeString.split(' ');
    let [hours, minutes] = timePart.split(':');

    if (modifier === 'AM' && hours === '12') {
        hours = '00'; 
    } else if (modifier === 'PM' && hours !== '12') {
        hours = String(parseInt(hours, 10) + 12); 
    }
    return `${hours}:${minutes}`;
};

const getCurrentDateInKolkata = () => {
    const options = { timeZone: 'Asia/Kolkata', hour12: false };
    const localDateString = new Date().toLocaleString('en-US', options);
    return Date(localDateString);
};


export const getFeatured = async (req, res) => {
    try {
        const featuredContests = await Contest.find({ featured: true }).sort({ date: -1 }).limit(3);
        res.status(200).json({
            success: true,
            data: featuredContests,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching featured contests",
            error: error.message,
        });
    }
};

export const getUpcoming = async (req, res) => {
    try {
        const currentDate = getCurrentDateInKolkata();
        const contests = await Contest.find();

        const upcomingContests = contests.filter(contest => {
            if (!contest.date || !contest.start || !contest.end) return false;

            const contestDate = new Date(contest.date);
            if (isNaN(contestDate)) return false;

            const startTime24h = parseTime(contest.start);
            const endTime24h = parseTime(contest.end);

            const startDateTimeString = `${contestDate.toISOString().split('T')[0]}T${startTime24h}:00+05:30`;
            const endDateTimeString = `${contestDate.toISOString().split('T')[0]}T${endTime24h}:00+05:30`;

            const startDateTime = new Date(startDateTimeString);
            const endDateTime = new Date(endDateTimeString);
            const currDateTime = new Date(currentDate);
            return startDateTime > currDateTime || (startDateTime <= currDateTime && currDateTime < endDateTime);
        }).sort((a, b) => {
            const startA = new Date(`${new Date(a.date).toISOString().split('T')[0]}T${parseTime(a.start)}:00+05:30`);
            const startB = new Date(`${new Date(b.date).toISOString().split('T')[0]}T${parseTime(b.start)}:00+05:30`);
            return startA - startB; 
        });

        res.status(200).json({
            success: true,
            data: upcomingContests,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching upcoming contests",
            error: error.message,
        });
    }
};

export const getPastContests = async (req, res) => {
    try {
        const currentDate = getCurrentDateInKolkata();
        const contests = await Contest.find();
        const upcomingContests = contests.filter(contest => {
            if (!contest.date || !contest.start || !contest.end) return false;

            const contestDate = new Date(contest.date);
            if (isNaN(contestDate)) return false;

            const startTime24h = parseTime(contest.start);
            const endTime24h = parseTime(contest.end);

            const startDateTimeString = `${contestDate.toISOString().split('T')[0]}T${startTime24h}:00+05:30`;
            const endDateTimeString = `${contestDate.toISOString().split('T')[0]}T${endTime24h}:00+05:30`;

            const startDateTime = new Date(startDateTimeString);
            const endDateTime = new Date(endDateTimeString);
            const currDateTime = new Date(currentDate);
            return !(startDateTime > currDateTime || (startDateTime <= currDateTime && currDateTime < endDateTime));
        }).sort((a, b) => {
            const startA = new Date(`${new Date(a.date).toISOString().split('T')[0]}T${parseTime(a.start)}:00+05:30`);
            const startB = new Date(`${new Date(b.date).toISOString().split('T')[0]}T${parseTime(b.start)}:00+05:30`);
            return startB-startA; 
        });

        res.status(200).json({
            success: true,
            data: upcomingContests,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching upcoming contests",
            error: error.message,
        });
    }
};


export const getMyContests = async (req, res) => {
    try {
        const currentDate = getCurrentDateInKolkata();
        const userId = req.user._id; 
        const contests = await Contest.find();
        const pastContests = contests.filter(contest => {
            if (!contest.date || !contest.start || !contest.end) return false;
            const contestDate = new Date(contest.date);
            if (isNaN(contestDate)) return false;
            const startTime24h = parseTime(contest.start);
            const endTime24h = parseTime(contest.end);
            const startDateTimeString = `${contestDate.toISOString().split('T')[0]}T${startTime24h}:00+05:30`;
            const endDateTimeString = `${contestDate.toISOString().split('T')[0]}T${endTime24h}:00+05:30`;
            const startDateTime = new Date(startDateTimeString);
            const endDateTime = new Date(endDateTimeString);
            const currDateTime = new Date(currentDate);
            return endDateTime <= currDateTime; 
        });

        const userAnswers = await ContestAnswers.find({ userId, submitted: 1 });
        const submittedContestIds = userAnswers.map(answer => answer.contestId);
        const myContests = pastContests.filter(contest => submittedContestIds.includes(contest._id.toString()));
        myContests.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
        });

        res.status(200).json({
            success: true,
            data: myContests,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching my contests",
            error: error.message,
        });
    }
};


export const register = async (req, res) => {
    const userId = req.user._id; 
    const contestId = req.params.contestId;
    try {
        const contest = await Contest.findById(contestId); 
        let contestAnswers = await ContestAnswers.findOne({ userId, contestId }); 
        if (!contest) {
            return res.status(404).json({ message: "Contest not found" });
        }
        if (contest.registered.includes(userId)) {
            return res.status(200).json({ message: "User is already registered", contest });
        }
        if (!contestAnswers) {
            contestAnswers = new ContestAnswers({
                userId,
                contestId,
                answers: [],
                submitted: 0,
            });
        }
        contest.registered.push(userId);
        await contestAnswers.save();
        await contest.save();
        res.status(200).json({ message: "User registered successfully", contest });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getParticularContest = async(req,res)=>{
    try {
        const {contestId} = req.params;
        const contest = await Contest.findById(contestId).select('-question');
        if (!contest) {
            return res.status(404).json({ message: "Test not found." });
        }
        res.status(201).json(contest);
    } catch (error) {
        console.error("Error fetching test:", error);
        res.status(500).json({ message: "An error occurred while fetching the test." });
    }    
}


export const getQuestions = async(req,res)=>{
    const {contestId} = req.params;
    try {
        const contest = await Contest.findById(contestId).select('-question.correctAnswer');
        if (!contest) {
            return res.status(404).json({ message: 'Test not found' });
        }
        res.json(contest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}