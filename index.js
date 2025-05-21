const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: true }));
const user = require("./module/user");
const mongoose = require("mongoose");

mongoose
  .connect('mongodb+srv://codeyogiai:marriage@marriage.eqyb7uf.mongodb.net/?retryWrites=true&w=majority&appName=marriage')
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
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
  console.log(req.query)
  try {
    const saveuser = new user({
      boy: {
        name: req.query.name1,
        fatherName: req.query.fatherName1,
        motherName: req.query.motherName1,
        mobile: req.query.mobile1,
        whatsapp: req.query.whatsapp1,
        aadhar: req.query.aadhar1,
        caste: req.query.cast1,
        age: req.query.age1,
      },
      girl: {
        name: req.query.name2,
        fatherName: req.query.fatherName2,
        motherName: req.query.motherName2,
        mobile: req.query.mobile2,
        whatsapp: req.query.whatsapp2,
        aadhar: req.query.adhar2,
        caste: req.query.cast2,
        age: req.query.age2,
      },
    });

    await saveuser.save();
    res.send("Match details saved successfully!");
  } catch (err) {
    res.status(500).send("Error saving match: " + err.message);
  }
});

app.get('/advocate', (req, res) => {
  res.sendFile(path.join(__dirname, 'advocate.html'));
})

app.post('/registerad', async (req, res) => {
  try {
    const allUsers = await user.find({});
    let allCards = '';
    
    for(const userData of allUsers) {
      allCards += `
      <div class="match-card">
        <div class="title">Shaadi Match Detail</div>

        <div class="section">
          <h3>Boy's Information</h3>
          <div class="info"><span class="label">Name:</span> ${userData.boy.name}</div>
          <div class="info"><span class="label">Father's Name:</span> ${userData.boy.fatherName}</div>
          <div class="info"><span class="label">Mother's Name:</span> ${userData.boy.motherName}</div>
          <div class="info"><span class="label">Mobile:</span> ${userData.boy.mobile}</div>
          <div class="info"><span class="label">WhatsApp:</span> ${userData.boy.whatsapp}</div>
          <div class="info"><span class="label">Aadhar:</span> ${userData.boy.aadhar}</div>
          <div class="info"><span class="label">Caste:</span> ${userData.boy.caste}</div>
          <div class="info"><span class="label">Age:</span> ${userData.boy.age}</div>
        </div>

        <div class="section">
          <h3>Girl's Information</h3>
          <div class="info"><span class="label">Name:</span> ${userData.girl.name}</div>
          <div class="info"><span class="label">Father's Name:</span> ${userData.girl.fatherName}</div>
          <div class="info"><span class="label">Mother's Name:</span> ${userData.girl.motherName}</div>
          <div class="info"><span class="label">Mobile:</span> ${userData.girl.mobile}</div>
          <div class="info"><span class="label">WhatsApp:</span> ${userData.girl.whatsapp}</div>
          <div class="info"><span class="label">Aadhar:</span> ${userData.girl.aadhar}</div>
          <div class="info"><span class="label">Caste:</span> ${userData.girl.caste}</div>
          <div class="info"><span class="label">Age:</span> ${userData.girl.age}</div>
        </div>
      </div>
      `;
    }

    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Shaadi Match Details</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f4f4;
      padding: 20px;
    }
    .match-card {
      max-width: 700px;
      margin: 20px auto;
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .title {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #4CAF50;
    }
    .section {
      width: 100%;
      margin-bottom: 10px;
      padding: 10px;
      background: #f9f9f9;
      border-radius: 6px;
    }
    .section h3 {
      margin: 0 0 10px;
      color: #333;
      border-bottom: 1px solid #ccc;
      padding-bottom: 5px;
    }
    .info {
      margin: 5px 0;
      font-size: 14px;
    }
    .label {
      font-weight: bold;
      color: #555;
    }
  </style>
</head>
<body>
  ${allCards}
</body>
</html>`);
  } catch (error) {
    res.status(500).send("Error fetching matches: " + error.message);
  }
});
    <div class="title">Shaadi Match Detail</div>

    <div class="section">
      <h3>Boy's Information</h3>
      <div class="info"><span class="label">Name:</span> Rohan Kumar</div>
      <div class="info"><span class="label">Father's Name:</span> Rajesh Kumar</div>
      <div class="info"><span class="label">Mother's Name:</span> Sunita Devi</div>
      <div class="info"><span class="label">Mobile:</span> 9876543210</div>
      <div class="info"><span class="label">WhatsApp:</span> 9876543210</div>
      <div class="info"><span class="label">Aadhar:</span> 123456789012</div>
      <div class="info"><span class="label">Caste:</span> General</div>
      <div class="info"><span class="label">Age:</span> 25</div>
    </div>

    <div class="section">
      <h3>Girl's Information</h3>
      <div class="info"><span class="label">Name:</span> Pooja Sharma</div>
      <div class="info"><span class="label">Father's Name:</span> Ashok Sharma</div>
      <div class="info"><span class="label">Mother's Name:</span> Meena Devi</div>
      <div class="info"><span class="label">Mobile:</span> 9876543211</div>
      <div class="info"><span class="label">WhatsApp:</span> 9876543211</div>
      <div class="info"><span class="label">Aadhar:</span> 123456789013</div>
      <div class="info"><span class="label">Caste:</span> General</div>
      <div class="info"><span class="label">Age:</span> </div>
    </div>
  </div>
`

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Shaadi Match Details</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f4f4;
      padding: 20px;
    }
    .match-card {
      max-width: 700px;
      margin: auto; 
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    .title {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #4CAF50;
    }
    .pair {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      flex-wrap: wrap;
    }
    .section {
      width: 100%;
      margin-bottom: 10px;
      padding: 10px;
      background: #f9f9f9;
      border-radius: 6px;
    }
    .section h3 {
      margin: 0 0 10px;
      color: #333;
      border-bottom: 1px solid #ccc;
      padding-bottom: 5px;
    }
    .info {
      margin: 5px 0;
      font-size: 14px;
    }
    .label {
      font-weight: bold;
      color: #555;
    }
  </style>
</head>
<body>



</body>
</html>`)
  
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
})