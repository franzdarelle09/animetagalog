const mongoose = require('mongoose')
const path = require('path')

const coverImageBasePath = 'uploads/showCovers'
const showSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    genre: {
        type: String
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    }
})

showSchema.virtual('coverImagePath').get(function(){
    if (this.coverImageName != null) {
        return path.join('/',coverImageBasePath,this.coverImageName)
    }
})

module.exports = mongoose.model('Show', showSchema)
module.exports.coverImageBasePath = coverImageBasePath