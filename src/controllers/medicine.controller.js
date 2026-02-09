import Medicine from '../models/Medicine.js';

/// =======================
/// GET - Liste des médicaments
/// =======================
export const listMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ name: 1 });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/// =======================
/// POST - Ajouter (ADMIN)
/// =======================
export const createMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json(medicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/// =======================
/// PUT - Modifier (ADMIN)
/// =======================
export const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!medicine) {
      return res.status(404).json({ message: 'Médicament introuvable' });
    }

    res.json(medicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/// =======================
/// DELETE - Supprimer (ADMIN)
/// =======================
export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: 'Médicament introuvable' });
    }

    res.json({ message: 'Médicament supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
