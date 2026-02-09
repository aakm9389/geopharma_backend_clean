import express from 'express';
import City from '../models/City.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/admin.middleware.js';

const router = express.Router();

// PUBLIC — liste des villes
router.get('/', async (req, res) => {
  const cities = await City.find().sort({ name: 1 });
  res.json(cities);
});

// ADMIN — ajout ville
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const city = await City.create({ name: req.body.name });
  res.status(201).json(city);
});

export default router;
