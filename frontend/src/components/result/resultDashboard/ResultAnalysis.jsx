import React, { useState, useEffect } from 'react';
import Navbar from '../../common/Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../../common/loadingSpinner';

const ResultAnalysis = () => {
  const { test_id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [counter, setCounter] = useState(1000000000);
  const [questions, setQuestions] = useState([]);
  const [resultData, setResultData] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestionsAndCorrectAnswers = async () => {
      try {
        // Fetching questions for the test
        const questionResponse = await axios.get(`/api/test/questions/${test_id}`);
        setQuestions(questionResponse.data.question);
        
        // Fetching results for the test to get the selected answers
        const resultResponse = await axios.get(`/api/answers/result/${test_id}`);
        setResultData(resultResponse.data);

        // Fetching correct answers for the test
        const correctAnswerResponse = await axios.get(`/api/answers/result/getAnswers/${test_id}`);
        setCorrectAnswers(correctAnswerResponse.data.correctAnswers);

        setLoading(false);
        
        const endTimeString = questionResponse.data.end;
        const parsedEndTime = parseTime(endTimeString);
        const endTime = new Date(`${new Date().toLocaleDateString()} ${parsedEndTime}`).getTime();
        const currentTime = Date.now();
        const remainingTimeInSeconds = Math.floor((endTime - currentTime) / 1000);
        setCounter(remainingTimeInSeconds > 0 ? remainingTimeInSeconds : 0);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchQuestionsAndCorrectAnswers();
  }, [test_id]);

  useEffect(() => {
    // If there's any saved selected options in local storage
    const savedOptions = JSON.parse(localStorage.getItem(`selectedOptions-${test_id}`)) || {};
    setSelectedOptions(savedOptions);
  }, [test_id]);

  const handleOptionSelect = (optionIndex) => {
    setSelectedOptions((prev) => {
      const updatedOptions = {
        ...prev,
        [currentQuestion]: optionIndex,
      };
      localStorage.setItem(`selectedOptions-${test_id}`, JSON.stringify(updatedOptions));
      return updatedOptions;
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      localStorage.setItem('currentQuestionIndex', currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      localStorage.setItem('currentQuestionIndex', currentQuestion - 1);
    }
  };

  // Check if loading data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="text-white text-center">No questions available.</div>;
  }

  const answers = resultData?.answers || [];

  return (
    <div className="min-h-screen bg-gradient-to-l from-gray-800 to-gray-900">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-gray-900 text-white p-6 rounded-md shadow-lg">
          {/* Question Display */}
          <div className="mb-6">
            {questions[currentQuestion]?.img && (
              <img
                src={questions[currentQuestion].img}
                alt="Question visual"
                className="w-full h-full object-cover rounded-md mb-4"
              />
            )}

            <h2 className="text-2xl font-bold mb-4">{`Question ${currentQuestion + 1}: ${questions[currentQuestion].question}`}</h2>

            <div className="flex flex-col space-y-4">
              {questions[currentQuestion]?.options?.map((option, index) => (
                <div
                  key={index}
                  className={`text-gray-300 ${selectedOptions[currentQuestion] === index ? 'bg-gray-600' : ''}`}
                  onClick={() => handleOptionSelect(index)}
                >
                  {/* Numbering before the option */}
                  <span className="font-semibold">{index + 1}. </span>
                  <span>{option.text}</span>
                  {option.img && (
                    <img
                      src={option.img}
                      alt={`Option ${index}`}
                      className="w-7/12 object-cover rounded-md mt-2"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Correct Option Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold">Correct Answer:</h3>
            <div className="text-green-400">
              {questions[currentQuestion]?.options[correctAnswers[currentQuestion]]?.text}
              {questions[currentQuestion]?.options[correctAnswers[currentQuestion]]?.img && (
                <img
                  src={questions[currentQuestion]?.options[correctAnswers[currentQuestion]]?.img}
                  alt="Correct Option"
                  className="w-7/12 object-cover rounded-md mt-2"
                />
              )}
            </div>
          </div>

          {/* Selected Option Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold">Your Selected Answer:</h3>
            <div
              className={`text-${answers[currentQuestion] == correctAnswers[currentQuestion] ? 'green' : 'red'}-400`}
            >
              {answers[currentQuestion] != undefined
                ? questions[currentQuestion]?.options[answers[currentQuestion]]?.text
                : 'No Option Selected'}
              {answers[currentQuestion] != undefined && questions[currentQuestion]?.options[answers[currentQuestion]]?.img && (
                <img
                  src={questions[currentQuestion]?.options[answers[currentQuestion]]?.img}
                  alt="Selected Option"
                  className="w-7/12 object-cover rounded-md mt-2"
                />
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-4">
              <button
                className="btn btn-outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </button>
              <button
                className="btn btn-primary"
                onClick={handleNext}
                disabled={currentQuestion === questions.length - 1}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultAnalysis;
