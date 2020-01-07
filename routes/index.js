const express = require('express')
const router = express.Router()
const Show = require('../models/show')

router.get('/', async (req,res) => {
    let shows
    try {
        shows = await Show.find().sort({createdAt: 'desc'}).limit(10).exec()
    } catch {
        shows = []
    }
    res.render('index', {shows: shows})
})

module.exports = router