const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');

// Helper to delete product image from disk (local temp cleanup)
const deleteFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, '../../uploads', filename);
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Gagal menghapus berkas: ${filePath}`, err.message);
      } else {
        console.log(`Berkas terhapus: ${filePath}`);
      }
    });
  }
};

// Helper to extract Cloudinary public ID from URL
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  // URL format: https://res.cloudinary.com/cloud_name/image/upload/v12345678/folder/public_id.ext
  const parts = url.split('/upload/');
  if (parts.length < 2) return null;
  
  const pathParts = parts[1].split('/');
  // Remove version tag (usually starts with 'v' followed by digits)
  if (pathParts[0].startsWith('v')) {
    pathParts.shift();
  }
  
  const fileWithExt = pathParts.join('/');
  const lastDotIndex = fileWithExt.lastIndexOf('.');
  if (lastDotIndex === -1) return fileWithExt;
  return fileWithExt.substring(0, lastDotIndex);
};

// Helper to delete product image (supports both local storage and Cloudinary)
const deleteProductImage = async (image) => {
  if (!image) return;
  const list = Array.isArray(image) ? image : [image];
  for (const img of list) {
    if (img.startsWith('http://') || img.startsWith('https://')) {
      const publicId = getPublicIdFromUrl(img);
      if (publicId) {
        try {
          const result = await cloudinary.uploader.destroy(publicId);
          console.log(`Cloudinary image deleted: ${publicId}`, result);
        } catch (err) {
          console.error(`Gagal menghapus gambar Cloudinary: ${publicId}`, err.message);
        }
      }
    } else {
      // Local file fallback
      const filePath = path.join(__dirname, '../../uploads', img);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Gagal menghapus berkas lokal: ${filePath}`, err.message);
          } else {
            console.log(`Berkas lokal terhapus: ${filePath}`);
          }
        });
      }
    }
  }
};

// Helper to get full image URL (handles both Cloudinary URL and local path)
const getImageUrl = (image, req) => {
  if (!image) return null;
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  return `${req.protocol}://${req.get('host')}/uploads/${image}`;
};

// Helper to get array of all full image URLs
const getImageUrls = (image, req) => {
  if (!image) return [];
  const list = Array.isArray(image) ? image : [image];
  return list.map(img => getImageUrl(img, req)).filter(Boolean);
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
      prod.imageUrls = getImageUrls(prod.image, req);
      prod.imageUrl = prod.imageUrls[0] || null;
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
    prod.imageUrls = getImageUrls(prod.image, req);
    prod.imageUrl = prod.imageUrls[0] || null;

    return res.status(200).json({ success: true, data: prod });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mengambil detail produk' });
  }
};

// CREATE new product
const createProduct = async (req, res) => {
  try {
    const { name, category, price, stock, description, material, color, sizes, discount } = req.body;

    if (!name || !category || !price) {
      // If files were uploaded, delete them because validation failed
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => deleteFile(file.filename));
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

    // semacam handler untuk menangani upload ke cloudinary
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'e-katalog',
          });
          imageUrls.push(result.secure_url);
          // Clean up local temp file
          deleteFile(file.filename);
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          deleteFile(file.filename);
        }
      }
    }

    const product = await Product.create({
      name,
      category,
      price: Number(price),
      stock: Number(stock || 0),
      discount: Number(discount || 0),
      description,
      material,
      color,
      sizes: parsedSizes,
      image: imageUrls,
    });

    const prod = product.toObject();
    prod.imageUrls = getImageUrls(prod.image, req);
    prod.imageUrl = prod.imageUrls[0] || null;

    return res.status(201).json({ success: true, data: prod });
  } catch (error) {
    console.error(error);
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => deleteFile(file.filename));
    }
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan saat membuat produk baru' });
  }
};

// UPDATE product
const updateProduct = async (req, res) => {
  try {
    const { name, category, price, stock, description, material, color, sizes, discount } = req.body;
    
    let product = await Product.findById(req.params.id);

    if (!product) {
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => deleteFile(file.filename));
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
      discount: discount !== undefined ? Number(discount) : product.discount,
      description: description !== undefined ? description : product.description,
      material: material !== undefined ? material : product.material,
      color: color !== undefined ? color : product.color,
      sizes: parsedSizes,
    };

    if (req.files && req.files.length > 0) {
      try {
        const imageUrls = [];
        for (const file of req.files) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'e-katalog',
          });
          imageUrls.push(result.secure_url);
          deleteFile(file.filename);
        }
        
        // Delete old image(s)
        if (product.image) {
          await deleteProductImage(product.image);
        }

        updateData.image = imageUrls;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        if (req.files && req.files.length > 0) {
          req.files.forEach(file => deleteFile(file.filename));
        }
        return res.status(500).json({ success: false, message: 'Gagal mengunggah gambar baru ke Cloudinary' });
      }
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    const prod = product.toObject();
    prod.imageUrls = getImageUrls(prod.image, req);
    prod.imageUrl = prod.imageUrls[0] || null;

    return res.status(200).json({ success: true, data: prod });
  } catch (error) {
    console.error(error);
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => deleteFile(file.filename));
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

    // Delete image file from storage (Cloudinary or local)
    if (product.image) {
      await deleteProductImage(product.image);
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
