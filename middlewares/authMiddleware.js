const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next) {
  // Récupérer le token du header
  const token = req.header('x-auth-token');

  // Vérifier si pas de token
  if (!token) {
    return res.status(401).json({ message: 'Pas de token, autorisation refusée' });
  }

  // Vérifier le token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded.admin;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide' });
  }
};


// middlewares/authMiddleware.js
// const jwt = require('jsonwebtoken');

// const dotenv =require ("dotenv");

// dotenv.config(); // Charger les variables d'environnement

// const authMiddleware = (req, res, next) => {
//   const token = req.header("Authorization"); // Récupérer le token de l'en-tête

//   if (!token) {
//     return res.status(401).json({ message: "Accès non autorisé, token manquant !" });
//   }

//   try {
//     const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
//     req.user = decoded; // Ajouter l'utilisateur au `req`
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Token invalide !" });
//   }
// };

// module.exports = authMiddleware;
