const { app, SECRET_KEY } = require('../server');
const querystring = require('querystring');
const axios = require('axios');

/* ------------------
        SPOTIFY
   ------------------ */

// Client Spotify
const client_id = 'd51627c0ad584ed2a2188a5c1ec3389d';
const client_secret = 'b2ad906b549c451198445e6a15cbab9c';
const redirect_uri = 'http://localhost:3000/spotify/callback';

// Fonction pour générer une chaîne aléatoire
function generateRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// Etape 1 Authorization code -------------------------------------------------------------------
// Route pour se connecter à Spotify 
app.get('/spotify/connexion', (req, res) => {
    var state = generateRandomString(16);
    const scope = 'user-read-recently-played';

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});




// Etape 2 Authorization code -------------------------------------------------------------------
// Route de callback
app.get('/spotify/callback', async (req, res) => { // Async pour utiliser Axios
    const code = req.query.code || null;
    var state = req.query.state || null;

    if (!code) {
        return res.status(400).json({ error: "Code d'autorisation manquant" });
    }

    if (state === null) {
        return res.redirect('/#' +querystring.stringify({error: "State manquant"}));
    }

    const authOptions = {
        url: 'https://accounts.spotify.com/api/token', // URL de l'API de Spotify pour récupérer le token
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
        },
        data: querystring.stringify({ // Données à envoyer dans le corps de la requête
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        })
    };

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
            }
        });
    
        console.log("Token reçu:", response.data);
        return res.json({ message: "Token valide", access_token: response.data.access_token });
    } catch (error) {
        console.error("Erreur détaillée:", error.response?.data || error.message);
        return res.status(500).json({ error: "Erreur lors de l'obtention du token" });
    }
});
