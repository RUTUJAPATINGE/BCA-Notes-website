const Contact = require("../models/Contact");

// Save contact message
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = new Contact({ name, email, subject, message });
    await contact.save();
    res.json({ message: "Message sent successfully!", contact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all messages (only for admin in future)
exports.getMessages = async (req, res) => {
  try {
    const messages = await Contact.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
