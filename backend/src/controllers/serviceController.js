const Service = require('../models/Service');

const listServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json({ ok: true, total: services.length, services });
  } catch (error) {
    next(error);
  }
};

const getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404);
      throw new Error('Servicio no encontrado');
    }

    res.json({ ok: true, service });
  } catch (error) {
    next(error);
  }
};

const createService = async (req, res, next) => {
  try {
    const exists = await Service.findOne({ code: String(req.body.code || '').toUpperCase() });
    if (exists) {
      res.status(409);
      throw new Error('El codigo ya existe');
    }

    const service = await Service.create(req.body);
    res.status(201).json({ ok: true, message: 'Servicio creado', service });
  } catch (error) {
    next(error);
  }
};

const updateService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404);
      throw new Error('Servicio no encontrado');
    }

    if (req.body.code && req.body.code.toUpperCase() !== service.code) {
      const exists = await Service.findOne({ code: req.body.code.toUpperCase() });
      if (exists) {
        res.status(409);
        throw new Error('El codigo ya existe');
      }
    }

    const allowedFields = ['name', 'code', 'description', 'area', 'cost', 'priority', 'active'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) service[field] = req.body[field];
    });

    await service.save();
    res.json({ ok: true, message: 'Servicio actualizado', service });
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404);
      throw new Error('Servicio no encontrado');
    }

    await service.deleteOne();
    res.json({ ok: true, message: 'Servicio eliminado' });
  } catch (error) {
    next(error);
  }
};

module.exports = { listServices, getService, createService, updateService, deleteService };
