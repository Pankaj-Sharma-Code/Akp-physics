import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../common/loadingSpinner';

const ContestTest = () => {
  const { contestId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [counter, setCounter] = useState(1000000000);
  const [questions, setQuestions] = useState([]);
  const [cheatCount, setCheatCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [endTime, setEndTime] = useState(null);
  const navigate = useNavigate();

  const parseTime = (timeString) => {
    try {
      const [timePart, modifier] = timeString.split(' ');
      let [hours, minutes] = timePart.split(':');
      hours = parseInt(hours, 10);
      minutes = parseInt(minutes, 10);

      if (isNaN(hours) || isNaN(minutes)) {
        throw new Error('Invalid time format');
      }

      if (modifier === 'AM' && hours === 12) {
        hours = 0;
      } else if (modifier === 'PM' && hours !== 12) {
        hours = hours + 12;
      }

      const today = new Date();
      // Create date in local timezone
      return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        hours,
        minutes,
        0
      );
    } catch (error) {
      console.error('Error parsing time:', error);
      return null;
    }
  };

  const updateCounter = () => {
    if (!endTime) return;
    const now = new Date();
    const remainingTimeInSeconds = Math.floor((endTime - now) / 1000);
    setCounter(Math.max(0, remainingTimeInSeconds));
  };

  const checkSubmission = async (contest) => {
    try {
      const response = await axios.post(`/api/contest/answers/submitted/${contest._id}`);
      if (response.data) {
        toast.error("The contest is already submitted.");
        return false;
      }
      return true;
    } catch (error) {
      return true;
    }
  };


  const handleCheatAttempt = async () => {
    setCheatCount((prev) => prev + 1);
    if (cheatCount + 1 >= 3) {
      await handleSubmit();
      toast.error('You have attempted to navigate away multiple times. The contest has been submitted automatically.');
    } else {
      toast.error(`Navigation away detected. ${3 - cheatCount - 1} attempts left before auto-submission.`);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) handleCheatAttempt();
    };

    const handleResize = () => {
      handleCheatAttempt();
    };

    const preventConsole = () => {
      if (console && typeof console.log === 'function') {
        console.log = () => {
          handleCheatAttempt();
          toast.error('Console usage is restricted during the contest.');
        };
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', handleResize);
    preventConsole();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
    };
  }, [cheatCount]);

  useEffect(() => {
    const savedOptions = JSON.parse(localStorage.getItem(`selectedOptions-${contestId}`)) || {};
    const savedQuestionIndex = localStorage.getItem('currentQuestionIndex');

    setSelectedOptions(savedOptions);
    if (savedQuestionIndex) {
      setCurrentQuestion(parseInt(savedQuestionIndex, 10));
    }
  }, [contestId]);

  const correctTime = (contest) => {
    const startTime = parseTime(contest.start);
    const endTime = parseTime(contest.end);
    const currentTime = new Date();

    if (!startTime || !endTime) {
      toast.error('Invalid contest time configuration');
      return false;
    }

    if (currentTime < startTime) {
      toast.error('The contest has not started yet. Please come back at the scheduled start time.');
      return false;
    } else if (currentTime >= startTime && currentTime <= endTime) {
      return true;
    } else {
      toast.error('The contest has already ended. You can no longer participate.');
      return false;
    }
  };

  const Valid = async () => {
    try {
      const response = await axios.get(`/api/contests/${contestId}`);
      const contest = response.data;
      const timeValid = correctTime(contest);
      const submitted = await checkSubmission(contest);
      if (!timeValid || !submitted) {
        navigate(`/dashboard`);
      }
    } catch (error) {
      console.error("Error fetching contest:", error);
      toast.error("Failed to fetch contest details.");
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        await Valid();
        const response = await axios.get(`/api/contests/questions/${contestId}`);
        setQuestions(response.data.question);

        const parsedEndTime = parseTime(response.data.end);
        if (parsedEndTime) {
          setEndTime(parsedEndTime);
          const now = new Date();
          const remainingTimeInSeconds = Math.floor((parsedEndTime - now) / 1000);
          setCounter(Math.max(0, remainingTimeInSeconds));
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [contestId]);

  useEffect(() => {
    // Update counter every second
    const timer = setInterval(() => {
      updateCounter();
    }, 1000);

    // Sync with server every minute to prevent drift
    const syncTimer = setInterval(async () => {
      try {
        const response = await axios.get(`/api/contests/${contestId}`);
        const parsedEndTime = parseTime(response.data.end);
        if (parsedEndTime) {
          setEndTime(parsedEndTime);
          updateCounter();
        }
      } catch (error) {
        console.error('Error syncing time:', error);
      }
    }, 60000);

    return () => {
      clearInterval(timer);
      clearInterval(syncTimer);
    };
  }, [endTime, contestId]);

  useEffect(() => {
    if (counter <= 0) {
      handleSubmit();
    }
  }, [counter]);

  const updateAnswer = async (questionIndex, answer) => {
    await Valid();
    try {
      await axios.put(`/api/contest/answers/response/${contestId}`, {
        questionIndex,
        answer,
      });
    } catch (error) {
      console.error('Error updating answer:', error);
    }
  };

  const handleOptionSelect = async (optionIndex) => {
    await Valid();
    setSelectedOptions((prev) => {
      const updatedOptions = {
        ...prev,
        [currentQuestion]: optionIndex,
      };
      localStorage.setItem(`selectedOptions-${contestId}`, JSON.stringify(updatedOptions));
      return updatedOptions;
    });

    updateAnswer(currentQuestion, optionIndex);
  };

const handleNext = async () => {
  await Valid();
  setCurrentQuestion((prev) => {
    const nextIndex = Math.min(prev + 1, questions.length - 1);
    localStorage.setItem('currentQuestionIndex', nextIndex);
    return nextIndex;
  });
};

const handlePrevious = async () => {
  await Valid();
  setCurrentQuestion((prev) => {
    const prevIndex = Math.max(prev - 1, 0);
    localStorage.setItem('currentQuestionIndex', prevIndex);
    return prevIndex;
  });
};

  const handleClear = async () => {
    await Valid();
    setSelectedOptions((prev) => {
      const updatedOptions = {
        ...prev,
        [currentQuestion]: null,
      };
      localStorage.setItem(`selectedOptions-${contestId}`, JSON.stringify(updatedOptions));
      return updatedOptions;
    });

    updateAnswer(currentQuestion, null);
  };

  const handleSubmit = async () => {
    await Valid();
    try {
      await axios.post(`/api/contest/answers/submit/${contestId}`);
      toast.success('Contest submitted successfully');
      localStorage.removeItem(`selectedOptions-${contestId}`);
      localStorage.removeItem('currentQuestionIndex');
      navigate("/");
    } catch (error) {
      toast.error('Error submitting contest. Please try again.');
    }
  };

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
  return (
    <div className="min-h-screen bg-gradient-to-l from-gray-800 to-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-gray-900 text-white p-6 rounded-md shadow-lg">
          {/* Countdown Timer */}

          <div className="flex flex-row flex-wrap gap-4 sm:gap-6 md:gap-8 mb-8 w-full">
            <div className="flex flex-col items-center">
              <span className="countdown font-mono text-lg sm:text-2xl md:text-4xl lg:text-5xl whitespace-nowrap">
                {String(Math.floor((counter % 86400) / 3600)).padStart(2, '0')}
              </span>
              <span className="text-xs sm:text-sm md:text-base lg:text-lg">hours</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="countdown font-mono text-lg sm:text-2xl md:text-4xl lg:text-5xl whitespace-nowrap">
                {String(Math.floor((counter % 3600) / 60)).padStart(2, '0')}
              </span>
              <span className="text-xs sm:text-sm md:text-base lg:text-lg">min</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="countdown font-mono text-lg sm:text-2xl md:text-4xl lg:text-5xl whitespace-nowrap">
                {String(counter % 60).padStart(2, '0')}
              </span>
              <span className="text-xs sm:text-sm md:text-base lg:text-lg">sec</span>
            </div>
          </div>

          {/* Question Display */}
          <div className="mb-6">
            {questions[currentQuestion]?.img && (
              <img
                src={questions[currentQuestion].img}
                alt="Question visual"
                className="w-full h-full object-cover rounded-md mb-4"
              />
            )}

            {/* <h2 className="text-2xl font-bold mb-4">{`Question ${currentQuestion + 1}: ${questions[currentQuestion].question}`}</h2> */}
            <div className="items-center mb-4">
              <span className="text-xl md:text-2xl font-bold">{`Question ${currentQuestion + 1}: `}</span>
              <span className="text-lg md:text-xl mb-4">{questions[currentQuestion].question}</span>
            </div>

            <div className="flex flex-col space-y-4">
              {questions[currentQuestion]?.options?.map((option, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={index}
                    checked={selectedOptions[currentQuestion] === index}
                    onChange={() => handleOptionSelect(index)}
                    className="radio radio-secondary bg-gray-800 border-gray-600 text-gray-300"
                  />
                  <span className="text-gray-300">{option.text}</span>
                  {option.img && (
                    <img
                      src={option.img}
                      alt="Option visual"
                      className="w-7/12 object-cover rounded-md mb-4"
                    />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4 md:flex-row justify-between items-center md:gap-8 mt-6">
            <button
              className="btn btn-outline bg-gray-800 hover:bg-gray-700 text-white w-full md:w-auto"
              onClick={handleClear}
              disabled={selectedOptions[currentQuestion] == null}
            >
              Clear Response
            </button>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <button
                className="btn btn-outline bg-gray-800 hover:bg-gray-700 text-white w-full md:w-auto"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </button>
              <button
                className="btn btn-outline bg-gray-800 hover:bg-gray-700 text-white w-full md:w-auto"
                onClick={handleNext}
                disabled={currentQuestion === questions.length - 1}
              >
                Next
              </button>
              <button
                className="btn btn-success bg-green-600 hover:bg-green-500 text-white w-full md:w-auto"
                onClick={() => {
                  const confirmSubmit = window.confirm("Are you sure you want to submit the contest?");
                  if (confirmSubmit) {
                    handleSubmit();
                  }
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestTest;
