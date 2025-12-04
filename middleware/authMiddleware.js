const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    if(!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try { 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch(error) {
        res.status(400).json({ message: 'Invalid token', error})
    }
}

module.exports = auth;