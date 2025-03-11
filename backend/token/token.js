const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.TOKEN_SECRET || "supersecretkey"; // 🔑 Clé secrète

// Fonction pour générer un token
const generateToken = (username) => {
    return jwt.sign(
        { userName: username },  // ✅ Contenu du token
        secret,
        { expiresIn: "10min" }      // ✅ Expiration en 2 heures
    );
};

module.exports = generateToken;  // ✅ Export correc