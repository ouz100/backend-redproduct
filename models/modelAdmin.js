// models/modelAdmin.js
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true } // Ajoute createdAt et updatedAt automatiquement
);

module.exports = mongoose.model("Admin", adminSchema);
