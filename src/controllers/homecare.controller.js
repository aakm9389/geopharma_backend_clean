import HomecareService from '../models/HomecareService.js';

export const getAllServices = async (req, res) => {
  try {
    const services = await HomecareService.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (e) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const addService = async (req, res) => {
  try {
    const service = await HomecareService.create(req.body);
    res.status(201).json(service);
  } catch (e) {
    res.status(400).json({ message: 'Données invalides' });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await HomecareService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(service);
  } catch (e) {
    res.status(400).json({ message: 'Erreur mise à jour' });
  }
};

export const deleteService = async (req, res) => {
  try {
    await HomecareService.findByIdAndDelete(req.params.id);
    res.json({ message: 'Supprimé' });
  } catch (e) {
    res.status(400).json({ message: 'Erreur suppression' });
  }
};
