const express = require('express');
const dbConnect = require('./dbConnect.js')
const cors = require('cors');

const dotenv = require('dotenv');
const app = express();

const cloudinary = require('cloudinary'); 

dotenv.config();
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});



app.use(express.json());

app.use(cors());


dbConnect()

app.use('/api/v1' , require('./routes/user.routes.js'))
app.use('/api/v1/product', require('./routes/product.routes.js'))

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));