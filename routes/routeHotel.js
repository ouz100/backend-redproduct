// routes/hotelRoutes.js
const express = require('express');
const router = express.Router();
const hotelController = require('../controller/controllerHotel');
const multer = require('multer');
const path = require('path');

// Configuration de multer pour le téléchargement d'images
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/hotels/');
  },
  filename: function(req, file, cb) {
    cb(null, `hotel-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5000000 }, // Limite à 5MB
  fileFilter: function(req, file, cb) {
    // Accepter uniquement les images
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Seules les images sont autorisées"));
  }
}).single('image');

// Routes
router.get('/', hotelController.getAllHotels);
router.get('/:id', hotelController.getHotelById);
router.post('/', upload, hotelController.createHotel);
router.put('/:id', upload, hotelController.updateHotel);
router.delete('/:id', hotelController.deleteHotel);

module.exports = router;


