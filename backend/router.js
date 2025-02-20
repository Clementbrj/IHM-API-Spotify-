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
    const { name, password, playlist = "",
        titre = "",
        association = "",
        titre_encours = "",
        appareil = "",
        spotify_info = {
            "usernamespotify": "",
            "popularité": "",
            "tokenspotify": "",
            "durée_moyenne": ""
        },
        groupe = {
            "nom": "",
            "is_admin": "",
            "members": [
            ],
            "taille": 10
        }  } = req.body;

    if (!name || !password) {
        return res.status(400).json({ error: "Le nom et le mot de passe sont requis" });
    }

    const users = readUsers();
    const newUser = { name, password, playlist,
        titre,
        association,
        titre_encours,
        appareil,
        spotify_info,
        groupe,
        };
    try{
    users.push(newUser);
    writeUsers(users);

    }catch(err){
        console.log(err);
    }

    console.log("Nouvel utilisateur ajouté :", newUser);
    res.status(201).json({ message: "Utilisateur créé avec succès", user: newUser });
});


module.exports = router;
