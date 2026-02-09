import Laboratory from "../models/Laboratory.js";

// GET all labs
export const getLabs = async (req, res) => {
  try {
    const labs = await Laboratory.find();
    res.json(labs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE lab (admin)
export const createLab = async (req, res) => {
  try {
    const lab = new Laboratory(req.body);
    await lab.save();
    res.status(201).json(lab);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
