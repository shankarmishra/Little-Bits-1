const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'heyyyy chachaa'; // Replace with your actual secret

function userauth(req, res, next) {
    // Extract the token from cookies
    const token = req.cookies.token; // Use req.cookies to access cookies

    // If there is no token, return an error
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach user data to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(400).json({ error: 'Invalid token', details: error.message });
    }
}

module.exports = userauth;

