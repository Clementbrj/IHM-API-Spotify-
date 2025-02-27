const express = require('express');
const cors = require("cors");

console.log("ok");

const app = express();
const PORT = 3000;
const SECRET_KEY = 'supersecretkey'; // ⚠️ À stocker dans `.env` en production

const router = require("./router"); // ✅ Importation correcte
const routerLogin = require("./routerLogin"); // ✅ Importation correcte

app.use(cors());
app.use(express.json());

// Utilisation des routes
app.use("/", router);
app.use("/", routerLogin); // ✅ Ajouté séparément

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});

// Export des modules
module.exports = { app, SECRET_KEY };

// Vérification et chargement des routes Spotify
try {
    require('./spotify/spotify');
} catch (err) {
    console.error("❌ Erreur lors du chargement de spotify.js :", err.message);
}
