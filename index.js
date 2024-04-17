const express = require('express');
const dbConnect = require('./dbConnect.js')

const dotenv = require('dotenv');
const app = express();

dotenv.config();

dbConnect()

app.get('/' , (req,res) => {
    res.send('welcome')
})

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));