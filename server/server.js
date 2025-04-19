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




app.post('/upload-pdf', isloggedin, upload.single('pdf'), async (req, res) => {
  try {
    // Extract user data and filename
    const { _id, firstName } = req.user;
    const originalName = path.parse(req.file.originalname).name; // remove extension if needed

    const folderName = `${_id}_${firstName}`;
    const fileName = originalName; // Or modify this if you want a custom logic

    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw',
            folder: folderName,
            public_id: fileName, // This is the Cloudinary file name without extension
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req);

    res.json({
      message: 'PDF uploaded successfully',
      url: result.secure_url,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});



app.listen(5000,()=>{
    console.log('connected to 5000')
});