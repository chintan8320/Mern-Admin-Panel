const express = require('express');
const dbConnect = require('./dbConnect.js')
const cors = require('cors');

const dotenv = require('dotenv');
const app = express();

const cloudinary = require('cloudinary'); 

cloudinary.v2.config({
  cloud_name: "du9xly9oi",
  api_key: "131116985193162",
  api_secret: "BdZEjNw6rZy9i76DHK_yWv6OS3Q"
});

// YOUR_CLOUD_NAME = "du9xly9oi"
// YOUR_API_SECRET = "BdZEjNw6rZy9i76DHK_yWv6OS3Q"
// YOUR_API_KEY = "131116985193162"

app.use(express.json());

app.use(cors());

dotenv.config();

dbConnect()

app.use('/api/v1' , require('./routes/user.routes.js'))
app.use('/api/v1/product', require('./routes/product.routes.js'))

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));