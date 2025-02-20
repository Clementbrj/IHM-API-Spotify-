const express = require("express");
const fs = require("fs");
const crypto = require("crypto");

const router = express.Router();
const USERS_FILE = "user.json";

// Lire les utilisateurs depuis le fichier JSON
const readUsers = () => {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
};

// Écrire dans le fichier JSON
const writeUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Route par défaut (accueil)
router.get("/", (req, res) => {
    res.json("Bienvenue dans l'API");
});

// Route pour ajouter un utilisateur
router.post("/users", (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ error: "Le nom et le mot de passe sont requis" });
    }

    const users = readUsers();
    const newUser = { name, password };
    users.push(newUser);
    writeUsers(users);

    console.log("Nouvel utilisateur ajouté :", newUser);
    res.status(201).json({ message: "Utilisateur créé avec succès", user: newUser });
});


module.exports = router;
