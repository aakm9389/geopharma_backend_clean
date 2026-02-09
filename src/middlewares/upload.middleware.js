import multer from 'multer';
import path from 'path';
import fs from 'fs';

/// ==========================
/// 📁 DOSSIERS
/// ==========================
const uploadRoot = 'uploads';
const dentalDir = path.join(uploadRoot, 'dentals');
const doctorDir = path.join(uploadRoot, 'doctors');
const establishmentDir = path.join(uploadRoot, 'establishments');

// ✅ Créer uploads/
if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

// ✅ Créer uploads/dentals/
if (!fs.existsSync(dentalDir)) {
  fs.mkdirSync(dentalDir, { recursive: true });
}

// ✅ Créer uploads/doctors/
if (!fs.existsSync(doctorDir)) {
  fs.mkdirSync(doctorDir, { recursive: true });
}

// ✅ Créer uploads/establishments/
if (!fs.existsSync(establishmentDir)) {
  fs.mkdirSync(establishmentDir, { recursive: true });
}

/// ==========================
/// 🦷 CABINETS DENTAIRES
/// ==========================
const dentalStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dentalDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `dental-${Date.now()}${ext}`);
  },
});

/// ==========================
/// 👨‍⚕️ MÉDECINS
/// ==========================
const doctorStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, doctorDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `doctor-${Date.now()}${ext}`);
  },
});

/// ==========================
/// 🏥 ÉTABLISSEMENTS
/// ==========================
const establishmentStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, establishmentDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `establishment-${Date.now()}${ext}`);
  },
});

/// ==========================
/// 🛡️ FILTRE IMAGE
/// ==========================
const fileFilter = (req, file, cb) => {
  const allowedExt = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (
    allowedExt.includes(ext) ||
    (file.mimetype && file.mimetype.startsWith('image/'))
  ) {
    cb(null, true);
  } else {
    cb(new Error('Fichier non autorisé'), false);
  }
};

/// ==========================
/// 📤 EXPORTS
/// ==========================

// 🦷 Dentaire
export const uploadDentalImage = multer({
  storage: dentalStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 👨‍⚕️ Médecins
export const uploadDoctorImage = multer({
  storage: doctorStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 🏥 Établissements
export const upload = multer({
  storage: establishmentStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
