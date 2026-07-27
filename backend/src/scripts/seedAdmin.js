const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const readline = require('readline');
const Admin = require('../models/Admin');
const connectDB = require('../config/db');

const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    })
  );
};

const run = async () => {
  try {
    // 1. Connect database
    await connectDB();

    console.log('\n--- SKRIP SEEDER ADMIN ---');
    
    // 2. Ask email
    let email = '';
    while (!email) {
      email = await askQuestion('Masukkan email admin: ');
      if (!email) {
        console.log('Email tidak boleh kosong!');
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        console.log('Format email tidak valid!');
        email = '';
      }
    }

    // 3. Ask password
    let password = '';
    while (!password) {
      password = await askQuestion('Masukkan password admin: ');
      if (!password) {
        console.log('Password tidak boleh kosong!');
      } else if (password.length < 6) {
        console.log('Password harus minimal 6 karakter!');
        password = '';
      }
    }

    const normalizedEmail = email.toLowerCase();

    // 4. Create or update admin
    let admin = await Admin.findOne({ email: normalizedEmail });
    if (admin) {
      const confirm = await askQuestion(`Admin dengan email "${normalizedEmail}" sudah ada. Apakah Anda ingin mengupdate passwordnya? (y/n): `);
      if (confirm.toLowerCase() === 'y') {
        admin.password = password;
        await admin.save();
        console.log(`\nPassword admin "${normalizedEmail}" berhasil diperbarui!`);
      } else {
        console.log('\nOperasi dibatalkan.');
      }
    } else {
      admin = new Admin({ email: normalizedEmail, password });
      await admin.save();
      console.log(`\nAkun admin "${normalizedEmail}" berhasil dibuat!`);
    }

  } catch (err) {
    console.error('Terjadi kesalahan saat seeding:', err.message);
  } finally {
    await mongoose.connection.close();
    console.log('Koneksi database ditutup. Selesai!\n');
    process.exit(0);
  }
};

run();
