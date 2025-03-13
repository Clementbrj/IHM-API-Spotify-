const express = require("express");
const routerLogin = express.Router();
const { verifyToken } = require("./middleware/Verify.js");
const generateToken = require("./token/token.js"); // ✅ Import correct
const fs =  require('fs');
const USERS_FILE = "user.json";

// Route de connexion (POST /login)
routerLogin.post("/login", (req, res) => {
    console.log("🚀 [DEBUG] Requête reçue sur /login [I] -> ",req,res);
    const readUsers = () => {
        if (!fs.existsSync(USERS_FILE)) return [];
        try {
            return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
        } catch (err) {
            console.error("Erreur de lecture du fichier :", err);
            return [];
        }
    };


    //let users = readUsers();

    //let user = users.find(u => u.name === users);
    const user = req.body.name;
    if (!user) {
        console.log("❌ [DEBUG0] Username manquant !");
        return res.status(404).json({error: "Utilisateur non trouvé"});
    }else{
        console.log(user,"USER ✅");
    }

    if (!user) {
        console.log("❌ [DEBUG] Username manquant !");
        return res.status(400).json({ error: "Le username est requis" });
    }

    verifyToken(user, verifyToken);

    try {
        const token = generateToken(user); // ✅ Génération du token
        console.log("✅ [DEBUG] Token généré :", token);
        res.json({ token });
    } catch (error) {
        console.error("🔥 [ERREUR] Problème lors de la génération du token :3 :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// Route de vérification du token (GET /login)
routerLogin.get("/login", verifyToken, (req, res) => {
    res.json({ message: "Token valide", user: req.user });
});

module.exports = routerLogin; //