const mongoose = require('mongoose');

const calculateStatus = (quantity, minStock) => {
  if (quantity <= 0) return 'Agotado';
  if (quantity <= minStock) return 'Bajo stock';
  return 'Disponible';
};

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true
    },
    sku: {
      type: String,
      required: [true, 'El SKU es obligatorio'],
      unique: true,
      uppercase: true,
      trim: true
    },
    category: {
      type: String,
      required: [true, 'La categoria es obligatoria'],
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, 'La cantidad es obligatoria'],
      min: [0, 'La cantidad no puede ser negativa'],
      default: 0
    },
    minStock: {
      type: Number,
      min: [0, 'El stock minimo no puede ser negativo'],
      default: 5
    },
    price: {
      type: Number,
      min: [0, 'El precio no puede ser negativo'],
      default: 0
    },
    location: {
      type: String,
      trim: true,
      default: 'Bodega principal'
    },
    status: {
      type: String,
      enum: ['Disponible', 'Bajo stock', 'Agotado'],
      default: 'Disponible'
    }
  },
  { timestamps: true }
);

productSchema.pre('validate', function updateStatus(next) {
  this.status = calculateStatus(this.quantity, this.minStock);
  next();
});

module.exports = mongoose.model('Product', productSchema);
