import Pharmacy from '../models/Pharmacy.js';

/* =======================
   GET ALL PHARMACIES
======================= */
export const getPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find();
    res.json(pharmacies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =======================
   GET ONE PHARMACY
======================= */
export const getPharmacyById = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacie introuvable' });
    }
    res.json(pharmacy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =======================
   CREATE PHARMACY (ADMIN)
======================= */
export const createPharmacy = async (req, res) => {
  try {
    const pharmacy = new Pharmacy(req.body);
    await pharmacy.save();
    res.status(201).json(pharmacy);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* =======================
   UPDATE PHARMACY (ADMIN)
======================= */
export const updatePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(pharmacy);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* =======================
   DELETE PHARMACY (ADMIN)
======================= */
export const deletePharmacy = async (req, res) => {
  try {
    await Pharmacy.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pharmacie supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =======================
   GET PHARMACIES ON DUTY
======================= */
export const getOnDutyPharmacies = async (req, res) => {
  try {
    const { city, date } = req.query;
    const query = {};

    if (city) query.city = city;

    if (date) {
      const selectedDate = new Date(date);
      query.guardStartDate = { $lte: selectedDate };
      query.guardEndDate = { $gte: selectedDate };
    }

    const pharmacies = await Pharmacy.find(query);
    res.json(pharmacies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
