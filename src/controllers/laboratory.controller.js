import Laboratory from '../models/Laboratory.js';

// GET /labs?city=
export const getByCity = async (req, res) => {
  try {
    const city = req.query.city;
    const labs = await Laboratory.find(city ? { city } : {});
    res.json(labs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /labs
export const addLab = async (req, res) => {
  try {
    const lab = new Laboratory(req.body);
    await lab.save();
    res.status(201).json(lab);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /labs/:id
export const updateLab = async (req, res) => {
  try {
    const lab = await Laboratory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lab) return res.status(404).json({ message: 'Laboratoire non trouvé' });
    res.json(lab);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /labs/:id
export const deleteLab = async (req, res) => {
  try {
    const lab = await Laboratory.findByIdAndDelete(req.params.id);
    if (!lab) return res.status(404).json({ message: 'Laboratoire non trouvé' });
    res.json({ message: 'Supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default { getByCity, addLab, updateLab, deleteLab };
