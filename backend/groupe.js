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
    return groupes.map(group => {
        // Vérifier si group.members est défini et est bien un tableau
        if (!group.members || !Array.isArray(group.members)) {
            console.warn(`Le groupe ${group.nom} a une structure invalide.`);
            return group;
        }

        if (group.members.includes(username)) {
            group.members = group.members.filter(member => member !== username);

            // Si l'utilisateur était admin, désigner un nouvel admin
            if (group.is_admin === username) {
                if (group.members.length > 0) {
                    group.is_admin = group.members[0];
                } else {
                    return null;
                }
            }
        }
        return group;
    }).filter(group => group !== null);
};


// Route pour rejoindre ou créer un groupe
groupe.post("/groupes/join", (req, res) => {
    const {groupe, username, usertoken} = req.body;

    if (!groupe?.nom || !groupe?.taille) {
        return res.status(400).json({error: "Le nom et la taille du groupe sont requis"});
    }

    let groupes = readGroupes();
    let users = readUsers();

    let user = users.find(u => u.name === username && u.usertoken === usertoken);
    if (!user) {
        return res.status(404).json({error: "Utilisateur non trouvé"});
    }

    groupes = LeavesGroupe(username, groupes);

    let existingGroup = groupes.find(g => g.nom === groupe.nom);

    // Si le groupe n'existe pas, on le crée
    if (!existingGroup) {
        existingGroup = {
            nom: groupe.nom,
            members: [{name: username, is_admin: true}],
            taille: groupe.taille
        };
        groupes.push(existingGroup);
        user.groupe = groupe.nom
        user.is_admin = true;
    } else {
        // Vérifie si l'utilisateur est déjà membre
        if (!existingGroup.members.some(member => member.name === username)) {
            existingGroup.members.push({ name: username, is_admin: false });
        }
        user.groupe = existingGroup.nom;
    }

    // Mise à jour du groupe de l'utilisateur
    writeUsers(users);
    writeGroupes(groupes);

    console.log("Groupe mis à jour :", existingGroup);
    res.status(201).json({message: "Groupe rejoint/créé avec succès", groupe: existingGroup});
});


module.exports = groupe;
