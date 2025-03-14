const express = require("express");
const fs = require("fs");

const groupe = express.Router();
const GROUPES_FILE = "groupe.json";
const USERS_FILE = "user.json";

// Lire les groupes depuis le fichier JSON
const readGroupes = () => {
    if (!fs.existsSync(GROUPES_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(GROUPES_FILE, "utf8"));
    } catch (err) {
        console.error("Erreur de lecture du fichier :", err);
        return [];
    }
};

// Lire les utilisateurs depuis le fichier JSON
const readUsers = () => {
    if (!fs.existsSync(USERS_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    } catch (err) {
        console.error("Erreur de lecture du fichier :", err);
        return [];
    }
};

// Écrire dans le fichier JSON
const writeGroupes = (groupes) => {
    try {
        fs.writeFileSync(GROUPES_FILE, JSON.stringify(groupes, null, 2), "utf8");
    } catch (error) {
        console.error("Erreur d'écriture dans le fichier groupes :", error);
    }
};

const writeUsers = (users) => {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
    } catch (error) {
        console.error("Erreur d'écriture dans le fichier utilisateurs :", error);
    }
};

//Si l'utilisateur veut sortir du groupe
// Si l'utilisateur veut sortir du groupe
const LeavesGroupe = (username, groupes) => {
    if (!Array.isArray(groupes)) {
        console.error("Erreur : 'groupes' doit être un tableau.");
        return [];  // Retourne un tableau vide pour éviter l'erreur
    }

    return groupes.map(group => {
        // Vérification de la structure du groupe
        if (!group || !group.members || !Array.isArray(group.members)) {
            console.warn(`Le groupe ${group ? group.name : "inconnu"} a une structure invalide.`);
            return null;  // Retourne null pour les groupes invalides
        }

        if (group.members.includes(username)) {
            group.members = group.members.filter(member => member !== username);

            // Si l'utilisateur était admin, désigner un nouvel admin
            if (group.admin === username) {
                if (group.members.length > 0) {
                    group.admin = group.members[0];
                } else {
                    return null;  // Si le groupe est vide, le supprimer
                }
            }
        }
        return group;
    }).filter(group => group !== null);  // Filtrer les groupes invalides
};



/**
 * @swagger
 * /groupes/join:
 *   post:
 *     summary: Rejoindre ou créer un groupe
 *     tags: [Groupes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - taille
 *               - username
 *               - usertoken
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom du groupe à rejoindre ou créer
 *                 example: "Les Devs"
 *               taille:
 *                 type: integer
 *                 description: Taille maximale du groupe
 *                 example: 5
 *               username:
 *                 type: string
 *                 description: Nom de l'utilisateur qui veut rejoindre le groupe
 *                 example: "john_doe"
 *               usertoken:
 *                 type: string
 *                 description: Jeton de l'utilisateur pour authentification
 *                 example: "abcdef123456"
 *     responses:
 *       200:
 *         description: Succès (création ou ajout dans un groupe existant)
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Vous avez rejoint le groupe."
 *       400:
 *         description: Requête invalide (données manquantes)
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Nom ou taille du groupe manquants"
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Utilisateur non trouvé"
 */

// Route pour rejoindre ou créer un groupe
groupe.post("/groupes/join", (req, res) => {
    const { name, taille, username, usertoken } = req.body;
    if (!name || !taille) return res.status(400).send("Nom ou taille du groupe manquants");

    let groupes = readGroupes();
    let users = readUsers();
    let currentUser;

    // Chercher l'utilisateur correspondant au token
    for (let user of users) {
        if (user.username === username && user.token === usertoken) {
            currentUser = user;
            break;
        }
    }

    // Si l'utilisateur n'est pas trouvé, renvoie une erreur
    if (!currentUser) return res.status(404).send("Utilisateur non trouvé");

    // Supprime l'utilisateur de tout groupe actuel
    groupes = LeavesGroupe(currentUser.username, groupes);
    writeGroupes(groupes);

    // Vérifie si le groupe existe déjà
    let groupeExist = groupes.find(g => g.name === name);

    if (!groupeExist) {
        // Si le groupe n'existe pas, crée un nouveau groupe
        const newGroupe = {
            name,
            taille,
            admin: currentUser.username,  // Utiliser currentUser.username pour admin
            membres: [currentUser.username],  // Ajoute l'utilisateur comme membre
        };
        groupes.push(newGroupe);
        writeGroupes(groupes);

        return res.send("Groupe créé et vous avez été ajouté en tant que membre.");
    } else {
        // Si le groupe existe, ajoute simplement l'utilisateur au groupe en tant que membre
        if (!groupeExist.membres.includes(currentUser.username)) {
            groupeExist.membres.push(currentUser.username);
            writeGroupes(groupes);
            return res.send("Vous avez rejoint le groupe.");
        } else {
            return res.send("Vous faites déjà partie de ce groupe.");
        }
    }
});




module.exports = groupe;
