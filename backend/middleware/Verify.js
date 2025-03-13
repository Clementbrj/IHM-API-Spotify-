const jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config({ path: "../.env" });
const USERS_FILE = "user.json";

const secret = process.env.TOKEN_SECRET || "supersecretkey"; // ⚠️ Mets la même clé que pour générer le token

const verifyToken = (username,req, res, next) => {


  /*  if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Accès refusé, token Bearer manquant ou mal formaté" });
    }*/

    const readUsers = () => {
        if (!fs.existsSync(USERS_FILE)) return [];
        try {
            return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
        } catch (err) {
            console.error("Erreur de lecture du fichier :", err);
            return [];
        }


        let users = readUsers();

        let user = users.find(u => u.name === username);
        let tokentocompare = users.usertoken
        console.log(tokentocompare ,"[DEBUG->tokentocompare]")
    const token = authHeader.split(" ")[1]; // ✅ Extrait le vrai token après "Bearer "

    jwt.verify(tokentocompare, secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Token invalide ou expiré" });
        }

        req.user = decoded; // ✅ Stocke les données du token pour la suite
        next(); // ✅ Passe à la prochaine étape
    });
    console.log( jwt.verify(tokentocompare, secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Token invalide ou expiré" });
        } })
    )
};
}

module.exports = { verifyToken };

