const express = require("express");
const fs = require("fs");
const crypto = require("crypto");

const router = express.Router();
const USERS_FILE = "user.json";


// Route par défaut (accueil)
router.get("/", (req, res) => {
    res.json("Bienvenue dans l'API");
});

const readUsers = async (req, res) => {
    if (!fs.existsSync(USERS_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    } catch (err) {
        return [];
    }
}

const writeUsers = async (req, res) => {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(req.body, null, 2), 'utf8');
    } catch (error) {
        console.error(error);
    }
}

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
