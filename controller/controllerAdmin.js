const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/modelAdmin");
require("dotenv").config();

// Inscription d'un administrateur
exports.registerAdmin = async (req, res) => {
  try {
    const { nom, email, motDePasse } = req.body;

    // Vérifier si l'administrateur existe déjà
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    // Créer un nouvel administrateur
    admin = new Admin({
      nom,
      email,
      password: motDePasse
    });

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(motDePasse, salt);

    // Sauvegarder l'administrateur dans la base de données
    await admin.save();

    // Créer et renvoyer un token JWT
    const payload = {
      admin: {
        id: admin.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ 
          message: "Administrateur créé avec succès", 
          token 
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Connexion d'un administrateur
exports.loginAdmin = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    // Vérifier si l'administrateur existe
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(motDePasse, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }

    // Créer et renvoyer un token JWT
    const payload = {
      admin: {
        id: admin.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Récupérer les informations d'un administrateur (protégé par authentification)
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password"); // Ne pas renvoyer le mot de passe
    if (!admin) {
      return res.status(404).json({ message: "Administrateur non trouvé" });
    }
    
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};


// controller/controllerAdmi.js
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const Admin = require("../models/modelAdmin"); // Modèle Admin
// require("dotenv").config();

// // Inscription d'un administrateur


// // Connexion d'un administrateur


// // Récupérer les informations d'un administrateur (protégé par authentification)
// exports.getAdminProfile = async (req, res) => {
//   try {
//     const admin = await Admin.findById(req.admin.id).select("-password"); // Ne pas renvoyer le mot de passe
//     if (!admin) {
//       return res.status(404).json({ message: "Administrateur non trouvé" });
//     }

//     res.status(200).json(admin);
//   } catch (error) {
//     res.status(500).json({ message: "Erreur serveur", error: error.message });
//   }
// };
