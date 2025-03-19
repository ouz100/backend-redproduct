const mongoose = require("mongoose");
require('dotenv').config(); // Charger les variables d'environnement

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Erreur de connexion MongoDB : ${error.message}`);
    process.exit(1); // Arrêter le serveur en cas d'échec
  }
};

module.exports = connectDB;
