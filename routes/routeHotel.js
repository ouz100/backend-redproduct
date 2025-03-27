// routes/hotelRoutes.js
const express = require('express');
const router = express.Router();
const hotelController = require('../controller/controllerHotel');
const path = require('path');




// Routes
router.get('/', hotelController.getAllHotels);
router.get('/:id', hotelController.getHotelById);
router.post('/',  hotelController.createHotel);
router.put('/:id',  hotelController.updateHotel);
router.delete('/:id', hotelController.deleteHotel);

module.exports = router;


