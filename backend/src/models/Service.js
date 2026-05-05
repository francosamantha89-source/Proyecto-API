const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del servicio es obligatorio'],
      trim: true
    },
    code: {
      type: String,
      required: [true, 'El codigo es obligatorio'],
      unique: true,
      uppercase: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    area: {
      type: String,
      required: [true, 'El area es obligatoria'],
      trim: true
    },
    cost: {
      type: Number,
      min: [0, 'El costo no puede ser negativo'],
      default: 0
    },
    priority: {
      type: String,
      enum: ['Baja', 'Media', 'Alta'],
      default: 'Media'
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
