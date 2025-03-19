// routes/routeUtilisateur.js
const express = require('express');
const { inscription, connexion, getUtilisateurs } = require('../controller/controlleurUtilisateur');
const  authMiddleware  = require('../middlewares/authMiddleware');

const router = express.Router();

// ✅ Route pour l'inscription d'un utilisateur
router.post('/inscription', inscription);

// ✅ Route pour la connexion d'un utilisateur
router.post('/connexion', connexion);

// ✅ Route pour récupérer la liste des utilisateurs (Protégée par JWT)
router.get('/utilisateurs', authMiddleware, getUtilisateurs);

module.exports = router;
