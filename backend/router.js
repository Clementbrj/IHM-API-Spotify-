const express = require("express");
const fs = require("fs");
const router = express.Router();
const generateToken = require("./token/token.js");
const USERS_FILE = "user.json";
const groupe = require("./groupe");
const error = require("eslint-plugin-react/lib/util/error");
const axios = require("axios");
const {join} = require("node:path");

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

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Récupère un utilisateur du fichier user.json
 *     description: Retourne le premier utilisateur trouvé avec un username non nul.
 *     responses:
 *       200:
 *         description: Succès - Retourne l'utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: "john_doe"
 *       404:
 *         description: Aucun utilisateur trouvé
 *       500:
 *         description: Erreur serveur ou problème de lecture/parsing JSON
 */
router.get("/user", (req, res) => {
    const usersPath = "user.json";

    fs.readFile(usersPath, "utf8", (err, data) => {
        if (err) {
            console.error("Erreur de lecture du fichier :", err);
            return res.status(500).json({ error: "Erreur serveur" });
        }

        try {
            const users = JSON.parse(data);
            const user = users.find(u => u.username !== null); // Prend le premier utilisateur trouvé

          //  if(user.usertoken !== null) {
            //    user.find(u => u.username === user.usertoken)
            //}
            if (!user) {
                return res.status(404).json({ error: "Utilisateur non trouvé" });
            }


            res.json({ username: user.username });
        } catch (error) {
            console.error("Erreur de parsing JSON :", error);
            res.status(500).json({ error: "Erreur de parsing JSON" });
        }
    });
});

//route pour récuperer le username id de l'utilisateur
router.get(`/user/:usertoken`, (req, res) => {
    const usersPath = "user.json";

    fs.readFile(usersPath, "utf8", (err, data) => {
        if (err) {
            console.error("Erreur de lecture du fichier :", err);
            return res.status(500).json({ error: "Erreur serveur" });
        }

        try {
            const users = JSON.parse(data);
            const user = users.find(u => u.usertoken === req.params.usertoken); // Prend le premier utilisateur trouvé

            if (!user) {
                return res.status(404).json({ error: "Utilisateur non trouvé" });
            }

            res.json({ username: user.username, usertoken: req.params.usertoken });
        } catch (error) {
            console.error("Erreur de parsing JSON :", error);
            res.status(500).json({ error: "Erreur de parsing JSON" });
        }
    });
});



// Route par défaut (accueil)
router.get("/", (req, res) => {
    res.json("Bienvenue dans l'API");
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     description: Enregistre un nouvel utilisateur avec des informations Spotify et d'autres détails.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "JohnDoe"
 *               password:
 *                 type: string
 *                 example: "securepassword123"
 *               playlist:
 *                 type: string
 *                 example: "1"
 *               titre:
 *                 type: string
 *                 example: "1"
 *               association:
 *                 type: string
 *                 example: "1"
 *               titre_encours:
 *                 type: string
 *                 example: "1"
 *               appareil:
 *                 type: string
 *                 example: "1"
 *               spotify_info:
 *                 type: object
 *                 properties:
 *                   usernamespotify:
 *                     type: string
 *                     example: "SpotifyUser123"
 *                   popularité:
 *                     type: string
 *                     example: "1"
 *                   usertoken:
 *                     type: string
 *                     example: "generatedToken"
 *                   tokenspotify:
 *                     type: string
 *                     example: "1"
 *                   durée_moyenne:
 *                     type: string
 *                     example: "1"
 *               groupe:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur créé avec succès"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Nom et mot de passe obligatoires
 *       409:
 *         description: L'utilisateur existe déjà
 *       500:
 *         description: Erreur interne du serveur
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         password:
 *           type: string
 *         playlist:
 *           type: string
 *         titre:
 *           type: string
 *         association:
 *           type: string
 *         titre_encours:
 *           type: string
 *         appareil:
 *           type: string
 *         spotify_info:
 *           type: object
 *           properties:
 *             usernamespotify:
 *               type: string
 *             popularité:
 *               type: string
 *             usertoken:
 *               type: string
 *             tokenspotify:
 *               type: string
 *             durée_moyenne:
 *               type: string
 *         groupe:
 *           type: string
 *           nullable: true
 */
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
