const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

// Login admin
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email dan password harus diisi' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (admin && (await admin.comparePassword(password))) {
      return res.status(200).json({
        success: true,
        data: {
          id: admin._id,
          email: admin.email,
          token: generateToken(admin._id),
        },
      });
    } else {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

// Seed default admin accounts from .env
const seedAdmin = async () => {
  try {
    const envEmail = process.env.NEXT_PUBLIC_API_USERNAME;
    const password = process.env.NEXT_PUBLIC_API_PASSWORD;

    if (!envEmail || !password) {
      // Skip seeding if env credentials are not provided
      return;
    }

    const normalizedEmail = envEmail.toLowerCase();
    const adminExists = await Admin.findOne({ email: normalizedEmail });
    if (!adminExists) {
      await Admin.create({
        email: normalizedEmail,
        password,
      });
      console.log(`Admin account seeded: ${normalizedEmail}`);
    }
  } catch (error) {
    console.error('Error seeding admin accounts:', error.message);
  }
};

module.exports = {
  login,
  seedAdmin,
};
