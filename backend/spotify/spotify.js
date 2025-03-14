/*
    http://localhost:3000/spotify/connexion?username=nomUtilisateurJson
    http://localhost:3000/spotify/ShowLiked?param=nomUtilisateurJson
*/
const { app, SECRET_KEY } = require('../server');
const querystring = require('querystring');
const axios = require('axios');
const fs = require('fs');

require('dotenv').config({path: '../.env'});

    // Mettre les bons Identifiants Spotify Developper !!!
const client_id = process.env.client_idENV;
const client_secret = process.env.client_secretENV;
const redirect_uri = process.env.redirect_uriENV;



/* ------------------------------------

       Fonctions pour les routes
        
------------------------------------ */
    // Fonction pour générer une chaîne aléatoire (Authorization code)---------------
    function generateRandomString(length) {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

// Fonction pour générer une chaîne aléatoire (Authorization code)---------------
function generateRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// Checker l'heure actuel VS l'heure d'expiration  ---------------
const checkTokenValidity = async (req, res, next) => {
try {
    const currentTime = new Date().getTime();
    const username = req.query.param;

    // Charger la BDD
    let users = JSON.parse(fs.readFileSync('user.json', 'utf8'));
    const user = users.find(user => user.name === username);

    if (!user || !user.spotify_info || !user.spotify_info.refreshToken) {
        return res.status(404).json({ error: "Utilisateur ou refresh token introuvable" });
    }

    // Récupérer le token et son expiration
    let accessToken = user.spotify_info.tokenspotify;
    let tokenExpirationTime = user.spotify_info.tokenExpirationTime || 0;
    
    console.log("ATTT !",accessToken);

    if (currentTime >= tokenExpirationTime) {
        console.log("ATTT !",accessToken);
        const newAccessToken = await refreshAccessToken(user);
        if (!newAccessToken) {
            return res.status(500).json({ error: "Échec du rafraîchissement du token" });
        }
        
        accessToken = newAccessToken;
        tokenExpirationTime = currentTime + (3600 * 1000);
        user.spotify_info.tokenExpirationTime = tokenExpirationTime;

        fs.writeFileSync('user.json', JSON.stringify(users, null, 2), 'utf8');
    }

    req.accessToken = accessToken; // Stocker dans la requête pour l'utiliser après
    next();
} catch (error) {
    console.error("Erreur lors de la vérification du token :", error);
    res.status(500).json({ error: "Erreur API Spotify locale #1" });
}
};


// Générer un nouveau token si expiration
const refreshAccessToken = async (user) => {
try {
    const refreshToken = user.spotify_info.refreshToken;

    const url = "https://accounts.spotify.com/api/token";
    const response = await axios.post(url, querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: client_id,
        client_secret: client_secret
    }), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
        }
    });

    const newAccessToken = response.data.access_token;
    user.spotify_info.tokenspotify = newAccessToken;
    
    return newAccessToken;
} catch (error) {
    console.error("Erreur lors du refresh :", error);
    return null;
}
};


/* ------------------------------------

        SPOTIFY Premiere Connexion
        
------------------------------------ */



// Route pour se connecter à Spotify avec google..
app.get('/spotify/connexion', (req, res) => {
    const username = req.query.username;
    const scope = process.env.scopeENV;

    if (!username) {
        return res.status(400).json({ error: "Username Json" });
    }

    // Stocker Username Json  dans state pour récup au callback
    var state = encodeURIComponent(JSON.stringify({ username }));

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

// Route de callback pour avoir le token & l'username)---------------
app.get('/spotify/callback', async (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;

    if (!code) {
        return res.status(400).json({ error: "Code d'autorisation manquant" });
    }

    // récupère  & decode l'username JSON
    let UserNameFront;
    try {
        if (!state) throw new Error("State manquant");
        const stateData = JSON.parse(decodeURIComponent(state));
        UserNameFront = stateData.username;
    } catch (e) {
        return res.status(400).json({ error: "State invalide" });
    }

    try {
        // Token Spotify
        const tokenresponse = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
            }
        });
        const accessToken = tokenresponse.data.access_token;
        const refreshToken = tokenresponse.data.refresh_token;

        // Username Spotify
        const usernameresponse = await axios.get('https://api.spotify.com/v1/me', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const usernameSpotify = usernameresponse.data.display_name;

        // Charger la bdd
        let users = JSON.parse(fs.readFileSync('user.json', 'utf8'));
        // Trouver l'utilisateur
        const userIndex = users.findIndex(user => user.name === UserNameFront);
        if (userIndex !== -1) {
            users[userIndex].spotify_info.tokenspotify = accessToken;
            users[userIndex].spotify_info.usernamespotify = usernameSpotify;
            users[userIndex].spotify_info.refreshToken = refreshToken;
            // Sauvegarde dans `user.json`
            fs.writeFileSync('user.json', JSON.stringify(users, null, 2), 'utf8');
            return res.status(200).json("Token en place dans le json");
        } else {
            return res.status(404).json({ error: "Utilisateur non trouvé dans le json" });
        }
    } catch (error) {
        return res.status(500).json({ error});
    }
});    

/* ------------------------------------

        SPOTIFY en cours d'utilisation

------------------------------------ */

app.get('/spotify/ShowLiked', checkTokenValidity, async (req, res) => {
    try {
        const accessToken = req.accessToken;
        let MusicList = [];
        let getTracks = 'https://api.spotify.com/v1/me/tracks';
        
        // Récupérer tous les titres likés
        while (getTracks) {
            const response = await axios.get(getTracks, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
                params: { limit: 50 }
            });

            MusicList.push(...response.data.items);
            getTracks = response.data.next
        }

        if (MusicList.length === 0) {
            return res.status(200).json({ message: "Aucun titre liké trouvé" });
        }

        // Moyenne popularité & durée
        const totalPopularity = MusicList.reduce((sum, track) => sum + track.track.popularity, 0);
        const totalDuration = MusicList.reduce((sum, track) => sum + track.track.duration_ms, 0);

        const avgPopularity = totalPopularity / MusicList.length;
        const avgDurationMs = totalDuration / MusicList.length;
        const avgDurationMin = (avgDurationMs / 60000).toFixed(2); // Convertir ms → minutes

        res.status(200).json({
            NbMusic: MusicList.length,
            MoyPopularity: avgPopularity.toFixed(2),
            MoyDurationMin: avgDurationMin,
            tracks: MusicList.map(track => ({
                name: track.track.name,
                artist: track.track.artists.map(artist => artist.name).join(', '),
                popularity: track.track.popularity,
                durationMs: track.track.duration_ms
            }))
        });

        // Erreur au try
    } catch (error) {
        console.error("Erreur récup des titres :", error);
        if (error.response) {
            return res.status(error.response.status).json({ error: error.response.data });
        } else if (error.request) {
            return res.status(503).json({ error: "Problème API Spotify internet" });
        } else {
            return res.status(500).json({ error: "Erreur API Spotify locale #2" });
        }
    }
});

// Route pour créer une playlist basée sur les musiques likées
app.post('/spotify/createPlaylist', checkTokenValidity, async (req, res) => {
    console.log("User ID récupéré :", req.accessToken);
    try {
        //Récupérer les informations de l'utilisateur
        const userResponse = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${req.accessToken}`,
                "content-type": "application/json",
            }
        })

        const userId = userResponse.data.id;
        console.log("User ID récupéré :", userId, " | Type :", typeof userId);

        //Créer une playlist pour l'utilisateur
        const playlistResponse = await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            name: "mes titres préféré",
            description: "Playlist générée automatiquement avec mes musiques likées",
            public: false,
        }, {
            headers: {
                'Authorization': `Bearer ${req.accessToken}`,
                'Content-Type': 'application/json'
            }
        })
        const playlistId = playlistResponse.data.id;

        //Récupérer les titres likés
        const likedTracksResponse = await axios.get(`https://api.spotify.com/v1/me/tracks?limit=20`, {

            headers: {
                'Authorization': `Bearer ${req.accessToken}`,
            }
        })
        const trackUris = likedTracksResponse.data.items.map(item => item.track.uri)

        if (trackUris.length === 0) {
            return res.status(400).json({error: "Aucune musique likée trouvée"})
        }

        //Ajouter les musiques à la playlist
        await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            uris: trackUris,

        }, {
            headers: {
                'Authorization': `Bearer ${req.accessToken}`,
                'Content-Type': 'application/json'
            }
        })


        return res.status(200).json({message: "Playlist crée avec succès !", playlistId});
    } catch (error) {
        console.error("erreur lors de la création de la playlist", error);
        return res.status(500).json({error: "Impossible de créer la playlist"})
    }
})

const authenticateSpotify = async (req, res, next) => {
    try {
        // Vérifie que l'utilisateur est authentifié et possède un accessToken valide
        const accessToken = req.accessToken; // Assurez-vous que vous récupérez le bon token ici
        if (!accessToken) {
            console.log('🔄 Rafraîchissement du token Spotify...');
            await refreshAccessToken(); // Rafraîchir le token si nécessaire
        }
        // Passe au prochain middleware ou à la route
        next();
    } catch (error) {
        console.error('❌ Erreur d\'authentification Spotify:', error.message);
        res.status(401).json({ error: 'Erreur d\'authentification Spotify' });
    }
};


module.exports = {authenticateSpotify};

// AT spotify a stock dans .json
// 

//mettre dans le ENV client id client secret et scope spotify


/*
ToDo List : 

FAIT
Mettre les variables sensibles dans le .env 
Liaison du compte Spotify (FT-4)
Analyse des Titres Likés pour déduire la personnalité (FT-6) A traiter en front
enregistrer l'accesstoken dans la BDD et non dans une variable globale
-------------------------------------------------------------------------------------
A faire

Consultation des morceaux en cours d’écoute (FT-5)
Synchronisation musicale entre les membres d’un groupe (FT-7)
Création d’une playlist Spotify basée sur les musiques préférées d’un utilisateur (FT-8)
swagger documentation
*/