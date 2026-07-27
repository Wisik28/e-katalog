const express = require('express');
const router = express.Router();
const { login, register, getProfile, updateProfile, getContact } = require('../controllers/authController');
const protect = require('../middlewares/authMiddleware');

// routing mengirim data authentikasi
router.post('/login', login);
router.post('/register', register);

// public contact route for customers
router.get('/contact', getContact);

// routing mengambil dan merubah data profile (detail data admin)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
