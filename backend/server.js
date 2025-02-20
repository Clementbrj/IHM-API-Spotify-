const express = require('express');

console.log("ok");
const app = express();
const cors = require("cors");
const PORT = 3000;
const USERS_FILE = 'user.json';
const SECRET_KEY = 'supersecretkey'; // Clé pour JWT
const router = require("./router");

app.use(cors());
app.use(express.json());
app.use("/", router);


app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});

// Rendre disponible des modules pour les autres fichiers
module.exports = { app, SECRET_KEY };
require('./spotify/spotify');  // Ajoute & démarre des routes spotify