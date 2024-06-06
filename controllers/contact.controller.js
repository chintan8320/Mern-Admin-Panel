const Contact = require("../models/contact.model");

const addContact = async (req, res) => {
  try {
    const { message, website_url, mobile_number, email, name } = req.body;

    const newContact = new Contact({
        message, website_url, mobile_number, email, name
    });

    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    addContact
  };
