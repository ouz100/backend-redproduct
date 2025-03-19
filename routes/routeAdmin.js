const express = require("express");
const { registerAdmin, loginAdmin, getAdminProfile } = require("../controller/controllerAdmin");
const authMiddleware = require("../middlewares/authMiddleware"); // Vous aurez besoin de ce middleware pour protéger les routes

const router = express.Router();

// Route pour l'inscription d'un admin
router.post('/inscription', registerAdmin);

// Route pour la connexion d'un admin
router.post('/connexion', loginAdmin);

// Route protégée pour récupérer le profil admin
router.get('/profilAdmin', authMiddleware, getAdminProfile);

module.exports = router;


// routes/routeAdmin.js
// const express = require("express");
// const { getAdminProfile } = require("../controller/controllerAdmin");

// const router = express.Router();

// router.get('/profilAdmin',getAdminProfile );

// module.exports = router;