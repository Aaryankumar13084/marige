const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  boy: {
    name: String,
    fatherName: String,
    motherName: String,
    mobile: String,
    whatsapp: String,
    aadhar: String,
    caste: String,
    age: Number,
  },
  girl: {
    name: String,
    fatherName: String,
    motherName: String,
    mobile: String,
    whatsapp: String,
    aadhar: String,
    caste: String,
    age: Number,
  },
});

module.exports = mongoose.model("user", userSchema);