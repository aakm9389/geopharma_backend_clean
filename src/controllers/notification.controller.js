import Notification from '../models/Notification.js';

export const getNotificationsForUser = async (req, res) => {
  try {
    const { profession, role } = req.user;

    // 🔥 ADMIN → tout voir
    if (role === 'admin') {
      const all = await Notification.find().sort({ createdAt: -1 });
      return res.json(all);
    }

    // USER → ciblage
    const notifications = await Notification.find({
      $or: [
        { isGlobal: true },
        { professions: profession },
      ],
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
