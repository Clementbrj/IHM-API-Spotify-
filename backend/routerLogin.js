const express = require("express");
const routerLogin = express.Router();
const { verifyToken } = require("./middleware/Verify.js");
const generateToken = require("./token/token.js"); // ✅ Import correct
const fs =  require('fs');
const {useNavigate} = require("react-router-dom");
const USERS_FILE = "user.json";


// Route de connexion (POST /login)
routerLogin.post("/login", (req, res) => {
    console.log("🚀 [DEBUG] Requête reçue sur /login [I] -> ",req.body);
    console.log("🚀 [DEBUG] Username [I] -> ",req.body.name);
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
    const  pwd =req.body.user_pass;
    var connexionrequired = false;
var usertocheck

    try {


    } catch (error) {
        console.error("🔥 [ERREUR] Problème lors de la génération du token :3 :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }

    console.log(connexionrequired)
    let users = readUsers();






    if (!user) {
        console.log("❌ [DEBUG0] Username manquant !");
        return res.status(404).json({error: "Utilisateur non renseigné"});
    }else{
        console.log(user,"USER ✅,X-X ",user);
    }

 /*   try{*/


         usertocheck = users.find(u => u.name === user);
        console.log("TFFFFFFFFFFFFFFFFdsfdgf",usertocheck)

        if(usertocheck !== undefined){
            console.log("passed")
           connexionrequired = verifyToken(user)
            console.log(connexionrequired,"zaeterr")
        }else{
            console.log("❌ [DEBUG] Username inexistant fds !");
            return res.status(401).json({error: "Utilisateur non trouvé"});
        }
        if(connexionrequired === true ){


        console.log("GUITUYTFgdezqrt-gsyyrzeqiuytgfsedhgserydiuy",connexionrequired)

        if(usertocheck.password !== pwd){
            console.log("❌ [DEBUG0] mauvais pwd !");
            return res.status(401).json({error:"utilisateur ou mot de passe incorrect"})
        }

 /*   }catch(err){
        return res.status(404).json({error: "Utilisateur non trouvé"});
    }*/



    if (!user) {
        console.log("❌ [DEBUG] Username manquant !");
        return res.status(400).json({ error: "Le username est requis" });
    }else{
        try {
            // 1️⃣ Lire le fichier JSON
            const data = fs.readFileSync(USERS_FILE, "utf8");
            let jsonData = JSON.parse(data); // Convertir en objet JS (tableau)
           var newusertoken= jsonData.find(u => u.name === user);


            // 2️⃣ Modifier le champ "usertoken" pour le premier élément
            console.log( "VFTtrfds",  newusertoken.spotify_info.usertoken ,usertocheck)
            newusertoken.spotify_info.usertoken = generateToken(user);
            console.log("✅ [DEBUG] Token généré :",newusertoken.spotify_info.usertoken,   );

            // 3️⃣ Écrire les nouvelles données dans le fichier
            fs.writeFileSync(USERS_FILE, JSON.stringify(jsonData, null, 4), "utf8");

            console.log("Mise à jour réussie !");
          /*  return user;*/
            console.log(usertocheck   );
            res.send(""+usertocheck)
        } catch (error) {
            console.error("Erreur :", error);
    }    }



    }else{
        console.log("Sucess")
            /*return user*/

         //   res.status(210).send("ok ta mere")
            console.log(  Object.values(usertocheck))
              res.status(210).send(Object.values(usertocheck))
    }
});



// Route de vérification du token (GET /login)
routerLogin.get("/login", verifyToken, (req, res) => {
    res.json({ message: "Token valide", user: req.user });
});

module.exports = routerLogin; //