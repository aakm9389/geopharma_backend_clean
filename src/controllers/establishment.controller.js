import Establishment from "../models/MedicalEstablishment.js";

/// ==========================
/// 📥 GET ALL (PUBLIC)
/// ==========================
export const getAll = async (req, res) => {
  try {
    const { city, type } = req.query;
    const filter = {};

    if (city) filter.city = city;
    if (type) filter.type = type;

    const establishments = await Establishment.find(filter);

    // ✅ Normalisation des assurances
    const data = establishments.map((e) => {
      const obj = e.toObject();
      return {
        ...obj,
        insurances: Array.isArray(obj.insurances)
          ? obj.insurances
          : JSON.parse(obj.insurances || "[]"),
      };
    });

    res.json(data);
  } catch (e) {
    console.error("❌ getAll establishments:", e);
    res.status(500).json({ message: e.message });
  }
};

/// ==========================
/// ➕ CREATE (ADMIN)
/// ==========================
export const create = async (req, res) => {
  try {
    const {
      name,
      address,
      city,
      type,
      phone,
      latitude,
      longitude,
      hasLaboratory,
      hasImaging,
      hasDialysis,
      insurances,
    } = req.body;

    // ✅ Champs obligatoires
    if (!name || !city || !type || !latitude || !longitude) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const data = {
      name,
      address,
      city,
      type,
      phone,

      // ✅ Localisation
      mapLocation: `${latitude},${longitude}`,

      hasLaboratory: hasLaboratory === "true",
      hasImaging: hasImaging === "true",
      hasDialysis: hasDialysis === "true",

      // ✅ Assurances TOUJOURS en array
      insurances: insurances
        ? insurances.split(",").map((i) => i.trim())
        : [],
    };

    // ✅ Image facultative
    if (req.file) {
      data.image = `${req.protocol}://${req.get(
        "host"
      )}/uploads/establishments/${req.file.filename}`;
    }

    const establishment = await Establishment.create(data);

    res.status(201).json({
      ...establishment.toObject(),
      insurances: establishment.insurances,
    });
  } catch (e) {
    console.error("❌ create establishment:", e);
    res.status(500).json({ message: e.message });
  }
};

/// ==========================
/// ✏️ UPDATE (ADMIN)
/// ==========================
export const update = async (req, res) => {
  try {
    const data = { ...req.body };

    // ✅ Image facultative
    if (req.file) {
      data.image = `${req.protocol}://${req.get(
        "host"
      )}/uploads/establishments/${req.file.filename}`;
    }

    // ✅ mapLocation
    if (req.body.latitude && req.body.longitude) {
      data.mapLocation = `${req.body.latitude},${req.body.longitude}`;
    }

    // ✅ Assurances normalisées
    if (req.body.insurances !== undefined) {
      data.insurances = Array.isArray(req.body.insurances)
        ? req.body.insurances
        : req.body.insurances
            .split(",")
            .map((i) => i.trim());
    }

    const establishment = await Establishment.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    if (!establishment) {
      return res
        .status(404)
        .json({ message: "Établissement introuvable" });
    }

    res.json({
      ...establishment.toObject(),
      insurances: establishment.insurances,
    });
  } catch (e) {
    console.error("❌ update establishment:", e);
    res.status(500).json({ message: e.message });
  }
};

/// ==========================
/// 🗑️ DELETE (ADMIN)
/// ==========================
export const remove = async (req, res) => {
  try {
    await Establishment.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (e) {
    console.error("❌ delete establishment:", e);
    res.status(500).json({ message: e.message });
  }
};
