const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcrypt')


const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash;
    next()
})


userSchema.statics.signup = async function (username, password) {
    try {
        if (!username || !password) {
            throw new Error('All fields are required')
        }
        if (!validator.isStrongPassword(password)) {
            throw new Error('Password too weak..')
        }
        const userExists = await this.findOne({ username }).lean().exec();
        if (userExists) {
            throw new Error('User already exists')
        }
        const user = await this.create({ username, password })
        return user
    } catch (err) {
        throw new Error(err.message, err.status)
    }
}

userSchema.statics.login = async function (username, password) {
    try {
        if (!username || !password) {
            throw new Error('All fields are required')
        }
        const user = await this.findOne({ username });
        if (user) {
            const isValidPassword = await bcrypt.compare(password, user.password)
            if (isValidPassword) {
                return user;
            }
            throw new Error('Invalid login credentials')
        }
        throw new Error('Invalid login credentials')
    } catch (err) {
        throw new Error(err.message, err.status)
    }
}

const User = mongoose.model('User', userSchema)

module.exports = User;