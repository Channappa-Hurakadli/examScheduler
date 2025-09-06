const { auth } = require('../config/firebase');
const jwt = require('jsonwebtoken');

// A simple in-memory store for custom claims for demo purposes.
// In a real app, you might store roles in Firestore.
const generateToken = (uid) => {
    // This token is what Firebase client SDKs generate.
    // For a custom backend, we'll verify Firebase ID tokens directly.
    // This function is kept for potential future use with custom tokens.
    return jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn: '30d' });
};


const registerUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userRecord = await auth.createUser({
            email,
            password,
        });
        res.status(201).json({
            uid: userRecord.uid,
            email: userRecord.email,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const authUser = async (req, res) => {
    // Note: Firebase client SDK handles login and gets an ID token.
    // This endpoint is conceptually where a client would send credentials,
    // but the actual sign-in happens on the client, which then sends the
    // resulting ID token to protected backend routes.
    // We leave this here for clarity on the auth flow.
    res.status(200).json({ message: "Login is handled by the Firebase client SDK. Use the token from the client to access protected routes." });
};


module.exports = { registerUser, authUser };
