// backend/src/controllers/specialty.controller.js
import Specialty from '../models/Specialty.js'; // Crée le modèle si nécessaire

export const getAllSpecialties = async (req, res) => {
  try {
    const specialties = await Specialty.find();
    res.json(specialties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createSpecialty = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Nom requis' });

    const existing = await Specialty.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Spécialité déjà existante' });

    const specialty = new Specialty({ name });
    await specialty.save();

    res.status(201).json(specialty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSpecialty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const specialty = await Specialty.findById(id);
    if (!specialty) return res.status(404).json({ message: 'Spécialité non trouvée' });

    specialty.name = name ?? specialty.name;
    await specialty.save();

    res.json(specialty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteSpecialty = async (req, res) => {
  try {
    const { id } = req.params;

    const specialty = await Specialty.findById(id);
    if (!specialty) return res.status(404).json({ message: 'Spécialité non trouvée' });

    await specialty.deleteOne();
    res.json({ message: 'Supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
