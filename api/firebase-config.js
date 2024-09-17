// api/firebase-config.js
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault()
    });
}

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://www.zaroorireturn.com'); // Replace with your allowed domain
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS'); // Allow GET requests and OPTIONS preflight
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow Content-Type and Authorization headers

    // Handle OPTIONS preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end(); // Preflight response
    }

    if (req.method === 'GET') {
        // Verify the ID token from the request header
        const idToken = req.headers['authorization']?.split('Bearer ')[1];
        if (!idToken) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            if (decodedToken) {
                res.status(200).json({
                    apiKey: process.env.FIREBASE_API_KEY,
                    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
                    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
                    appId: process.env.FIREBASE_APP_ID
                });
            } else {
                res.status(403).json({ error: 'Forbidden' });
            }
        } catch (error) {
            res.status(403).json({ error: 'Invalid token' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'OPTIONS']); // Only allow GET and OPTIONS
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
