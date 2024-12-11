import axios from 'axios';
import React,{ useState } from 'react';
import { FaBookOpen, FaCheckCircle, FaLaptopCode, FaHeadset } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingSpinner from "../common/loadingSpinner";

const ContestInstruction = () => {
    const { contestId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const parseTime = (timeString) => {
        const [timePart, modifier] = timeString.split(' ');
        let [hours, minutes] = timePart.split(':');

        if (modifier === 'AM' && hours === '12') {
            hours = '00';
        } else if (modifier === 'PM' && hours !== '12') {
            hours = String(parseInt(hours, 10) + 12);
        }
        return `${hours}:${minutes}`;
    };


    const checkSubmission = async (contest) => {
        try {
            const response = await axios.post(`/api/contest/answers/submitted/${contest._id}`);
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

    const handleTestClick = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/contests/${contestId}`);
            const contest = response.data;
            const timeValid = correctTime(contest);
            if (timeValid) {
                const submitted = await checkSubmission(contest);
                if(submitted)
                navigate(`/dashboard/contest/${contestId}/attempt`);
            }
        } catch (error) {
            console.error("Error fetching test:", error);
            toast.error("Failed to fetch test details.");
        } finally{
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-100">
                Instructions
            </h1>

            <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <div className="flex items-center mb-4">
                    <FaBookOpen className="text-blue-600 text-3xl mr-2" />
                    <h2 className="text-2xl font-semibold text-gray-100">General Guidelines</h2>
                </div>
                <ol className="list-decimal list-inside text-gray-300 mb-4">
                    <li>Read all instructions carefully before starting.</li>
                    <li>Ensure you have a stable internet connection.</li>
                    <li>Gather all necessary materials before beginning.</li>
                    <li>Follow the given time limits for each section.</li>
                </ol>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <div className="flex items-center mb-4">
                    <FaLaptopCode className="text-purple-600 text-3xl mr-2" />
                    <h2 className="text-2xl font-semibold text-gray-100">Marks Distribution</h2>
                </div>
                <ol className="list-decimal list-inside text-gray-300 mb-4">
                    <li>For each correct answer, 4 mark is awarded.</li>
                    <li>For each incorrect answer, 0.25 mark is deducted.</li>
                    <li>No marks are deducted for non-attempted questions.</li>
                </ol>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <div className="flex items-center mb-4">
                    <FaCheckCircle className="text-green-600 text-3xl mr-2" />
                    <h2 className="text-2xl font-semibold text-gray-100 ">Specific Instructions</h2>
                </div>
                <ol className="list-decimal list-inside text-gray-300 mb-4">
                    <li>For each question, select the best answer.</li>
                    <li>Review your answers before submitting.</li>
                    <li>Click the submit button only when you are sure.</li>
                </ol>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                <div className="flex items-center mb-4">
                    <FaHeadset className="text-red-600 text-3xl mr-2" />
                    <h2 className="text-2xl font-semibold text-gray-100 ">Support</h2>
                </div>
                <p className="text-gray-300 mb-4">
                    If you encounter any issues, please contact our support team at:
                </p>
                <p className="font-semibold text-gray-100">ps90798173@gmail.com</p>
            </div>

            <div className="text-center">
                <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200" onClick={handleTestClick}
                disabled={loading}>
                {loading ? (
                    <div className="flex items-center">
                    <LoadingSpinner size="md" />
                    <span className="ml-2">Start Now</span>
                    </div>
                    ) : "Start Now"}
                </button>
            </div>
        </div>
    );
};

export default ContestInstruction;