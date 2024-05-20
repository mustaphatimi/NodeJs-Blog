const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const User = require('../models/user')
const createToken = require('../utilities/createToken')
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth')


router.get('/', async (req, res) => {
    const locals = {
        title: "NodeJs Blog",
        description: "Simple Blog created with NodeJs, Express and MongoDB."
    }
    try {
        let page = req.query.page || 1;
        let perPage = 5;

        const data = await Blog.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec()

        const count = await Blog.count();
        const nextPage = parseInt(page) + 1;
        const prevPage = parseInt(page) - 1
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
        const hasPrevPage = page > 1;


        res.render('blog/home', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            prevPage: hasPrevPage ? prevPage : null
        })
    } catch (error) {
        console.log(error)
    }
})

router.post('/search', async (req, res) => {
    try {
        const { searchTerm } = req.body;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

        const data = await Blog.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
            ]
        })
        const locals = {
            title: `${searchTerm} search results`,
            description: "Simple Blog created with NodeJs, Express and MongoDB."
        }
        res.render('blog/search', { locals, data })
    } catch (error) {
        console.log(error)
    }
})


router.get('/about', (req, res) => {
    const locals = {
        title: `About NodeJs Blog`,
        description: "Simple Blog created with NodeJs, Express and MongoDB."
    }
    res.render('blog/about', { locals })
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid blog ID');
        }
        const blog = await Blog.findById(id)
        const locals = {
            title: blog.title,
            description: "Simple Blog created with NodeJs, Express and MongoDB."
        }
        res.render('blog/show', { locals, blog })
    } catch (err) {
        console.log(err.message)
    }
})

module.exports = router;
