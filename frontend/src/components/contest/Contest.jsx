
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Contest = () => {
    const [upcomingContests, setUpcomingContests] = useState([]);
    const [featuredContests, setFeaturedContests] = useState([]);
    const [pastContests, setPastContests] = useState([]);
    const [countdowns, setCountdowns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSyllabus, setSelectedSyllabus] = useState("");
    const navigate = useNavigate();


    const getTimeLeft = (contestDateTime) => {
        const currentTime = new Date();
        const contestTime = new Date(contestDateTime);
        const timeDiff = contestTime - currentTime;

        if (timeDiff <= 0) {
            return {
                days: '00',
                hours: '00',
                minutes: '00',
                seconds: '00',
                started: true,
            };
        }

        const seconds = Math.floor((timeDiff / 1000) % 60);
        const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
        const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const pad = (num) => num.toString().padStart(2, '0');
        return {
            days: pad(days),
            hours: pad(hours),
            minutes: pad(minutes),
            seconds: pad(seconds),
            started: false,
        };
    };

    const getFormattedDate = (date) => {
        if (!date) return 'Not available';

        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const parseContestDateTime = (contest) => {
        const date = new Date(contest.date);
        const [startHour, startMinute] = contest.start.split(/[:\s]/);
        const isPM = contest.start.includes("PM");

        let hours = parseInt(startHour);
        if (isPM && hours !== 12) hours += 12;
        if (!isPM && hours === 12) hours = 0;

        date.setHours(hours);
        date.setMinutes(parseInt(startMinute));
        date.setSeconds(0);

        return date;
    };

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const upcomingResponse = await axios.get('/api/contests/upcoming');
                const featuredResponse = await axios.get('/api/contests/featured');
                const pastResponse = await axios.get('/api/contests/past');

                if (upcomingResponse.data.success) {
                    setUpcomingContests(upcomingResponse.data.data);
                }
                if (featuredResponse.data.success) {
                    setFeaturedContests(featuredResponse.data.data);
                }
                if (pastResponse.data.success) {
                    setPastContests(pastResponse.data.data);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching contests:', error);
                setLoading(false);
            }
        };

        fetchContests();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (upcomingContests.length > 0) {
                const newCountdowns = upcomingContests.map((contest) => getTimeLeft(parseContestDateTime(contest)));
                setCountdowns(newCountdowns);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [upcomingContests]);

    const skeletonLoader = (width, height) => (
        <div className="skeleton" style={{ width: width, height: height }}></div>
    );

    const openSyllabusModal = (syllabus) => {
        setSelectedSyllabus(syllabus);
        setIsModalOpen(true);
    };

    const closeSyllabusModal = () => {
        setIsModalOpen(false);
        setSelectedSyllabus("");
    };

    const handleStartContest = async (contestId) => {
        try {
            const response = await axios.post(`/api/contests/register/${contestId}`);
            if (response.status === 200) {
                toast.success(response.data.message);
                navigate(`/dashboard/contest/${contestId}/instructions`);
            }
        } catch (error) {
            toast.error("Error starting contest: " + (error.response?.data?.message || "Server Error"));
        }
    };


    return (
        <div className="bg-gray-900 text-white min-h-screen p-6 select-none">
            <div className="text-center mb-10">
                <img src="https://i.ibb.co/h7B7zKs/award.png" alt="Trophy" className="mx-auto w-16 h-16 mb-4" />
                <h1 className="text-3xl font-bold">Practice Contest</h1>
                <p className="text-gray-400">Contest every week. Compete and see your ranking!</p>
            </div>

            {/* Upcoming Contests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 w-full">
                {loading || countdowns.length < upcomingContests.length ? (
                    <>
                        {Array.from({ length: 2 }).map((_, index) => (
                            skeletonLoader('100%', '250px')
                        ))}
                    </>
                ) : upcomingContests.length > 0 ? (
                    upcomingContests.map((contest, index) => {
                        const countdown = countdowns[index] || {};
                        const showStartButton = countdown.started;

                        return (
                            <div key={index} className="bg-gray-800 rounded-lg p-6 text-center">
                                <h2 className="text-xl font-semibold mt-1">{contest.contestname}</h2>
                                <p className="text-gray-400 mt-1">Date: {getFormattedDate(contest.date)}</p>
                                <p className="text-gray-400 mt-1">Start: {contest.start} GMT+05:30</p>
                                <p className="text-gray-400 mt-1">End: {contest.end} GMT+05:30</p>

                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mt-2"
                                    onClick={() => openSyllabusModal(contest.syllabus)}
                                >
                                    View Syllabus
                                </button>

                                {showStartButton ? (
                                    <button
                                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded mt-2 ml-2"
                                        onClick={() => handleStartContest(contest._id)}
                                    >
                                        Start Contest
                                    </button>
                                ) : (
                                    <div className="flex flex-wrap justify-center text-green-500 mt-3 w-full">
                                        <div className="flex flex-col items-center w-16">
                                            <span className="countdown font-mono text-base sm:text-xl">
                                                {countdown.days || 0}
                                            </span>
                                            <span className="text-xs sm:text-sm">days</span>
                                        </div>
                                        <div className="flex flex-col items-center w-16">
                                            <span className="countdown font-mono text-base sm:text-xl">
                                                {countdown.hours || 0}
                                            </span>
                                            <span className="text-xs sm:text-sm">hours</span>
                                        </div>
                                        <div className="flex flex-col items-center w-16">
                                            <span className="countdown font-mono text-base sm:text-xl">
                                                {countdown.minutes || 0}
                                            </span>
                                            <span className="text-xs sm:text-sm">min</span>
                                        </div>
                                        <div className="flex flex-col items-center w-16">
                                            <span className="countdown font-mono text-base sm:text-xl">
                                                {countdown.seconds || 0}
                                            </span>
                                            <span className="text-xs sm:text-sm">sec</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center text-gray-400">No upcoming contests available.</p>
                )}
            </div>


            {/* Modal for Syllabus */}
            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-gray-800 text-white rounded-lg p-6 max-w-lg w-full">
                        <h2 className="text-2xl font-semibold mb-4">Contest Syllabus</h2>
                        <div className="mb-4">{selectedSyllabus}</div>
                        <button
                            onClick={closeSyllabusModal}
                            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded mt-4 w-full"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Featured Contests */}
            <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4">Featured Contests</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {loading ? (
                        <>
                            {skeletonLoader('100%', '220px')}
                            {skeletonLoader('100%', '220px')}
                            {skeletonLoader('100%', '220px')}
                        </>
                    ) : featuredContests.length > 0 ? (
                        featuredContests.map((contest, index) => (
                            <div key={index} className="bg-gray-800 rounded-lg p-4 text-center">
                                <h3 className="text-lg font-semibold">{contest.contestname}</h3>
                                <p className="text-gray-400">{getFormattedDate(contest.date)}</p>
                                <p className="text-gray-400">Contest ended</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400">No featured contests available.</p>
                    )}
                </div>
            </div>

            {/* Past Contests */}
            <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4">Past Contests</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <>
                            {skeletonLoader('100%', '220px')}
                            {skeletonLoader('100%', '220px')}
                            {skeletonLoader('100%', '220px')}
                        </>
                    ) : pastContests.length > 0 ? (
                        pastContests.slice(0, 10).map((contest, index) => (
                            <div key={index} className="bg-gray-800 rounded-lg p-4 text-center">
                                <h3 className="text-lg font-semibold">{contest.contestname}</h3>
                                <p className="text-gray-400">{getFormattedDate(contest.date)}</p>
                                <p className="text-gray-400">Contest ended</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400">No past contests available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contest;
