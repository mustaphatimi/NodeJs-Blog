const jwt = require('jsonwebtoken')

const createToken = function (_id) {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '1d' })
}

module.exports = createToken;