const express = require('express');
const router = express.Router();
const User = require('../models/user')
const Blog = require('../models/blog');
const createToken = require('../utilities/createToken');
const jwt = require('jsonwebtoken')
const crypto = require('crypto');

const adminLayout = '../views/layouts/admin-boilerplate'

router.get('/dashboard', async (req, res) => {
    const locals = {
        title: 'Admin Dashboard',
        description: 'The index page for the NodeJs Blog admins'
    }
    const data = await Blog.find()
    res.render('user/admin-home', { data, locals, layout: adminLayout })
})

router.get('/register', (req, res) => {
    res.render('user/signup')
})

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.signup(username, password)
        if (user) {
            const token = createToken(user._id)
            res.cookie('token', token, { httpOnly: true })
            await user.save();
            return res.json({ message: 'Registration successful', user, token })
        }
        throw new Error('Registration failed')
    } catch (err) {
        next(new Error(err.message, err.status))
    }
})

router.get('/login', (req, res) => {
    res.render('user/login')
})


router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await User.login(username, password)
        if (user) {
            const token = createToken(user._id)
            res.cookie('token', token, { httpOnly: true })
            const verify = jwt.verify(token, process.env.JWT_SECRET)
            if (verify) {
                return res.json({ message: 'Login successful', user, token })
            } throw new Error('Invalid login credentials')
        } throw new Error('Login failed')
    } catch (err) {
        next(new Error(err.message, err.status))
    }
})

router.get('/logout', async (req, res) => {
    res.clearCookie('token')
    res.redirect('/')
})

module.exports = router;