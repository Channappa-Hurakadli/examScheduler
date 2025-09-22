const History = require('../models/historyModel');

/**
 * @desc    Get the generation history for the logged-in user
 * @route   GET /api/history
 * @access  Private
 */
const getHistory = async (req, res) => {
  try {
    // Find all history documents in the database that match the current user's ID.
    // req.user.uid is added to the request object by our authentication middleware.
    // We sort by 'createdAt' in descending order to show the most recent items first.
    const history = await History.find({ user: req.user.uid }).sort({ createdAt: -1 });

    if (history) {
      res.status(200).json(history);
    } else {
      // This case is unlikely but handled for completeness.
      res.status(404).json({ message: 'No history found for this user.' });
    }
  } catch (error) {
    console.error('Get History Error:', error);
    res.status(500).json({ message: 'Server error while fetching history.' });
  }
};

module.exports = { getHistory };

