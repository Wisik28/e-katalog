const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// Helper to delete product image from disk
const deleteFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, '../../uploads', filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Gagal menghapus berkas: ${filePath}`, err.message);
    } else {
      console.log(`Berkas terhapus: ${filePath}`);
    }
  });
};

// GET all products
const getProducts = async (req, res) => {
  const { search, category } = req.query;

  try {
    const query = {};

    if (category && category !== 'Semua') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    
    // Add computed imageUrl
    const formattedProducts = products.map(product => {
      const prod = product.toObject();
      prod.imageUrl = prod.image ? `${req.protocol}://${req.get('host')}/uploads/${prod.image}` : null;
      return prod;
    });

    return res.status(200).json({ success: true, count: formattedProducts.length, data: formattedProducts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mengambil produk' });
  }
};

// GET product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    const prod = product.toObject();
    prod.imageUrl = prod.image ? `${req.protocol}://${req.get('host')}/uploads/${prod.image}` : null;

    return res.status(200).json({ success: true, data: prod });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mengambil detail produk' });
  }
};

// CREATE new product
const createProduct = async (req, res) => {
  try {
    const { name, category, price, stock, description, material, color, sizes } = req.body;

    if (!name || !category || !price) {
      // If a file was uploaded, delete it because validation failed
      if (req.file) {
        deleteFile(req.file.filename);
      }
      return res.status(400).json({ success: false, message: 'Nama, kategori, dan harga harus diisi' });
    }

    let parsedSizes = [];
    if (sizes) {
      if (Array.isArray(sizes)) {
        parsedSizes = sizes;
      } else {
        try {
          parsedSizes = JSON.parse(sizes);
        } catch (e) {
          parsedSizes = sizes.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
    }

    const imageFilename = req.file ? req.file.filename : '';

    const product = await Product.create({
      name,
      category,
      price: Number(price),
      stock: Number(stock || 0),
      description,
      material,
      color,
      sizes: parsedSizes,
      image: imageFilename,
    });

    const prod = product.toObject();
    prod.imageUrl = prod.image ? `${req.protocol}://${req.get('host')}/uploads/${prod.image}` : null;

    return res.status(201).json({ success: true, data: prod });
  } catch (error) {
    console.error(error);
    if (req.file) {
      deleteFile(req.file.filename);
    }
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat membuat produk baru' });
  }
};

// UPDATE product
const updateProduct = async (req, res) => {
  try {
    const { name, category, price, stock, description, material, color, sizes } = req.body;
    
    let product = await Product.findById(req.params.id);

    if (!product) {
      if (req.file) {
        deleteFile(req.file.filename);
      }
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    let parsedSizes = product.sizes;
    if (sizes !== undefined) {
      if (Array.isArray(sizes)) {
        parsedSizes = sizes;
      } else {
        try {
          parsedSizes = JSON.parse(sizes);
        } catch (e) {
          parsedSizes = sizes.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
    }

    const updateData = {
      name: name || product.name,
      category: category || product.category,
      price: price !== undefined ? Number(price) : product.price,
      stock: stock !== undefined ? Number(stock) : product.stock,
      description: description !== undefined ? description : product.description,
      material: material !== undefined ? material : product.material,
      color: color !== undefined ? color : product.color,
      sizes: parsedSizes,
    };

    if (req.file) {
      // Delete old file
      if (product.image) {
        deleteFile(product.image);
      }
      updateData.image = req.file.filename;
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    const prod = product.toObject();
    prod.imageUrl = prod.image ? `${req.protocol}://${req.get('host')}/uploads/${prod.image}` : null;

    return res.status(200).json({ success: true, data: prod });
  } catch (error) {
    console.error(error);
    if (req.file) {
      deleteFile(req.file.filename);
    }
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat memperbarui produk' });
  }
};

// DELETE product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    // Delete image file from storage
    if (product.image) {
      deleteFile(product.image);
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({ success: true, message: 'Produk berhasil dihapus' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menghapus produk' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
