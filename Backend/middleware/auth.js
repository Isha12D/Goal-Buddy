const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, {expiresIn: '15m'});
};

const generateRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});
}

//middleware to authenticate user
const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({ message: 'Access Denied' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const verified = jwt.verify('token', process.env.JWT_SECRET); // Verify the token
        req.user = verified; // Attach user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(403).send('Invalid or expired token');
    }
}

module.exports = {generateAccessToken, generateRefreshToken, authenticateUser};