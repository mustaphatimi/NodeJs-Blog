const jwt = require('jsonwebtoken');
const User = require('../models/user')

const requireAuth = async (req, res, next) => {
    const { token } = req.cookies;
    try {
        if (!token) {
            return res.status(400).json({ message: 'You must be logged in to view this page' })
        }
        const { _id } = jwt.verify(token, process.env.JWT_SECRET)
        if (!_id) {
            throw new Error('Invalid Token')
        }
        const user = await User.findById(_id)
        if (user) {
            req.user = user._id;
            return next()
        }
        throw new Error('User not found', 404)
    } catch (error) {
        next(new Error(err.message, err.status))
    }

}

module.exports = requireAuth;