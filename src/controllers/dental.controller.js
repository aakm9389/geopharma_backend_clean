import DentalCabinet from '../models/DentalCabinet.js';

export const getByCity = async (req, res) => {
  try {
    const { city } = req.query;
    const query = city ? { city } : {};
    const data = await DentalCabinet.find(query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

  export const addCabinet = async (req, res) => {
    try {
      const data = {
        ...req.body,
        image: req.file ? `/uploads/dentals/${req.file.filename}` : null,
      };

      const cabinet = await DentalCabinet.create(data);
      res.status(201).json(cabinet);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  };


export const updateCabinet = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    if (req.file) {
      data.image = `/uploads/dentals/${req.file.filename}`;
    }

    const cabinet = await DentalCabinet.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    res.json(cabinet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCabinet = async (req, res) => {
  try {
    await DentalCabinet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
