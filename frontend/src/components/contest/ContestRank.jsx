import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ContestRank = () => {
  const { contestId } = useParams();
  const [rankingData, setRankingData] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/contest/answers/rank/${contestId}`);
        if (response.ok) {
          const data = await response.json();
          setRankingData(data); 
          // Fetch user details for each rank
          await fetchUserDetailsForRanking(data);
        } else {
          setError("Failed to load ranking data.");
        }
      } catch (err) {
        setError("An error occurred while fetching ranking data.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch user details for each user in the ranking
    const fetchUserDetailsForRanking = async (rankingData) => {
      const details = {};
      for (const rank of rankingData) {
        const user = await fetchUserDetails(rank.userId);
        details[rank.userId] = user;
      }
      setUserDetails(details);
    };

    fetchRankingData();
  }, [contestId]);

  const getMedalImage = (index) => {
    if (index === 0) return "https://i.ibb.co/khSNzXc/gold-medal.png";
    if (index === 1) return "https://i.ibb.co/PYTRgT6/silver-medal.png";
    if (index === 2) return "https://i.ibb.co/1X6RHGC/bronze-medal.png";
    return null;
  };

  const fetchUserDetails = async (userId) => {
    const response = await fetch(`/api/user/${userId}`);
    if (response.ok) {
      return await response.json();
    } else {
      return { profilePicture: "", username: "Unknown" };  // Fallback if user not found
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Navigation Header */}
      <header className="bg-gray-800 py-6 shadow-lg w-full">
        <div className="container mx-auto text-center">
          <h1 className="text-1xl sm:text-2xl md:text-3xl font-bold text-indigo-400">
            Contest Ranking
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-400">
            View the rankings for this contest
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-2 mt-6 pb-20 container mx-auto">
        {loading ? (
          <div className="text-center text-gray-400">Loading rankings...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div>
            {/* Table Layout for Custom Screen Sizes (400px and above) */}
            <div className="hidden sm-md:block">
              <table className="min-w-full bg-gray-800 rounded-t-lg shadow-lg">
                <thead >
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-black bg-indigo-400 rounded-tl-lg">
                      Rank
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-black bg-indigo-400">
                      Profile
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-black bg-indigo-400">
                      Username
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-black bg-indigo-400 rounded-tr-lg">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(rankingData) && rankingData.length > 0 ? (
                    rankingData.map((rank, index) => {
                      const user = userDetails[rank.userId] || { profilePicture: "", username: "Unknown" };
                      return (
                        <tr key={rank.userId} className="hover:bg-gray-700">
                          <td className="py-3 px-4 text-sm text-gray-400">
                            {index + 1}
                            {getMedalImage(index) && (
                              <img
                                src={getMedalImage(index)}
                                alt={`${index + 1} place`}
                                className="w-6 h-6 inline ml-2"
                              />
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <img
                              src={user.image}
                              alt={user.username}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          </td>
                          <td className="text-xs sm:text-sm md:text-base py-3 px-4 text-gray-400">
                            {user.username}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-400">
                            {rank.obtainedMarks}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-3 px-4 text-center text-gray-400"
                      >
                        Nobody attempted the contest
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Card Layout for Phones and Smaller Screens */}
            <div className="sm-md:hidden grid grid-cols-1 gap-3">
              {Array.isArray(rankingData) && rankingData.length > 0 ? (
                rankingData.map((rank, index) => {
                  const user = userDetails[rank.userId] || { profilePicture: "", username: "Unknown" };
                  return (
                    <div
                      key={rank.userId}
                      className="flex items-center bg-gray-800 p-2 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300 ease-in-out"
                    >
                      {/* Rank Number */}
                      <div className="mr-4 text-xs">{index + 1}</div>

                      {/* Profile Picture */}
                      <img
                        src={user.image}
                        alt={user.username}
                        className="w-6 h-6 rounded-full object-cover"
                      />

                      {/* User Info */}
                      <div className="ml-4 flex flex-col flex-grow justify-between">
                        <div className="text-sm font-semibold text-gray-300 truncate max-w-xs">
                          {user.username}
                        </div>
                      </div>

                      {/* Medal */}
                      <div className="mr-4 text-xs">
                        {getMedalImage(index) && (
                          <img
                            src={getMedalImage(index)}
                            alt={`${index + 1} place`}
                            className="w-6 h-6 inline ml-2"
                          />
                        )}
                      </div>

                      {/* Score */}
                      <div className="text-sm font-semibold text-indigo-400 ml-4">
                        {rank.obtainedMarks}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-400">
                  Nobody attempted the contest
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ContestRank;