import Notification from "../models/notification.model.js";

export const getNotification = async (req, res) => {
    try {
        const userId = req.user.id; 
        const notifications = await Notification.find({
            $or: [{ user: userId }, { broadcast: true }],
        }).sort({ createdAt: -1 });

        const notificationIds = notifications.map(notification => notification._id);

        await Notification.updateMany(
            { _id: { $in: notificationIds } },
            { $addToSet: { viewedBy: userId } } 
        );

        res.status(200).json({ notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve notifications",
            error: error.message,
        });
    }
};


export const countNotification = async (req, res) => {
    try {
        const userId = req.user.id; 
        const count = await Notification.countDocuments({
            $or: [{ user: userId }, { broadcast: true }],
            viewedBy: { $ne: userId }, 
        });

        res.status(200).json({ count }); 
    } catch (error) {
        console.error("Error counting notifications:", error);
        res.status(500).json({
            success: false,
            message: "Failed to count notifications",
            error: error.message,
        });
    }
};