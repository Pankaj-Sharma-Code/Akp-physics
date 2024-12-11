import React, { useState, useEffect } from "react";
import { FaHistory, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../common/loadingSpinner";

const ContestResult = () => {
  const [myContests, setMyContests] = useState([]);
  const [pastContests, setPastContests] = useState([]);
  const [activeTab, setActiveTab] = useState("past");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const contestsPerPage = 10;
  const navigate = useNavigate();

  const fetchContests = async (type) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/contests/${type}`);
      const data = response.data;

      if (data && Array.isArray(data.data)) {
        if (type === "my") {
          setMyContests(data.data);
        } else {
          setPastContests(data.data);
        }
      } else {
        setError("Invalid response format: 'data' should be an array.");
      }
    } catch (err) {
      setError("Failed to fetch contests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests("past");
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchContests(activeTab);
  }, [activeTab]);

  const contests = activeTab === "past" ? pastContests : myContests;
  const indexOfLastContest = currentPage * contestsPerPage;
  const indexOfFirstContest = indexOfLastContest - contestsPerPage;
  const currentContests = contests.slice(indexOfFirstContest, indexOfLastContest);
  const totalPages = Math.ceil(contests.length / contestsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Move getFormattedDate function inside the component
  const getFormattedDate = (date) => {
    if (!date) return "Not available";

    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleRankingRedirect = (contestId) => {
    navigate(`/dashboard/contest/results/${contestId}`);
  };

  const handleQuestionRedirect = (contestId) => {
    navigate(`/dashboard/contest/results/questions/${contestId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Top Navigation (hidden on mobile) */}
      <header className="flex flex-wrap justify-center py-6 bg-gray-800 shadow-lg gap-4 sm:gap-6 hidden sm:flex">
        <button
          onClick={() => setActiveTab("past")}
          className={`flex items-center justify-center w-14 h-14 sm:px-6 sm:py-2 sm:w-auto sm:h-auto rounded-full font-semibold transition-transform ${
            activeTab === "past"
              ? "bg-indigo-500 text-white scale-105"
              : "bg-gray-700 text-gray-300 hover:bg-indigo-600"
          } sm:flex-row flex-col`}
        >
          <FaHistory className="text-lg sm:text-xl sm:mr-2 mb-1 sm:mb-0" />
          <span className="text-xs sm:text-sm sm:inline hidden">Past Contests</span>
        </button>
        <button
          onClick={() => setActiveTab("my")}
          className={`flex items-center justify-center w-14 h-14 sm:px-6 sm:py-2 sm:w-auto sm:h-auto rounded-full font-semibold transition-transform ${
            activeTab === "my"
              ? "bg-indigo-500 text-white scale-105"
              : "bg-gray-700 text-gray-300 hover:bg-indigo-600"
          } sm:flex-row flex-col`}
        >
          <FaUserCircle className="text-lg sm:text-xl sm:mr-2 mb-1 sm:mb-0" />
          <span className="text-xs sm:text-sm sm:inline hidden">My Contests</span>
        </button>
      </header>

      {/* Bottom Navigation (shown on mobile only) */}
      <footer className="sm:hidden fixed bottom-0 w-full bg-gray-800 shadow-lg p-4 z-10">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab("past")}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-transform ${
              activeTab === "past"
                ? "text-indigo-400"
                : "text-stone-50"
            }`}
          >
            <FaHistory className="text-xl" />
          </button>
          <button
            onClick={() => setActiveTab("my")}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-transform ${
              activeTab === "my"
                ? "text-indigo-400"
                : "text-stone-50"
            }`}
          >
            <FaUserCircle className="text-xl" />
          </button>
        </div>
      </footer>

      {/* Main Content */}
      <main className="px-4 py-8 sm:px-8 lg:px-16 pb-24">
        <h1 className="text-center text-3xl sm:text-4xl font font-medium text-indigo-400 mb-8">
          {activeTab === "past" ? "Past Contests" : "My Contests"}
        </h1>

        {/* Loading/Error State */}
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <>
            {/* Contest Cards */}
            <section className="grid gap-6 sm-md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
              {currentContests.length > 0 ? (
                currentContests.map((contest) => (
                  <div
                    key={contest.id}
                    className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-2xl transition transform hover:scale-105"
                  >
                    <h2 className="sm-md:text-md md:text-xl font-bold text-indigo-300 mb-3">
                      {contest.contestname}
                    </h2>
                    <p className="text-gray-400 sm-md:text-xs md:text-sm mb-1">
                      Date: {getFormattedDate(contest.date)}
                    </p>
                    <p className="text-gray-400 sm-md:text-xs md:text-sm mb-1">
                      Time: {contest.start} - {contest.end}
                    </p>
                    <p className="text-gray-400 sm-md:text-xs md:text-sm mb-3">Contest ended</p>
                    <button
                      onClick={() => handleRankingRedirect(contest._id)}
                      className="w-full py-2 rounded-lg bg-indigo-600 text-white font-sm hover:bg-indigo-700 transition"
                    >
                      View Rankings
                    </button>
                    <button
                      onClick={() => handleQuestionRedirect(contest._id)}
                      className="mt-2 w-full py-2 rounded-lg bg-indigo-600 text-white font-sm hover:bg-indigo-700 transition"
                    >
                      View Questions
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400">No contests available</div>
              )}
            </section>

            {/* Pagination */}
            {currentContests.length > 0 && (
              <div className="flex justify-center mt-10 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-full bg-gray-700 text-white hover:bg-indigo-500 disabled:bg-gray-500 transition"
                >
                  &lt;
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={`page-${index}`} // Ensure unique key here
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 rounded-full transition ${
                      index + 1 === currentPage
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-full bg-gray-700 text-white hover:bg-indigo-500 disabled:bg-gray-500 transition"
                >
                  &gt;
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ContestResult;
