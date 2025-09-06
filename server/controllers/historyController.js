const { db } = require('../config/firebase');

const getHistory = async (req, res) => {
    const { collectionName } = req.params;
    const userId = req.user.uid;

    try {
        const historySnapshot = await db.collection('users').doc(userId)
            .collection(collectionName).orderBy('createdAt', 'desc').get();
            
        const history = historySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate()
        }));
        
        res.status(200).json(history);
    } catch (error) {
        console.error(`Error fetching history from ${collectionName}:`, error);
        res.status(500).json({ message: `Error fetching ${collectionName} history`, error: error.message });
    }
};

module.exports = { getHistory };
