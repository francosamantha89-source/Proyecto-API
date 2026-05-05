const Product = require('../models/Product');

const listProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ ok: true, total: products.length, products });
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Producto no encontrado');
    }

    res.json({ ok: true, product });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const exists = await Product.findOne({ sku: String(req.body.sku || '').toUpperCase() });
    if (exists) {
      res.status(409);
      throw new Error('El SKU ya existe');
    }

    const product = await Product.create(req.body);
    res.status(201).json({ ok: true, message: 'Producto creado', product });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Producto no encontrado');
    }

    if (req.body.sku && req.body.sku.toUpperCase() !== product.sku) {
      const exists = await Product.findOne({ sku: req.body.sku.toUpperCase() });
      if (exists) {
        res.status(409);
        throw new Error('El SKU ya existe');
      }
    }

    const allowedFields = ['name', 'sku', 'category', 'quantity', 'minStock', 'price', 'location'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });

    await product.save();
    res.json({ ok: true, message: 'Producto actualizado', product });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Producto no encontrado');
    }

    await product.deleteOne();
    res.json({ ok: true, message: 'Producto eliminado' });
  } catch (error) {
    next(error);
  }
};

const productStats = async (req, res, next) => {
  try {
    const [totalProducts, lowStock, outOfStock] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: 'Bajo stock' }),
      Product.countDocuments({ status: 'Agotado' })
    ]);

    res.json({
      ok: true,
      stats: {
        totalProducts,
        lowStock,
        outOfStock
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productStats
};
