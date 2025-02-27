const express = require("express");
const fs = require("fs");
const crypto = require("crypto");

const groupe = express.Router();
const USERS_FILE = "user.json";


// Route pour la création d'un groupe
groupe.post("/groupes", (req, res) => {
    res.json("Bienvenue dans l'API");
});

module.exports = groupe;