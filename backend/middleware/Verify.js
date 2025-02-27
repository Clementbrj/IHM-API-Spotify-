const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" });

const secret = process.env.TOKEN_SECRET || "supersecretkey"; // ⚠️ Mets la même clé que pour générer le token

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"]; // ✅ Vérifie le bon header

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Accès refusé, token Bearer manquant ou mal formaté" });
    }

    const token = authHeader.split(" ")[1]; // ✅ Extrait le vrai token après "Bearer "

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Token invalide ou expiré" });
        }

        req.user = decoded; // ✅ Stocke les données du token pour la suite
        next(); // ✅ Passe à la prochaine étape
    });
};

module.exports = { verifyToken };

