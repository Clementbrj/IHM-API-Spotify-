const jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config({ path: "../.env" });
const USERS_FILE = "user.json";

const secret = process.env.TOKEN_SECRET || "supersecretkey"; // ⚠️ Mets la même clé que pour générer le token
var isrequiredconnexion = false;

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
    };

        let users = readUsers();

        let user = users.find(u => u.name === username);
        console.log("Vhygudqsefvgdrs",user,"dqs",username)
        let tokentocompare = user.spotify_info.usertoken;
    console.log("edfsjnkigrdeuh")
        console.log(tokentocompare ,"[DEBUG->tokentocompare]",user)
    const token = tokentocompare.split(".") // ✅ Extrait le vrai token après "Bearer "
    console.log('token')
try{


   jwt.verify(tokentocompare, secret, (err, decoded) => {
        if (err) {
            console.log(err)
            /*return res.status(403).json({ error: "Token invalide ou expiré" });*/
            throw err
        } }
    )

        // ✅ Stocke les données du token pour la suite req.user = decoded;
   ; // ✅ Passe à la prochaine étape     next()

}catch(err){
    if (err instanceof jwt.TokenExpiredError) {
        console.log("Token expiré")
        isrequiredconnexion = true

    }else if (err == null){

        return res.status(403).json({ error: "erreur inconnue de la connexion  " });
    }else{
        console.log(!err,err,err.stack)
        return res.status(403).json({ error: err });
    }


}
console.log("token valide !")
/*
    console.log( jwt.verify(tokentocompare, secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Token invalide ou expiré" });
        } })
    )
        const verfiedetoken = jwt.verify(tokentocompare, secret, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: "Token invalide ou expiré" });
            } })
        console.log("fin de la vérification GVVYTFXRDFGV",verfiedetoken);
*/
return  isrequiredconnexion

}

module.exports = { verifyToken };

