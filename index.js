const express = require('express')
const app = express()
const morgan = require('morgan')
const config = require('config')

app.use(express.json())
// console.log(config.get('password'));

if(app.get('env') === 'development') {
    app.use(morgan('tiny'))
    console.log('Morgan enabled...');
}

app.use('/api/genres', require('./routes/genres'))

const PORT = 5000;

app.listen(PORT, ()=>{console.log(`Server running on port: ${PORT}`)})