require('dotenv').config()
const cors = require('cors');
require('./connection/connection')
const express=require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const fs = require('fs');
const os = require('os');
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
    timeout: 120000,
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
        const { firstName, lastName, aadhar,platform, pan, phone, address } = req.body.formData;
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
            platform,
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




// Document Proxy Endpoint to stream PDFs safely from Cloudinary
const https = require('https');
const http = require('http');

app.get('/view-document', (req, res) => {
  const targetUrl = req.query.url;
  const isDownload = req.query.download === 'true';

  if (!targetUrl) {
    return res.status(400).send('Document URL is required');
  }

  const fetchDocument = (urlToFetch, hasRetried = false) => {
    const client = urlToFetch.startsWith('https') ? https : http;

    client.get(urlToFetch, (cloudinaryRes) => {
      // Follow redirects if any
      if (cloudinaryRes.statusCode >= 300 && cloudinaryRes.statusCode < 400 && cloudinaryRes.headers.location) {
        return fetchDocument(cloudinaryRes.headers.location, hasRetried);
      }

      if (cloudinaryRes.statusCode !== 200) {
        console.error(`Cloudinary returned status ${cloudinaryRes.statusCode} for URL: ${urlToFetch}`);

        // Smart fallback: If /raw/upload/ fails with 404, try /image/upload/ (or vice-versa)
        if (cloudinaryRes.statusCode === 404 && !hasRetried) {
          let fallbackUrl = null;
          if (urlToFetch.includes('/raw/upload/')) {
            fallbackUrl = urlToFetch.replace('/raw/upload/', '/image/upload/').replace(/\.pdf$/i, '');
          } else if (urlToFetch.includes('/image/upload/')) {
            fallbackUrl = urlToFetch.replace('/image/upload/', '/raw/upload/');
            if (!fallbackUrl.endsWith('.pdf')) fallbackUrl += '.pdf';
          }

          if (fallbackUrl) {
            console.log(`Retrying with fallback URL: ${fallbackUrl}`);
            return fetchDocument(fallbackUrl, true);
          }
        }

        return res.status(cloudinaryRes.statusCode).send(`Failed to fetch document from Cloudinary (HTTP ${cloudinaryRes.statusCode})`);
      }

      res.setHeader('Content-Type', cloudinaryRes.headers['content-type'] || 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        isDownload ? 'attachment; filename="document.pdf"' : 'inline; filename="document.pdf"'
      );

      cloudinaryRes.pipe(res);
    }).on('error', (err) => {
      console.error('Error proxying document:', err);
      res.status(500).send('Error streaming document');
    });
  };

  fetchDocument(targetUrl);
});

app.post('/upload-pdf', upload.fields([
  { name: 'dueCertificates', maxCount: 1 },
  { name: 'ratingsImage', maxCount: 1 },
  { name: 'joiningCertificate', maxCount: 1 },
  { name: 'weeklyWorkHoursPdf', maxCount: 1 },
  { name: 'bankStatement', maxCount: 1 }
]), isloggedin, async (req, res) => {
  try {
    const { _id, firstName } = req.user;
    const folderName = `${_id}_${firstName}`;
    const files = req.files;
    
    // Validate files exist
    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Process all files in parallel - use resource_type 'auto' for everything
    // PDFs get stored under /image/upload/ which lets us render pages as images
    const uploadEntries = Object.entries(files);
    const uploadPromises = uploadEntries.map(async ([fieldName, fileArray]) => {
      const file = fileArray[0];
      const originalName = path.parse(file.originalname).name
        .trim()
        .replace(/[^a-zA-Z0-9-_]/g, '_')
        .replace(/\s+/g, '_');

      const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: isPdf ? 'raw' : 'auto',
            folder: folderName,
            public_id: isPdf ? `${originalName}_${Date.now()}.pdf` : `${originalName}_${Date.now()}`,
            overwrite: true,
            invalidate: true,
            timeout: 120000,
          },
          (error, res) => error ? reject(error) : resolve(res)
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });

      return [fieldName, result.secure_url];
    });

    const resultsArray = await Promise.all(uploadPromises);
    const uploadResults = Object.fromEntries(resultsArray);

    res.json({
      message: 'All files uploaded successfully',
      urls: uploadResults
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed: ' + (error.message || 'Unknown error') });
  }
});

app.post('/submitdetails', isloggedin, async (req, res) => {
  try {
    const { monthlyIncome, dues, rating, duration, hours, documents } = req.body;

    // Validate required fields (checking for undefined/null instead of falsy to allow 0 values)
    if (
      monthlyIncome === undefined || monthlyIncome === null ||
      !Array.isArray(dues) ||
      rating === undefined || rating === null ||
      duration === undefined || duration === null ||
      hours === undefined || hours === null
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newEntry = new Detail({
      monthlyIncome,
      dues,
      rating,
      duration,
      hours,
      documents,
      user: req.user._id
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
    console.error("Error saving financial details:", error);
    res.status(400).json({ message: error.message || "Invalid data format" });
  }
});

app.get("/getdetails", isloggedin, async (req, res) => {
  try {
    // 1. Get user's latest financial details
    const latestDetails = await Detail.findOne({ user: req.user._id })
      .sort({ dateToday: -1 })
      .lean();



    if (!latestDetails) {
      return res.status(404).json({ error: "No financial details found" });
    }

    // 2. Get user's basic info
    const userData = await User.findById(req.user._id)
      .select('firstName lastName email platform mobileNo')
      .lean();

    const latestStatus = latestDetails.verified || 'pending';

    // Only build predictionData if the latest submission has been ACCEPTED by Admin
    let predictionData = null;
    let activeDetailsFormatted = null;

    if (latestStatus === 'accepted') {
      const totalDues = Array.isArray(latestDetails.dues)
        ? latestDetails.dues.reduce((sum, due) => sum + (due.amount || 0), 0)
        : 0;
      const income = latestDetails.monthlyIncome || 0;
      const costToIncome = income > 0 ? Number((totalDues / income).toFixed(2)) : 0;

      predictionData = {
        platform: userData.platform,
        income: income,
        dues: totalDues,
        cost_to_income: costToIncome,
        platform_rating: latestDetails.rating,
        SIZE: latestDetails.duration,
        work_hours_per_week: latestDetails.hours
      };

      activeDetailsFormatted = {
        income: latestDetails.monthlyIncome,
        duration: latestDetails.duration,
        hours: latestDetails.hours,
        rating: latestDetails.rating,
        dues: (latestDetails.dues || []).map(due => ({
          title: due.title,
          amount: due.amount,
          dueDate: due.dueDate,
          organization: due.organization,
          status: due.isLate ? `Late (${due.daysLate} days)` : 'On time'
        }))
      };
    }

    res.status(200).json({
      userInfo: {
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        platform: userData.platform,
        phone: userData.mobileNo
      },
      latestStatus: latestStatus,
      adminRemark: latestDetails.adminRemark || '',
      financialDetails: {
        verificationStatus: latestStatus,
        adminRemark: latestDetails.adminRemark || '',
        income: latestDetails.monthlyIncome,
        duration: latestDetails.duration,
        hours: latestDetails.hours,
        rating: latestDetails.rating
      },
      dues: (latestDetails.dues || []).map(due => ({
        title: due.title,
        amount: due.amount,
        dueDate: due.dueDate,
        organization: due.organization,
        status: due.isLate ? `Late (${due.daysLate} days)` : 'On time'
      })),
      activeDetails: activeDetailsFormatted,
      predictionData: predictionData
    });

  } catch (error) {
    console.error('Error fetching details:', error);
    res.status(500).json({ error: 'Server error while fetching details' });
  }
});

// ================= ADMIN ENDPOINTS =================

// 1. Admin Login / Password Verification (Supports 4 Admins from .env)
app.post('/verifypassword', (req, res) => {
  const { adminId, password } = req.body;

  if (!adminId || !password) {
    return res.status(400).json({ success: false, message: 'Admin ID and Password are required' });
  }

  // Load 4 Admin credentials from .env
  const validAdmins = [
    { id: process.env.ADMIN_1_ID, pass: process.env.ADMIN_1_PASS },
    { id: process.env.ADMIN_2_ID, pass: process.env.ADMIN_2_PASS },
    { id: process.env.ADMIN_3_ID, pass: process.env.ADMIN_3_PASS },
    { id: process.env.ADMIN_4_ID, pass: process.env.ADMIN_4_PASS },
  ];

  const inputId = String(adminId).trim();
  const inputPass = String(password).trim();

  // Find if any admin pair matches both ID and password
  const matchedAdmin = validAdmins.find(
    admin => admin.id && admin.pass && admin.id === inputId && admin.pass === inputPass
  );

  if (matchedAdmin) {
    return res.status(200).json({ success: true, message: 'Admin authenticated successfully' });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid Admin ID or Password' });
  }
});

// 2. Admin Get All Verification Requests with Proof Documents
app.get('/admin/requests', async (req, res) => {
  try {
    const requests = await Detail.find()
      .populate('user', 'firstName lastName email platform mobileNo aadhar')
      .sort({ dateToday: -1 })
      .lean();

    const formattedRequests = requests.map(reqItem => ({
      _id: reqItem._id,
      user: reqItem.user ? {
        name: `${reqItem.user.firstName} ${reqItem.user.lastName}`,
        email: reqItem.user.email,
        platform: reqItem.user.platform,
        phone: reqItem.user.mobileNo,
        aadhar: reqItem.user.aadhar ? String(reqItem.user.aadhar) : 'N/A'
      } : { name: 'Unknown User', email: 'N/A', platform: 'N/A', phone: 'N/A', aadhar: 'N/A' },
      monthlyIncome: reqItem.monthlyIncome,
      duration: reqItem.duration,
      hours: reqItem.hours,
      rating: reqItem.rating,
      dues: reqItem.dues || [],
      documents: reqItem.documents || {},
      status: reqItem.verified || 'pending',
      adminRemark: reqItem.adminRemark || '',
      dateToday: reqItem.dateToday
    }));

    res.status(200).json({ requests: formattedRequests });
  } catch (error) {
    console.error('Admin requests error:', error);
    res.status(500).json({ error: 'Failed to fetch verification requests' });
  }
});

// 3. Admin Accept/Reject Applicant with Remarks
app.put('/admin/verify/:detailId', async (req, res) => {
  try {
    const { detailId } = req.params;
    const { status, remark } = req.body; // status: 'accepted' or 'rejected'

    if (!['accepted', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status provided' });
    }

    const updatedDetail = await Detail.findByIdAndUpdate(
      detailId,
      {
        verified: status,
        adminRemark: remark || ''
      },
      { new: true }
    );

    if (!updatedDetail) {
      return res.status(404).json({ error: 'Submission record not found' });
    }

    res.status(200).json({ success: true, message: `Applicant ${status} successfully`, detail: updatedDetail });
  } catch (error) {
    console.error('Error updating verification status:', error);
    res.status(500).json({ error: 'Server error while updating status' });
  }
});

app.listen(5000,()=>{
    console.log('connected to 5000')
});