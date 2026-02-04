const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId, role) => {
    return jwt.sign(
        { id: userId, role },
        process.env.JWT_SECRET || 'your_default_jwt_secret_change_this',
        { expiresIn: '30d' }
    );
};

// Verify JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'your_default_jwt_secret_change_this');
    } catch (error) {
        return null;
    }
};

module.exports = { generateToken, verifyToken };
