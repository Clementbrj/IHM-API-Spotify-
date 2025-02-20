const { app, SECRET_KEY } = require('../server');
const querystring = require('querystring');
const axios = require('axios');

let accessToken = "";
let refreshToken = "";

let tokenExpirationTime = 0;

/* ------------------------------------
        SPOTIFY Premiere Connexion
   ------------------------------------ */

// Mettre les bons Identifiants Spotify Developper !!!
const client_id = 'd51627c0ad584ed2a2188a5c1ec3389d';
const client_secret = 'b2ad906b549c451198445e6a15cbab9c';
const redirect_uri = 'http://localhost:3000/spotify/callback';

// Fonction pour générer une chaîne aléatoire (Authorization code)
function generateRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// Route pour se connecter à Spotify avec google..
app.get('/spotify/connexion', (req, res) => {
    var state = generateRandomString(16);
    const scope = 'user-read-recently-played user-read-private user-library-read';

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

// Route de callback pour avoir le token & l'username
app.get('/spotify/callback', async (req, res) => {
    const code = req.query.code || null;
    var state = req.query.state || null;
    let returnjson = [];

    if (!code) {
        return res.status(400).json({ error: "Code d'autorisation manquant" });
    }

    if (state === null) {
        return res.status(400).redirect('/#' + querystring.stringify({ error: "State manquant" }));
    }

    // try pour avoir le token
    try {
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

        accessToken = tokenresponse.data.access_token;
        refreshToken = tokenresponse.data.refresh_token;
        tokenExpirationTime = new Date().getTime() + (tokenresponse.data.expires_in * 1000); //Initier l'expiration du premier token [!]

        returnjson[0] = "TOKEN : " + tokenresponse.data.access_token;

        // try pour avoir l'username
        try {
            const usernameresponse = await axios.get('https://api.spotify.com/v1/me', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            returnjson[1] = "USERNAME : " + usernameresponse.data.display_name;
            return res.status(200).json(returnjson);
        } catch (error) {
            return res.status(500).json({ error: "Erreur lors de l'obtention du username spotify" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Erreur lors de l'obtention du token" });
    }
});

/* ------------------------------------
        SPOTIFY en cours d'utilisation
   ------------------------------------ */

// Checker l'heure actuel VS l'heurese d'expiration
const checkTokenValidity = async (req, res, next) => {
    const currentTime = new Date().getTime();

    // Vérifiez si le token est expiré (date d'expiration implémenter dans le callback)
    if (currentTime >= tokenExpirationTime) {
        try {
            const response = await refreshAccessToken();
            accessToken = response.data.access_token;
            tokenExpirationTime = currentTime + (response.data.expires_in * 1000);
        } catch (error) {
            return res.status(500).json({ error: "Erreur lors du rafraîchissement du token" });
        }
    }
    req.accessToken = accessToken;
    next();
};

// Générer un nouveau token si expiration
const refreshAccessToken = async () => {
    const url = "https://accounts.spotify.com/api/token";
    try {
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
        return response;
    } catch (error) {
        throw new Error("Erreur lors du rafraîchissement du token");
    }
};



// Route pour récupérer les titres liker
app.get('/spotify/ShowLiked', checkTokenValidity, async (req, res) => {
    res.json("Oéoé-oé");
});
