const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Show = require('../models/show')
const uploadPath = path.join('public', Show.coverImageBasePath)
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/png']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})


router.get('/', async (req,res) => {
    let query = Show.find()
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate',req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate',req.query.publishedAfter)
    }

    try {
        const shows = await query.exec()
        res.render('shows/index', {shows: shows, searchOptions: req.query})
    } catch {
        
    }
    
})

router.get('/new', async (req,res) => {
    renderNewPage(res, new Show())
})

router.post('/', upload.single('cover'), async (req,res) => {
   const fileName = req.file != null ? req.file.filename : null
   const show = new Show({
       title: req.body.title,
       author: req.body.author,
       publishDate: new Date(req.body.publishDate),
       genre: req.body.genre,
       coverImageName: fileName,
       description: req.body.description
   })
   try {
    const newShow = await show.save()
    // res.redirect(`shows/${newShow.id}`)
    res.redirect(`shows`)
   } catch {    
    if (show.coverImageName != null){
        removeBookCover(show.coverImageName)
    }
    renderNewPage(res, show, true)
   }
})

function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}

async function renderNewPage(res, show, hasError = false) {
    try {
        const authors = await Author.find({})
        const show = new Show()
        const params = {authors: authors, show:show}
        if (hasError) params.errorMessage = 'Error creating show'
        res.render('shows/new', params)
    }catch{
        res.redirect('/shows')
    }
}

module.exports = router