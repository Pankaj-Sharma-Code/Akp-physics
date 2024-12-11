import React, { useEffect, useState } from 'react';
import Navbar from '../../common/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../common/loadingSpinner';

const ResultDashboard = () => {
  const { testId } = useParams();
  const [resultData, setResultData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResultsAndUser = async () => {
      try {
        const resultResponse = await axios.get(`/api/answers/result/${testId}`);
        setResultData(resultResponse.data);
        
        const userResponse = await axios.post(`/api/auth/getMe`);
        setUserData(userResponse.data);
      } catch (err) {
        setError('Failed to load results or user data.');
        toast.error('Failed to load results or user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchResultsAndUser();
  }, [testId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const handleButtonClick = async() => {
    navigate(`/dashboard/result/result-dashboard/${testId}/analysis`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="flex flex-col items-center justify-center py-10 px-5">
        {/* Profile Section with Avatar */}
        <div className="flex flex-col items-center mb-8 animate-fadeIn">
          <div className="avatar mb-4 hover:scale-105 transition-transform duration-300">
            <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={userData?.image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                alt="Profile"
              />
            </div>
          </div>
          <h3 className="text-4xl font-bold text-white">{userData?.username || 'John Doe'}</h3>
          <p className="text-gray-300 text-lg">{userData?.domain || 'Student'} | {userData?.email || 'email@example.com'}</p>
        </div>

        {/* Test Result Section with Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-4xl">
          <div className="card bg-gray-800 shadow-xl text-center p-6">
            <p className="text-lg text-yellow-400 font-bold">Maximum Marks</p>
            <p className="text-3xl text-white">{resultData.maxMarks}</p>
          </div>
          <div className="card bg-gray-800 shadow-xl text-center p-6">
            <p className="text-lg text-green-400 font-bold">Total Correct Answers</p>
            <p className="text-3xl text-white">{resultData.correct}</p>
          </div>
          <div className="card bg-gray-800 shadow-xl text-center p-6">
            <p className="text-lg text-red-400 font-bold">Total Incorrect Answers</p>
            <p className="text-3xl text-white">{resultData.incorrect}</p>
          </div>
          <div className="card bg-gray-800 shadow-xl text-center p-6">
            <p className="text-lg text-blue-400 font-bold">Total Skipped Questions</p>
            <p className="text-3xl text-white">{resultData.skipped}</p>
          </div>
          <div className="card bg-gray-800 shadow-xl text-center p-6">
            <p className="text-lg text-purple-400 font-bold">Total Marks Scored</p>
            <p className="text-3xl text-white">{resultData.obtainedMarks}/{resultData.maxMarks}</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mt-10">
          <button className="btn btn-primary w-48 py-3 text-sm transition-transform hover:scale-105" onClick={handleButtonClick}>
            View Detailed Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDashboard;