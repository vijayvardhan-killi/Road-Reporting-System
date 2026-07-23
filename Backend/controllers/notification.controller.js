import Notification from "../models/notification.model.js";

// internal helper — not a route handler, used by other controllers
export const notify = async ({ recipient, message, type, ticket }) => {
    if (!recipient) return; // e.g. anonymous reports have no user to notify
    try {
        await Notification.create({ recipient, message, type, ticket });
    } catch (error) {
        // notification failures should never break the primary request
        console.error("Failed to create notification:", error.message);
    }
};

export const getMyNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50);

        const unreadCount = await Notification.countDocuments({ recipient: req.user.id, read: false });

        res.status(200).json({
            success: true,
            data: notifications,
            unreadCount,
        });
    } catch (error) {
        next(error);
    }
};

export const markNotificationRead = async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user.id },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        next(error);
    }
};

export const markAllNotificationsRead = async (req, res, next) => {
    try {
        await Notification.updateMany({ recipient: req.user.id, read: false }, { read: true });
        res.status(200).json({ success: true, message: "All notifications marked read" });
    } catch (error) {
        next(error);
    }
};
