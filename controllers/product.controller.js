const Product = require('../models/product.model.js')
const getDataUri = require('../utils/dataURI.js')
const cloudinary = require('cloudinary')


const createProduct = async(req, res) => {
    try {
      const {price, category, quantity, name, description} = req.body 
      const file = req.file
      const fileUri = getDataUri(file)
      const myCloud = await cloudinary.v2.uploader.upload(fileUri.content)
        const newProduct = new Product({price, category, quantity, name, description, 
        file : {
          public_id:myCloud.public_id,
          url:myCloud.secure_url
        }
        });
        await newProduct.save();
        res.status(201).json(newProduct);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
}

const getProduct = async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }

const getProductById = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(500).send('Server Error');
    }
  }

const updateProduct = async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (err) {
      console.error(err.message);
      console.log(err.kind, 'kind')
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(500).send('Server Error');
    }
  }

const deleteProduct = async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json({ message: 'Product deleted' });
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(500).send('Server Error');
    }
  }

module.exports = {createProduct, getProduct, getProductById, updateProduct, deleteProduct}