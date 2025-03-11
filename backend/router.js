const express = require("express");
const fs = require("fs");
const router = express.Router();
const generateToken = require("./token/token.js");
const USERS_FILE = "user.json";
const groupe = require("./groupe");
const error = require("eslint-plugin-react/lib/util/error");
const axios = require("axios");

// Lire les utilisateurs depuis le fichier JSON
const readUsers = () => {
    if (!fs.existsSync(USERS_FILE)) return []; // Si le fichier n'existe pas, on retourne un tableau vide
    try {
        return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    } catch (err) {
        console.error("Erreur de lecture du fichier :", err);
        return [];
    }
};

const VerifyUser = (name, password) => {
    const users = readUsers();
    return users.find(user => user.name === name && user.password === password);
}


// Écrire la liste des utilisateurs dans le fichier JSON
const writeUsers = (users) => {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
    } catch (error) {
        console.error("Erreur d'écriture dans le fichier :", error);
    }
};

// Route par défaut (accueil)
router.get("/", (req, res) => {
    res.json("Bienvenue dans l'API");
});

// Route pour ajouter un utilisateur
router.post("/users", (req, res) => {
    const {
        name,
        password,
        playlist = "1",
        titre = "1",
        association = "1",
        titre_encours = "1",
        appareil = "1",
        spotify_info = {
            usernamespotify: "1",
            popularité: "1",
            usertoken: generateToken(name),
            tokenspotify: "1",
            durée_moyenne: "1"
        },
        groupe = null,
    } = req.body;

    if (!name || !password) {
        return res.status(400).json({error: "Le nom et le mot de passe sont requis"});
    }

    if (VerifyUser(name, password)) {
        return res.status(409).json({error: "Utilisateur déjà existant"})
    }

    const users = readUsers(); // Récupérer la liste des utilisateurs
    const newUser = {
        name,
        password,
        playlist,
        titre,
        association,
        titre_encours,
        appareil,
        spotify_info,

        groupe
    };


    users.push(newUser); // Ajouter le nouvel utilisateur
    writeUsers(users); // Écrire la liste mise à jour dans le fichier

    console.log("Nouvel utilisateur ajouté :", newUser);
    res.status(201).json({message: "Utilisateur créé avec succès", user: newUser});

})

router.post("users/:name/musique", async (req, res) => {
    const {name} = req.body;
    const users = readUsers();
    const user = await users.find(user => user.name === name);

    if (!user) {
        return res.status(404).json({error: "Utilisateur non trouvé"});
    }

    if (!user.spotify?.tokenspotify){
        return res.status(404).json({error: "Utilisateur non connecté à Spotify"})
    }

    try {
        const response = await axios.get("https://api.spotify.com/v1/me/player/currently-playing", {
            headers: {authorization: `Bearer ${user.spotify.tokenspotify}`},
        })
        if (!response.data || !response.data.playlist) {
            return res.json({error: "Aucune musique en cours d'écoute"})
        }
        const track = response.data.item;
        const musique = {
            titre: track.name,
        }

        user.titre_encours = musique.titre;
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
        res.json(musique);

    } catch(err) {
        console.log("erreur API spotify :", err.response?.data || err.message);
        res.status(500).json({error: "Impossible de récupérer la musique en cours"});
    }
})

    module.exports = {
        router,
        groupe,
    }
