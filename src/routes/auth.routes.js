import express from 'express';
import { login, register } from '../controllers/auth.controller.js';

const router = express.Router();

// Login existant
router.post('/login', login);

// 🔹 Nouvelle route pour enregistrer un utilisateur/admin
router.post('/register', register);

export default router;
