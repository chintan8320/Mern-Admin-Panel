const express = require('express');
const dbConnect = require('./dbConnect.js')

const dotenv = require('dotenv');
const app = express();

app.use(express.json());

dotenv.config();

dbConnect()

app.use('/api/v1' , require('./routes/user.routes.js'))

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));