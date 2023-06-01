const express = require('express');
const router = express.Router()
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
// const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const cors = require('cors');
// const cookieParser = require('cookie-parser');
// Enable CORS for all domains
router.use(cors());

const multer = require('multer');
const path = require('path');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images/'); // Destination folder for storing uploaded images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extname = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extname);
  },
});

const upload = multer({ storage: storage });

router.post('/image', upload.array('image', 5), (req, res) => {
  // The uploaded image files can be accessed via req.files
  // Handle the uploaded files as needed (e.g., save them to a database, process them, etc.)
  console.log('Uploaded images:', req.files);

  // Return a response to the client
  // res.status(200).json({ message: 'Image upload successful' });
  // res.status(200).json(req.files);
  res.status(200).json(req.files);
});

module.exports = router