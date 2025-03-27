const Hotel = require('../models/modelHotel'); // Modèle d'hôtel
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
      const { name, address, email, phoneNumber, pricePerNight, currency, image } = req.body;
      consol.log('image :',image)
      // Vérification des champs nécessaires
      if (!name || !address || !email || !phoneNumber || !pricePerNight || !currency) {
        return res.status(400).json({ message: "Tous les champs sont obligatoires" });
      }
  
      // Vérifier si l'image est fournie en texte (URL ou chemin)
      const imagePath = image || 'default_image_url.jpg';  // Si aucune image n'est fournie, on met une chaîne vide
      console.log("Données de l'hôtel :", { name, address, email, phoneNumber, pricePerNight, currency, imagePath });
  
      // Créer le nouvel hôtel
      const newHotel = new Hotel({
        name,
        address,
        email,
        phoneNumber,
        pricePerNight: parseFloat(pricePerNight),
        currency,
        image: imagePath, // L'image est maintenant un texte (URL)
        price: `${pricePerNight} ${currency} par nuit`
      });
  
      // Sauvegarder l'hôtel dans la base de données
      const savedHotel = await newHotel.save();
      res.status(201).json(savedHotel);
    } catch (error) {
      console.error("Erreur lors de la création de l'hôtel :", error); // Ajouter des logs d'erreur
      res.status(500).json({ message: "Erreur lors de la création de l'hôtel", error: error.message });
    }
  };
  

// Mettre à jour un hôtel
exports.updateHotel = async (req, res) => {
  try {
    const { name, address, email, phoneNumber, pricePerNight, currency, image } = req.body;
    const hotelId = req.params.id;
    
    // Trouver l'hôtel existant
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hôtel non trouvé" });
    }

    // Vérifier si une nouvelle image est fournie
    let imagePath = image || hotel.image; // L'image peut être mise à jour avec la nouvelle URL ou rester inchangée

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
        image: imagePath, // L'image est stockée comme texte
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

    // Supprimer l'hôtel de la base de données
    await Hotel.findByIdAndDelete(hotelId);
    
    res.status(200).json({ message: "Hôtel supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'hôtel", error: error.message });
  }
};

