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

app.post("/registerme", async (req, res) => {
  try {
    // Handle district field in case it comes as an array
    const district = Array.isArray(req.body.district) ? req.body.district[0] : req.body.district;
    const selectedCaste = Array.isArray(req.body.selectedCaste) ? req.body.selectedCaste[0] : req.body.selectedCaste;
    
    const saveuser = new user({
      district: district,
      selectedCaste: selectedCaste,
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
        aadhar: req.body.aadhar2,
        caste: req.body.cast2,
        age: req.body.age2,
      },
    });

    await saveuser.save();
    
    // Success page with attractive UI
    const successHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registration Successful</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-30px); }
          60% { transform: translateY(-15px); }
        }
        .bounce { animation: bounce 2s infinite; }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .fade-in { animation: fadeIn 0.8s ease-out; }
      </style>
    </head>
    <body class="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
      <div class="max-w-md mx-auto p-8">
        <div class="bg-white rounded-2xl shadow-2xl p-8 text-center fade-in">
          <div class="bounce text-6xl mb-6">🎉</div>
          <h1 class="text-3xl font-bold text-green-600 mb-4">Registration Successful!</h1>
          <p class="text-gray-600 mb-6">आपका विवाह का विवरण सफलतापूर्वक सेव हो गया है!</p>
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p class="text-green-800 font-semibold">✅ Match details saved successfully</p>
          </div>
          <a href="/" class="inline-block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
            Go Back to Home
          </a>
        </div>
      </div>
    </body>
    </html>`;
    
    res.send(successHtml);
  } catch (err) {
    
    // Error page with attractive UI
    const errorHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registration Error</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        .shake { animation: shake 0.5s ease-in-out; }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .fade-in { animation: fadeIn 0.8s ease-out; }
      </style>
    </head>
    <body class="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
      <div class="max-w-md mx-auto p-8">
        <div class="bg-white rounded-2xl shadow-2xl p-8 text-center fade-in">
          <div class="shake text-6xl mb-6">❌</div>
          <h1 class="text-3xl font-bold text-red-600 mb-4">Registration Failed!</h1>
          <p class="text-gray-600 mb-6">रजिस्ट्रेशन में कोई समस्या आई है</p>
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p class="text-red-800 font-semibold">⚠️ Error: ${err.message}</p>
          </div>
          <div class="space-y-3">
            <a href="/register" class="block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
              Try Again
            </a>
            <a href="/" class="block bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
              Go Back to Home
            </a>
          </div>
        </div>
      </div>
    </body>
    </html>`;
    
    res.status(500).send(errorHtml);
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
      const noMatchHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>No Matches Found</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
        <header class="w-full bg-red-600 shadow-lg">
          <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
            <a class="text-white text-xl font-semibold hover:text-red-200 transition-colors" href="/">Home</a>
            <a class="text-white text-xl font-semibold hover:text-red-200 transition-colors" href="/advocate">Advocate</a>
          </nav>
        </header>
        <div class="flex items-center justify-center min-h-screen">
          <div class="max-w-md mx-auto p-8">
            <div class="bg-white rounded-2xl shadow-2xl p-8 text-center">
              <div class="text-6xl mb-6">🔍</div>
              <h1 class="text-3xl font-bold text-orange-600 mb-4">No Matches Found</h1>
              <p class="text-gray-600 mb-6">आपके जिले में कोई मैच नहीं मिला</p>
              <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <p class="text-orange-800 font-semibold">📍 District: ${district}</p>
              </div>
              <a href="/advocate" class="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                Try Another District
              </a>
            </div>
          </div>
        </div>
      </body>
      </html>`;
      return res.send(noMatchHtml);
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
