const mongoose = require('mongoose');

const dbConnect = () => mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(() => console.log('MongoDB Connection Failed'));

module.exports = dbConnect;