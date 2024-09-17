// api/firebase-config.js

export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://www.zaroorireturn.com'); // Allow your domain
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS'); // Allow GET and OPTIONS methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow Content-Type header

    // Handle OPTIONS preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end(); // Preflight response
    }

    if (req.method === 'GET') {
        // Check the Referer header (optional, for extra security)
        const referer = req.headers.referer || '';
        if (!referer.startsWith('https://www.zaroorireturn.com')) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        // Send Firebase configuration
        res.status(200).json({
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID
        });
    } else {
        res.setHeader('Allow', ['GET', 'OPTIONS']); // Only allow GET and OPTIONS
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
