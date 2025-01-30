const express = require('express');

const fs = require('fs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


const app = express();
const PORT = 3000;
const USERS_FILE = 'users.json';
const SECRET_KEY = 'supersecretkey'; // Clé pour JWT

// Route par défaut
app.get('/', (req, res) => {
    res.json("Bienvenue");
});


// Fonction pour lire les utilisateurs
const readUsers = () => {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
};

// Fonction pour écrire dans le fichier JSON
const writeUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});

// Rendre disponible des modules pour les autres fichiers
module.exports = { app, readUsers, writeUsers, SECRET_KEY };
require('./spotify');  // Ajoute & démarre des routes spotify