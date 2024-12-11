import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import axios from "axios";
import toast from "react-hot-toast";

const TestList = () => {
    const [tests, setTests] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const response = await axios.get("/api/test/alltests"); 
                setTests(response.data);
            } catch (err) {
                setError("Failed to load tests.");
            }
        };
        fetchTests();
    }, []);

    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

    const parseTime = (timeString)=>{
        const [timePart, modifier] = timeString.split(' ');
        let [hours, minutes] = timePart.split(':');
    
        if (modifier === 'AM' && hours === '12') {
            hours = '00';
        } else if (modifier === 'PM' && hours !== '12') {
            hours = String(parseInt(hours, 10) + 12);
        }
        return `${hours}:${minutes}`;
    }

    const checkSubmission = async (test) => {
        try {
            const response = await axios.post(`/api/answers/submitted/${test._id}`);
            if (response.data) {
                toast.error("The test is already submitted.");
                return false;
            }
            return true;
        } catch (error) {
            return true;
        }
    };


    const correctTime = (test) => {
        const start = parseTime(test.start);
        const end = parseTime(test.end); 
        const date = test.date.split("T")[0];
        const start_datetime = new Date(`${date}T${start}:00`); 
        const end_datetime = new Date(`${date}T${end}:00`);
        const current_time = new Date();
    
        if (current_time < start_datetime) {
            toast.error('The test has not started yet. Please come back at the scheduled start time.');
            return false;
        } else if (current_time >= start_datetime && current_time <= end_datetime) {
            return true; 
        } else {
            toast.error('The test has already ended. You can no longer participate.');
            return false;
        }
    };
    


    const handleTestClick = async (test) => {
        const time = correctTime(test);
        if (time) {
            const submitted = await checkSubmission(test);
            if(submitted)
            navigate(`/dashboard/testlist/${test._id}/instructions`);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-100">
                    Test Schedule
                </h1>

                {/* Responsive Card layout for mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:hidden">
                    {tests.length > 0 ? (
                        tests.map((test) => (
                            <div
                                key={test._id}
                                onClick={() => handleTestClick(test)}
                                className="cursor-pointer bg-gray-800 rounded-lg shadow-md p-4"
                            >
                                <h2 className="text-lg font-semibold text-gray-100">
                                    {test.testname}
                                </h2>
                                <p className="text-sm text-gray-300">
                                    {new Date(test.date).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </p>
                                <div className="flex justify-between mt-4">
                                    <span className="text-sm font-medium text-gray-200">
                                        Start: {test.start}
                                    </span>
                                    <span className="text-sm font-medium text-gray-200">
                                        End: {test.end}
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

                {/* Table layout for medium to large screens */}
                <div className="hidden md:block mt-8">
                    <div className="overflow-x-auto shadow-lg rounded-lg">
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-indigo-400 text-gray-900">
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">
                                        Start Time
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">
                                        End Time
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
                                                {test.testname}
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-100">
                                                {new Date(test.date).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-100">
                                                {test.start}
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-100">
                                                {test.end}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
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

export default TestList;
