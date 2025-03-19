// controller/controllerHotel.
// controller/controllerHotel.js
const Hotel = require('../models/Hotel'); // Vous devrez créer ce modèle
const fs = require('fs');
const path = require('path');

// Obtenir tous les hôtels
exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des hôtels", error: error.message });
  }
};

// Obtenir un hôtel par son ID
exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: "Hôtel non trouvé" });
    }
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de l'hôtel", error: error.message });
  }
};

// Créer un nouvel hôtel
exports.createHotel = async (req, res) => {
  try {
    const { name, address, email, phoneNumber, pricePerNight, currency } = req.body;
    
    // Vérifier si l'image est fournie
    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/hotels/${req.file.filename}`;
    }

    // Créer le nouvel hôtel
    const newHotel = new Hotel({
      name,
      address,
      email,
      phoneNumber,
      pricePerNight: parseFloat(pricePerNight),
      currency,
      image: imagePath,
      price: `${pricePerNight} ${currency} par nuit`
    });

    // Sauvegarder l'hôtel dans la base de données
    const savedHotel = await newHotel.save();
    res.status(201).json(savedHotel);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de l'hôtel", error: error.message });
  }
};

// Mettre à jour un hôtel
exports.updateHotel = async (req, res) => {
  try {
    const { name, address, email, phoneNumber, pricePerNight, currency } = req.body;
    const hotelId = req.params.id;
    
    // Trouver l'hôtel existant
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hôtel non trouvé" });
    }

    // Vérifier si une nouvelle image est fournie
    let imagePath = hotel.image;
    if (req.file) {
      // Si l'hôtel avait déjà une image, la supprimer
      if (hotel.image) {
        const oldImagePath = path.join(__dirname, '..', 'public', hotel.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imagePath = `/uploads/hotels/${req.file.filename}`;
    }

    // Mettre à jour les données de l'hôtel
    const updatedHotel = await Hotel.findByIdAndUpdate(
      hotelId,
      {
        name,
        address,
        email,
        phoneNumber,
        pricePerNight: parseFloat(pricePerNight),
        currency,
        image: imagePath,
        price: `${pricePerNight} ${currency} par nuit`
      },
      { new: true }
    );

    res.status(200).json(updatedHotel);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'hôtel", error: error.message });
  }
};

// Supprimer un hôtel
exports.deleteHotel = async (req, res) => {
  try {
    const hotelId = req.params.id;
    
    // Trouver l'hôtel
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hôtel non trouvé" });
    }

    // Supprimer l'image associée si elle existe
    if (hotel.image) {
      const imagePath = path.join(__dirname, '..', 'public', hotel.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Supprimer l'hôtel de la base de données
    await Hotel.findByIdAndDelete(hotelId);
    
    res.status(200).json({ message: "Hôtel supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'hôtel", error: error.message });
  }
};
