// models/Hotel.js
const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Le nom de l'hôtel est requis"]
  },
  address: {
    type: String,
    required: [true, "L'adresse de l'hôtel est requise"]
  },
  email: {
    type: String,
    required: [true, "L'email de l'hôtel est requis"],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez fournir un email valide']
  },
  phoneNumber: {
    type: String,
    required: [true, "Le numéro de téléphone est requis"]
  },
  pricePerNight: {
    type: Number,
    required: [true, "Le prix par nuit est requis"]
  },
  currency: {
    type: String,
    default: 'F XOF',
    enum: ['F XOF', 'USD', 'EUR']
  },
  image: {
    type: String,
    default: null
  },
  price: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour mettre à jour la date de modification
HotelSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Hotel', HotelSchema);