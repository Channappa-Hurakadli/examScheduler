const admin = require('firebase-admin');

// IMPORTANT: Create a service account in your Firebase project settings
// and download the JSON key file.
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };
