const Product = require("../models/product.model.js");
const getDataUri = require("../utils/dataURI.js");
const cloudinary = require("cloudinary");

const createProduct = async (req, res) => {
  try {
    const { price, category, quantity, name, description } = req.body;
    const file = req.file;
    const fileUri = getDataUri(file);
    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);
    const newProduct = new Product({
      price,
      category,
      quantity,
      name,
      description,
      file: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

const getProduct = async (req, res) => {
  const { category, searchQuery, minPrice, maxPrice } = req.query;
  console.log(req.query)
  try {
    let query = {};
    
    if (category) {
      if(category === 'all'){
        query = {};
      }else{

        query.category = category;
      }

    }
    if (searchQuery) {
      query.name = new RegExp(searchQuery, 'i'); 
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      
      if (minPrice) {
        query.price.$gte = parseFloat(minPrice);
      }
      
      if (maxPrice) {
        query.price.$lte = parseFloat(maxPrice);
      }
    }
    
    console.log(query, "query")
    const products = await Product.find(query);

    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};



const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(500).send("Server Error");
  }
};

const updateProduct = async (req, res) => {
  try {
    const { price, category, quantity, name, description } = req.body;

    let data = {
      price,
      category,
      quantity,
      name,
      description,
    };
    if (req.file) {
      const file = req.file;
      const fileUri = getDataUri(file);
      const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);
      data = {
        ...data,
        file: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
      };
    }

    console.log(data, "data");
    const product = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    console.log(err.kind, "kind");
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(500).send("Server Error");
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(500).send("Server Error");
  }
};

module.exports = {
  createProduct,
  getProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
