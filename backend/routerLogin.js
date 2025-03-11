const express = require("express");
const routerLogin = express.Router();
const { verifyToken } = require("./middleware/Verify.js");
const generateToken = require("./token/token.js"); // ✅ Import correct

// Route de connexion (POST /login)
routerLogin.post("/login", (req, res) => {
    console.log("🚀 [DEBUG] Requête reçue sur /login");

    const { username } = req.body;
    if (!username) {
        console.log("❌ [DEBUG] Username manquant !");
        return res.status(400).json({ error: "Le username est requis" });
    }

    try {
        const token = generateToken(username); // ✅ Génération du token
        console.log("✅ [DEBUG] Token généré :", token);
        res.json({ token });
    } catch (error) {
        console.error("🔥 [ERREUR] Problème lors de la génération du token :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// Route de vérification du token (GET /login)
routerLogin.get("/login", verifyToken, (req, res) => {
    res.json({ message: "Token valide", user: req.user });
});

module.exports = routerLogin; //