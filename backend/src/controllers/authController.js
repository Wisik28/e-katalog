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
          name: admin.name,
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
// disable agar email dan password login diambil dari database bukan dari .env
// const seedAdmin = async () => {
//   try {
//     const envEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_API_USERNAME;
//     const password = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_API_PASSWORD;

//     if (!envEmail || !password) {
//       // Skip seeding if env credentials are not provided
//       return;
//     }

//     const normalizedEmail = envEmail.toLowerCase();
//     const admin = await Admin.findOne({ email: normalizedEmail });
//     if (!admin) {
//       await Admin.create({
//         email: normalizedEmail,
//         password,
//       });
//       console.log(`Admin account seeded: ${normalizedEmail}`);
//     } else {
//       // Update password if changed in .env
//       admin.password = password;
//       await admin.save();
//     }
//   } catch (error) {
//     console.error('Error seeding admin accounts:', error.message);
//   }
// };


// Register admin
const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email dan password harus diisi' });
    }

    const normalizedEmail = email.toLowerCase();
    const existingAdmin = await Admin.findOne({ email: normalizedEmail });

    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
    }

    const newAdmin = await Admin.create({
      email: normalizedEmail,
      password,
    });

    return res.status(201).json({
      success: true,
      message: 'Admin berhasil didaftarkan',
      data: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

// Get current admin profile details
// GET /api/auth/profile
// untuk melakukan request ke database agar memberi data admin
const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin tidak ditemukan' });
    }
    return res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name || 'Admin',
        email: admin.email,
        phone: admin.phone || '',
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

// Update admin profile details
const updateProfile = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin tidak ditemukan' });
    }

    if (email && email.toLowerCase() !== admin.email) {
      const emailExists = await Admin.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email sudah digunakan oleh admin lain' });
      }
      admin.email = email.toLowerCase();
    }

    if (name) {
      admin.name = name;
    }

    if (phone !== undefined) {
      admin.phone = phone;
    }

    if (password && password !== '••••••••' && password.trim() !== '') {
      admin.password = password;
    }

    await admin.save();

    return res.status(200).json({
      success: true,
      message: 'Profil admin berhasil diperbarui',
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone || '',
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

// Get public contact details of the admin (unprotected)
const getContact = async (req, res) => {
  try {
    const admin = await Admin.findOne().select('name email phone');
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin tidak ditemukan' });
    }
    return res.status(200).json({
      success: true,
      data: {
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
};

module.exports = {
  login,
  register,
  getProfile,
  updateProfile,
  getContact,
};
