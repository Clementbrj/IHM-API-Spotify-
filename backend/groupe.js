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
const LeavesGroupe = (username, groupes) => {
    if (!Array.isArray(groupes)) {
        console.error("Erreur : 'groupes' doit être un tableau.");
        return [];  // Retourne un tableau vide pour éviter l'erreur
    }

    return groupes.map(group => {
        // Vérification de la structure du groupe
        if (!group || !group.membres || !Array.isArray(group.membres)) {
            console.warn(`Le groupe ${group ? group.name : "inconnu"} a une structure invalide.`);
            return null;  // Retourne null pour les groupes invalides
        }

        if (group.membres.includes(username)) {
            group.membres = group.membres.filter(member => member !== username);

            // Si l'utilisateur était admin, désigner un nouvel admin
            if (group.admin === username) {
                if (group.membres.length > 0) {
                    group.admin = group.membres[0];
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
 * /groupes:
 *   get:
 *     summary: Récupérer la liste des groupes
 *     tags: [Groupes]
 *     responses:
 *       200:
 *         description: Succès - Retourne la liste des groupes avec leur nom et le nombre de membres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nameGroupe:
 *                     type: string
 *                     description: Nom du groupe
 *                     example: "Les Devs"
 *                   nombreMembres:
 *                     type: integer
 *                     description: Nombre d'utilisateurs dans le groupe
 *                     example: 5
 *       500:
 *         description: Erreur serveur
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Erreur interne du serveur"
 */
//liste des groupes et de leur nombres
groupe.get("/groupes", (req, res) => {
    let groupes = readGroupes();

    const groupesFormates = groupes.map(groupe => ({
        nameGroupe: groupe.nameGroupe,
        nombreMembres: groupe.membres.length
    }));

    res.json(groupesFormates);
});


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
    const { nameGroupe, taille, name } = req.body;
    if (!nameGroupe || !taille) return res.status(400).send("Nom ou taille du groupe manquants");

    let groupes = readGroupes();
    let users = readUsers();
    let currentUser = users.find(user => user.name === name);


    // Si l'utilisateur n'est pas trouvé, renvoie une erreur
    if (!currentUser) return res.status(404).send("Utilisateur non trouvé");

    // Supprime l'utilisateur de tout groupe actuel
    groupes = LeavesGroupe(currentUser.name, groupes);

    // Vérifie si le groupe existe déjà
    let groupeExist = groupes.find(g => g.nameGroupe === nameGroupe);

    if (!groupeExist) {
        // Si le groupe n'existe pas, crée un nouveau groupe
        const newGroupe = {
            nameGroupe,
            taille,
            admin: currentUser.name,  // Utiliser currentUser.username pour admin
            membres: [currentUser.name],  // Ajoute l'utilisateur comme membre
        };
        groupes.push(newGroupe);
        writeGroupes(groupes);
        return res.send("Groupe créé et vous avez été ajouté en tant que membre.");
    } else {
        // Si le groupe existe, on garde l'admin d'origine
        if (!groupeExist.membres.includes(currentUser.name)) {
            groupeExist.membres.push(currentUser.name);
        }

        writeGroupes(groupes);
        return res.send("Vous avez rejoint le groupe.");
    }
});




module.exports = groupe;
