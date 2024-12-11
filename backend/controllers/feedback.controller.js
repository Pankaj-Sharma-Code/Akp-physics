import Feedback from "../models/feedback.model.js";

export const addFeed = async (req, res) => {
  const { star, feed, type } = req.body;
  try {
    const feedback = new Feedback({ star, feed, type });
    await feedback.save();
    res.status(201).json({ message: "Feedback saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save feedback", error: error.message });
  }
};
