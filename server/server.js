require('dotenv').config()
const cors = require('cors');
require('./connection/connection')
const express=require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const cooki_parser=require('cookie-parser');
const User=require('./models/user');
const {gentoken}=require('./jsonwebtoken/jwt');
const path = require('path');
const {isloggedin}=require('./middleware/isloogedin')
const Detail=require('./models/details')
const app=express();
app.use(express.urlencoded({extended:true}))
app.use(cooki_parser());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });


app.use(cors({
    origin: 'http://localhost:3000', // must match your frontend dev server
    credentials: true // allow cookies to be sent
  }));

app.get('/isregistered', async (req, res) => {
    try {
        const { email } = req.query;
        

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ registered: false });
        }

        const token = gentoken(user);
        return res.status(200).cookie('token', token).json({ registered: true });
    } 
    catch (err) {
        console.error('Server error in /isregistered:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('token');

    res.status(200).json({ message: 'Logged out' });
});

app.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, aadhar, pan, phone, address } = req.body.formData;
        const email = req.body.email;

        // Corrected queries
        const user = await User.findOne({ email }) 
                  || await User.findOne({ aadhar }) 
                  || await User.findOne({ PAN: pan });

                  if (user) {
                    return res.status(409).json({ message: "User already exists. Please check the details." });
                  }

        const myuser = await User.create({
            firstName,
            lastName,
            aadhar,
            PAN: pan,
            mobileNo: phone,
            address,
            email
        });

        const token = gentoken(myuser);  // Make sure jwt() is defined and valid
        return res.status(200).cookie('token', token).json({ message: 'User created successfully' });
    } catch (err) {
        console.error('Error in /signup:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.post('/upload-pdf', upload.fields([
  { name: 'dueCertificates', maxCount: 1 },
  { name: 'ratingsImage', maxCount: 1 },
  { name: 'joiningCertificate', maxCount: 1 },
  { name: 'weeklyWorkHoursPdf', maxCount: 1 },
  { name: 'bankStatement', maxCount: 1 }
]), isloggedin
,async (req, res) => {
  try {
    const { _id, firstName } = req.user;
    const folderName = `${_id}_${firstName}`;
    const files = req.files;
    
    // Validate files exist
    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Process all files
    const uploadResults = {};
    for (const [fieldName, fileArray] of Object.entries(files)) {
      const file = fileArray[0];
      const originalName = path.parse(file.originalname).name
  .trim()
  .replace(/[^a-zA-Z0-9-_]/g, '_') // Replace special chars with underscores
  .replace(/\s+/g, '_'); // Replace spaces with underscores
      
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: folderName,
            public_id: originalName,
          },
          (error, result) => error ? reject(error) : resolve(result)
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });

      uploadResults[fieldName] = result.secure_url;
    }

    res.json({
      message: 'All files uploaded successfully',
      urls: uploadResults
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

app.post('/submitdetails', isloggedin, async (req, res) => {
  try {
    const { monthlyIncome, dues, rating, duration, hours, documents } = req.body;

    // Validate required fields
    if (!monthlyIncome || !dues || !rating || !duration || !hours) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newEntry = new Detail({
      monthlyIncome,
      dues,
      rating,
      duration,
      hours,
      documents,
      user: req.user._id // Assuming authenticated user
    });

    await newEntry.save();

    // Add the detail reference to the user
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { details: newEntry._id } },
      { new: true }
    );

    res.status(201).json({ message: "Data saved successfully" });

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid data format" });
  }
});




app.listen(5000,()=>{
    console.log('connected to 5000')
});