import axios from "axios";
import { useEffect, useState } from "react";
import LoadingSpinner from "../common/loadingSpinner";


const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get("/api/notification"); 
                setNotifications(response.data.notifications);
            } catch (err) {
                console.error("Error fetching notifications:", err);
                setError("Failed to fetch notifications.");
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
              <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-800 text-gray-100">
                <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-semibold mb-6">Notifications</h2>
                    <div className="text-red-500">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-800 text-gray-100">
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-semibold mb-6">Notifications</h2>
                <div className="space-y-4">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification._id} 
                                className="flex items-start p-4 bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out"
                            >
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium">{notification.title}</h3>
                                    <p className="text-sm text-gray-300">{notification.message}</p>
                                    <span className="text-xs text-gray-400">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>No notifications available.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notification;
