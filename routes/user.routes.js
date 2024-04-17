const express = require('express');
const router = express.Router();
const User = require('../models/user.model.js')

router.post('/register', async (req, res) => {
 const {firstname, lastname, email, password} = req.body

 try {
    let existingUser = await User.findOne({email});

    if(existingUser){
        return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
        firstname,
        lastname,
        email,
        password // Remember to hash the password before saving!
      });

      await newUser.save();
      res.status(201).send(newUser);
 } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
 }
})

module.exports = router;