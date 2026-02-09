import ImagingCenter from '../models/ImagingCenter.js';

export const getByCity = async (req, res) => {
  const { city } = req.query;
  const centers = await ImagingCenter.find({ city });
  res.json(centers);
};

export const addCenter = async (req, res) => {
  const center = await ImagingCenter.create(req.body);
  res.status(201).json(center);
};

export const updateCenter = async (req, res) => {
  const center = await ImagingCenter.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(center);
};

export const deleteCenter = async (req, res) => {
  await ImagingCenter.findByIdAndDelete(req.params.id);
  res.json({ message: 'Supprimé' });
};
