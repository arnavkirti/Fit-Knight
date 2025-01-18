// add zod validation
// test apis
const {Notification} = require("../modals/Notification");

exports.createNotification = async (req, res) => {
  try {
    const { userId, type, message } = req.body;

    const notification = new Notification({
      userId,
      type,
      message,
      data,
    });
    await notification.save();

    res
      .status(201)
      .json({ message: "Notification created successfully", notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.fetchUserNotifications = async (req, res) => {
  try {
    const { userId } = req.userId;
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.fetchAdminNotifications = async (req, res) => {
  try {
    const { adminId } = req.adminId;
    const notifications = await Notification.find({ adminId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.markRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Notification marked as read", notification });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
