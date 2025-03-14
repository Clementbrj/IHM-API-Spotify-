const express = require('express');
const cors = require("cors");

const app = express();
const PORT = 3000;

const routerLogin = require("./routerLogin"); // ✅ Importation correcte
const USERS_FILE = 'user.json';
const SECRET_KEY = 'supersecretkey'; // Clé pour JWT
const { router, groupe } = require("./router");
const { swaggerUi, swaggerDocs } = require("./swaggerConfig");

app.use(cors());
app.use(express.json());
app.use("/", router, groupe);
app.use("/", routerLogin);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📄 Documentation Swagger disponible sur http://localhost:${PORT}/api-docs`);
});

// Export des modules
module.exports = { app, SECRET_KEY };

// Vérification et chargement des routes Spotify
try {
    require('./spotify/spotify');
} catch (err) {
    console.error("❌ Erreur lors du chargement de spotify.js :", err.message);
}
