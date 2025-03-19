// controller/controlleurUtilisateur.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/modelUtilisateur');
require('dotenv').config(); // Pour utiliser les variables d'environnemen
// ✅ Inscription d'un nouvel utilisateur
exports.inscription = async (req, res) => {
  try {
    const { nom, email, motDePasse, acceptTerms } = req.body;

    if (!acceptTerms) {
      return res.status(400).json({ message: "Vous devez accepter les termes et conditions." });
    }

    // Vérifier si l'utilisateur existe déjà
    const utilisateurExistant = await Utilisateur.findOne({ email });
    if (utilisateurExistant) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Hachage du mot de passe
    const motDePasseHash = await bcrypt.hash(motDePasse, 10);

    // Création de l'utilisateur
    const nouvelUtilisateur = new Utilisateur({
      nom,
      email,
      motDePasse: motDePasseHash,
      acceptTerms
    });

    await nouvelUtilisateur.save();

    res.status(201).json({ message: "Utilisateur inscrit avec succès !" });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ✅ Connexion utilisateur
exports.connexion = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    // Vérifier si l'utilisateur existe
    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) {
      return res.status(400).json({ message: "Utilisateur non trouvé." });
    }

    // Vérifier le mot de passe
    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    if (!motDePasseValide) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: utilisateur._id, email: utilisateur.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Token valide pendant 7 jours
    );

    res.status(200).json({
      message: "Connexion réussie",
      token,
      utilisateur: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        email: utilisateur.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ✅ Récupérer tous les utilisateurs (Protégé avec JWT)
exports.getUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.find().select("-motDePasse"); // Exclure le mot de passe
    res.status(200).json(utilisateurs);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
