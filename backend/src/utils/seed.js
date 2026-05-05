require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Service = require('../models/Service');

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Product.deleteMany();
    await Service.deleteMany();

    await User.create([
      {
        name: 'Administrador StockControl',
        email: 'admin@inventario.com',
        password: '123456',
        role: 'admin',
        active: true
      },
      {
        name: 'Operador Bodega',
        email: 'operador@inventario.com',
        password: '123456',
        role: 'operator',
        active: true
      }
    ]);

    await Product.create([
      {
        name: 'Caja organizadora industrial',
        sku: 'SC-CAJ-001',
        category: 'Almacenamiento',
        quantity: 128,
        minStock: 20,
        price: 45000,
        location: 'Bodega A'
      },
      {
        name: 'Etiqueta RFID',
        sku: 'SC-RFID-024',
        category: 'Identificacion',
        quantity: 24,
        minStock: 30,
        price: 2800,
        location: 'Bodega B'
      },
      {
        name: 'Sensor de inventario',
        sku: 'SC-SEN-003',
        category: 'Tecnologia',
        quantity: 3,
        minStock: 8,
        price: 120000,
        location: 'Rack 3'
      }
    ]);

    await Service.create([
      {
        name: 'Auditoria de inventario',
        code: 'SRV-AUD-001',
        description: 'Revision de existencias, diferencias y alertas operativas.',
        area: 'Inventario',
        cost: 150000,
        priority: 'Alta',
        active: true
      },
      {
        name: 'Mantenimiento de bodega',
        code: 'SRV-MNT-002',
        description: 'Servicio programado para equipos y zonas de almacenamiento.',
        area: 'Operaciones',
        cost: 95000,
        priority: 'Media',
        active: true
      }
    ]);

    console.log('Datos iniciales creados');
    console.log('Usuario demo: admin@inventario.com');
    console.log('Contrasena demo: 123456');
    process.exit(0);
  } catch (error) {
    console.error('Error creando datos iniciales:', error);
    process.exit(1);
  }
};

seedData();
