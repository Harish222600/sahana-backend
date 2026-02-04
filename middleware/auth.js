const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = verifyToken(token);

            if (!decoded) {
                return res.status(401).json({ error: 'Not authorized, token failed' });
            }

            // Get user from token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ error: 'User not found' });
            }

            if (!req.user.isActive) {
                return res.status(401).json({ error: 'User account is inactive' });
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token' });
    }
};

// Authorize specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authorized' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: `User role '${req.user.role}' is not authorized to access this route`
            });
        }

        next();
    };
};

module.exports = { protect, authorize };
