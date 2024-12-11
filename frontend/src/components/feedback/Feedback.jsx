import { useState } from "react";
import Navbar from "../common/Navbar";
import axios from "axios";
import { toast } from "react-hot-toast";

const Feedback = () => {
  const [rating, setRating] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("General Feedback");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRatingClick = (index) => {
    setRating(index);
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleFeedbackTypeChange = (e) => {
    setFeedbackType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || feedback.trim() === "") {
      toast.error("Please provide both a rating and feedback.");
      return;
    }

    try {
      await axios.post("/api/feedback/", {
        star: rating,
        feed: feedback,
        type: feedbackType,
      });
      setIsSubmitted(true); 
      toast.success("Feedback submitted successfully!");
      setRating(1);
      setFeedback("");
      setFeedbackType("General Feedback");
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6 sm:p-10 bg-gray-900 rounded-xl shadow-2xl mt-8 sm:mt-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6 sm:mb-10">
          We’d Love to Hear Your Thoughts!
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-white text-lg font-semibold mb-2 block">
              Select Feedback Type:
            </label>
            <select
              value={feedbackType}
              onChange={handleFeedbackTypeChange}
              className="w-full p-3 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>General Feedback</option>
              <option>Suggestions</option>
              <option>Report an Issue</option>
            </select>
          </div>

          <div className="flex justify-center mb-6 space-x-2 sm:space-x-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <svg
                key={index}
                xmlns="http://www.w3.org/2000/svg"
                fill={index <= rating ? "#FFD700" : "#555555"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-10 h-10 sm:w-12 sm:h-12 cursor-pointer transition duration-300 transform hover:scale-110 hover:rotate-6"
                onClick={() => handleRatingClick(index)}
              >
                <path
                  fillRule="evenodd"
                  d="M12 2l3.09 6.26 6.91 1-5 4.87 1.18 6.91L12 17.77l-6.18 3.3L7.91 14l-5-4.87L8.91 8.26 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            ))}
          </div>

          <div className="mb-6">
            <textarea
              value={feedback}
              onChange={handleFeedbackChange}
              rows="4"
              className="resize-none w-full p-4 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white placeholder-gray-400 transition-all duration-500 shadow-md"
              placeholder="Please share your thoughts..."
            ></textarea>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-lg font-semibold rounded-full shadow-md transition duration-300 hover:scale-105 hover:from-blue-700 hover:to-teal-600 focus:outline-none"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Feedback;
