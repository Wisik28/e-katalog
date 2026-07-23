const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const protect = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, upload.array('image', 10), createProduct);
router.put('/:id', protect, upload.array('image', 10), updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
