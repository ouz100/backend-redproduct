// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Connexion à la base de données
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('Connexion à MongoDB établie'))
// .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// // Routes
// app.use('/api/utilisateurs', require('./routes/routeAdmin'));

// // Autres routes ici...

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));





const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db'); // Importation de la DB
const app = express();
const port = process.env.PORT || 5000;


// Connexion à la base de données
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Importation des routes utilisateur

const utilisateurRoutes = require('./routes/routeUtilisateur');
const adminRoutes = require('./routes/routeAdmin');
const allHotels = require('./routes/routeHotel');

app.use('/api/utilisateurs', utilisateurRoutes);


app.use("/api/admins", adminRoutes);

app.use("/api/hotels",  allHotels)
 
// Route de test
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API Utilisateurs');
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});
