const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const cookie = require('cookie')
const jwt = require("jsonwebtoken");
const {
  registrationSchema,
  loginSchema,
} = require("../validations/user.validation.js");

const registerUser = async (req, res) => {
  const { error } = registrationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { username, email, password } = req.body;

  try {
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      username,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

const loginUser = async (req, res) => {
    const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };
    

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 7);
        res.cookie('jwtToken', token, { expires: expiryDate  ,httpOnly: true, secure:true, sameSite: "Lax", domain:'e-commerce-nkdszu14l-chintan8320s-projects.vercel.app'});
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

const addWishList = async(req, res) => {
  try {
    
    const {userId, productId} = req.body
  
    const user = await User.findById(userId);
  
    if(!user) {
      return res.status(400).json({ message: "User Does Not Exist" });
    }
  
    user.wishList.push(productId);
  
    user.save()
  
    res.status(200).json({ message: "Product Added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
const addOrder = async(req, res) => {
  try {
    
    const {userId, productId} = req.body
  
    const user = await User.findById(userId);
  
    if(!user) {
      return res.status(400).json({ message: "User Does Not Exist" });
    }
  
    user.orders.push(productId);
  
    user.save()
  
    res.status(200).json({ message: "Product Added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getWishList = async(req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('wishList');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    

    res.json(user.wishList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
const getOrders = async(req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('orders');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    

    res.json(user.orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const removeWishList = async(req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productId;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishList: productId } },
      { new: true }
    ).populate('wishList');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.wishList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
const removeOrders = async(req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productId;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { orders: productId } },
      { new: true }
    ).populate('orders');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const removeOneOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the index of the first occurrence of the productId in the orders array
    const orderIndex = user.orders.indexOf(productId);

    if (orderIndex > -1) {
      // Remove the first occurrence of the productId from the orders array
      user.orders.splice(orderIndex, 1);

      // Save the updated user document
      await user.save();
    } else {
      return res.status(404).json({ message: 'Product not found in user orders' });
    }

    // Populate orders again to get the latest state
    await user.populate('orders')

    res.json(user.orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { registerUser, loginUser, addWishList, getWishList, removeWishList, getOrders, addOrder, removeOrders, removeOneOrders };
