const express = require('express')
const router = express.Router()
const Joi = require('joi')

function validateGenres(genre){
    const genres = Joi.object({genre: Joi.string().required()})
    return genres.validate(genre)

}

const genreList = []

router.get('/genres', (req, res) => {
    res.json({genreList})
})

router.get('/genres/:id', (req, res)=> {
    const result = genreList.find(c => c.id == req.params.id )
    console.log(genreList);
    console.log(result);
    if(!result) return res.status(404).json({msg: "genre not found"})

    res.json({result})
})

router.post('/genres', (req, res) => {
   try {
    
    const result = validateGenres(req.body)

    if(result.error) return res.status(400).json(result.error.details[0].message)

    genreList.push({genre: result, id: genreList.length + 1})

    res.json({genreList})
   } catch (error) {
       console.error(error);
    res.status(400).json({msg : "Server error"})
   } 
})

router.delete('/genres/:id', (req,res)=>{
    try {
        const result = genreList.find(genre => genre.id == req.params.id)

        if(!result) return res.status(404).json({msg: 'genre does not exists'})

        const index = genreList.indexOf(result)

        genreList.splice(index, 1)
        res.json({genreList})
    } catch (error) {
        console.error(error);
        res.status(400).json({msg : "Server error"})
    }
    
})

module.exports = router