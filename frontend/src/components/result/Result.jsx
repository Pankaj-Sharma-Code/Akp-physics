import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import axios from "axios";
import toast from "react-hot-toast";

const Result = () => {
    const [tests, setTests] = useState([]);
    const [testNames, setTestNames] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const response = await axios.get("/api/answers/result");
                setTests(response.data);
                await fetchTestNames(response.data); 
            } catch (err) {
                setError("Failed to load tests.");
            }
        };
        fetchTests();
    }, []);

    const fetchTestNames = async (tests) => {
        const names = {};
        for (const test of tests) {
            try {
                const response = await axios.get(`/api/test/${test.testId}`);
                names[test.testId] = response.data.testname; 
            } catch (err) {
                console.error(`Failed to fetch name for test ID ${test.testId}:`, err);
            }
        }
        setTestNames(names);
    };

    const handleTestClick = async (test) => {
        navigate(`/dashboard/result/result-dashboard/${test.testId}`);
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-100">
                    Result
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:hidden">
                    {tests.length > 0 ? (
                        tests.map((test) => (
                            <div
                                key={test._id}
                                onClick={() => handleTestClick(test)}
                                className="cursor-pointer bg-gray-800 rounded-lg shadow-md p-4 transition-transform duration-200 hover:scale-105"
                            >
                                <h2 className="text-lg font-semibold text-gray-100">
                                    {testNames[test.testId] || 'Loading...'} 
                                </h2>
                                <p className="text-sm text-gray-300">
                                    Obtained Marks: {test.obtainedMarks} / {test.maxMarks}
                                </p>
                                <div className="flex justify-between mt-2">
                                    <span className="text-sm font-medium text-gray-200">
                                        Correct: {test.correct}
                                    </span>
                                    <span className="text-sm font-medium text-gray-200">
                                        Incorrect: {test.incorrect}
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <span className="text-sm font-medium text-gray-200">
                                        Skipped: {test.skipped || 0}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500">
                            No tests available
                        </div>
                    )}
                </div>

                <div className="hidden md:block mt-8">
                    <div className="overflow-x-auto shadow-lg rounded-lg">
                        <table className="min-w-full table-auto bg-gray-800">
                            <thead>
                                <tr className="bg-indigo-400 text-gray-900">
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">
                                        Test Name
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">
                                        Obtained Marks
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">
                                        Correct Answers
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">
                                        Incorrect Answers
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">
                                        Skipped Questions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tests.length > 0 ? (
                                    tests.map((test) => (
                                        <tr
                                            key={test._id}
                                            onClick={() => handleTestClick(test)}
                                            className="cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
                                        >
                                            <td className="px-6 py-4 text-center text-gray-100">
                                                {testNames[test.testId] || 'Loading...'} 
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-100">
                                                {test.obtainedMarks} / {test.maxMarks}
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-100">
                                                {test.correct}
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-100">
                                                {test.incorrect}
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-100">
                                                {test.skipped || 0}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="text-center py-4 text-gray-500"
                                        >
                                            No tests available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Result;
