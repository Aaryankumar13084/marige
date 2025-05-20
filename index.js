const express = require("express");
const app = express();
const path = require("path");
const user = require("./module/user");
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://codeyogiai:marriage@marriage.eqyb7uf.mongodb.net/?retryWrites=true&w=majority&appName=marriage"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  });

app
  .get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
  })

  .get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "register.html"));
  });

// Route to handle form submission
app.get("/registerme", async (req, res) => {
  try {
    const saveuser = new user({
      boy: {
        name: req.body.name1,
        fatherName: req.body.fatherName1,
        motherName: req.body.motherName1,
        mobile: req.body.mobile1,
        whatsapp: req.body.whatsapp1,
        aadhar: req.body.aadhar1,
        caste: req.body.cast1,
        age: req.body.age1,
      },
      girl: {
        name: req.body.name2,
        fatherName: req.body.fatherName2,
        motherName: req.body.motherName2,
        mobile: req.body.mobile2,
        whatsapp: req.body.whatsapp2,
        aadhar: req.body.adhar2,
        caste: req.body.cast2,
        age: req.body.age2,
      },
    });

    await saveuser.save();

    res.send("Match details saved successfully!");
  } catch (err) {
    res.status(500).send("Error saving match: " + err.message);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
