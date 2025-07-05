const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const advocate = require("./module/advocate");

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: true }));
const user = require("./module/user");
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://codeyogiai:marriage@marriage.eqyb7uf.mongodb.net/?retryWrites=true&w=majority&appName=marriage",
    {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
    },
  )
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
    const { district, caste } = req.query;
    let html = require('fs').readFileSync(path.join(__dirname, "register.html"), 'utf8');
    
    if (district) {
      html = html.replace('name="district"', `name="district" value="${district}"`);
    }
    if (caste) {
      html = html.replace('name="selectedCaste"', `name="selectedCaste" value="${caste}"`);
    }
    
    res.send(html);
  });

app.get("/registerme", async (req, res) => {
  try {
    // Handle district field in case it comes as an array
    const district = Array.isArray(req.query.district) ? req.query.district[0] : req.query.district;
    const selectedCaste = Array.isArray(req.query.selectedCaste) ? req.query.selectedCaste[0] : req.query.selectedCaste;
    
    const saveuser = new user({
      district: district,
      selectedCaste: selectedCaste,
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
        aadhar: req.query.aadhar2,
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

app.get("/advocate", (req, res) => {
  res.sendFile(path.join(__dirname, "advocate.html"));
});

app.delete("/delete-match/:id", async (req, res) => {
  try {
    const matchId = req.params.id;
    await user.findByIdAndDelete(matchId);
    res.json({ success: true, message: 'Match deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/registerad", async (req, res) => {
  try {
    const { name, district, phone, courtAddress, password } = req.body;

    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log("MongoDB connection state:", mongoose.connection.readyState);
      await mongoose.connect(
        "mongodb+srv://codeyogiai:marriage@marriage.eqyb7uf.mongodb.net/?retryWrites=true&w=majority&appName=marriage",
      );
    }

    // First check if advocate exists with name and password
    let alladvocate = await advocate
      .findOne({ name, password })
      .maxTimeMS(5000);

    // Filter users by advocate's district
    const allUsers = await user.find({ district: district }).maxTimeMS(5000);
    let allCards = "";
    if (allUsers.length === 0) {
      return res.send("No matches found for your district.");
    }
    console.log(allUsers[0]);

    for (const userData of allUsers) {
      const hasOtherCaste = userData.selectedCaste === "Other Caste";
      const starIcon = hasOtherCaste
        ? '<div class="star-icon">⭐⭐⭐</div>'
        : "";

      allCards += `
      <div class="match-card" id="match-${userData._id}">
        ${starIcon}
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
        
        <div class="section">
          <h3>District Information</h3>
          <div class="info"><span class="label">District:</span> ${userData.district}</div>
        </div>
        
        <div class="delete-icon" onclick="deleteMatch('${userData._id}')">🗑️</div>
      </div>`;
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Shaadi Match Details</title>
  
    <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: lightgray;
      padding: 0;
      margin: 0;
    }
    .main-content {
      padding: 20px;
    }
    .match-card {
      max-width: 700px;
      margin: 20px auto;
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      position: relative;
    }
    .star-icon {
      position: absolute;
      top: 10px;
      right: 15px;
      font-size: 16px;
      color: #FFD700;
    }
    .delete-icon {
      position: absolute;
      bottom: 15px;
      right: 15px;
      font-size: 20px;
      cursor: pointer;
      color: #ff4444;
      background: white;
      border: 2px solid #ff4444;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }
    .delete-icon:hover {
      background: #ff4444;
      color: white;
      transform: scale(1.1);
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
  <header class="w-full bg-red-600 shadow-lg">
    <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
      <a class="text-white text-xl font-semibold hover:text-red-200 transition-colors" href="/">Home</a>
      <a class="text-white text-xl font-semibold hover:text-red-200 transition-colors" href="/advocate">Advocate</a>
    </nav>
  </header>
  
  <div class="main-content">
    ${allCards}
  </div>
  
  <script>
    function deleteMatch(matchId) {
      if (confirm('Are you sure you want to delete this match?')) {
        fetch('/delete-match/' + matchId, {
          method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            document.getElementById('match-' + matchId).remove();
            alert('Match deleted successfully!');
          } else {
            alert('Error deleting match: ' + data.message);
          }
        })
        .catch(error => {
          alert('Error: ' + error.message);
        });
      }
    }
  </script>
</body>
</html>`;

    res.send(html);
  } catch (error) {
    res.status(500).send("Error fetching matches: " + error.message);
  }
});

async function newad(name, password) {
  const newadvocate = new advocate({
    name: name,
    password: password,
  });
  await newadvocate.save();
}

// Create a test advocate account

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
