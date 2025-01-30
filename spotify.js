const { app, SECRET_KEY } = require('./index');
const querystring = require('querystring');
console.log("test");

/* ------------------
        SPOTIFY
   ------------------ */

// Client Spotify
const client_id = 'd51627c0ad584ed2a2188a5c1ec3389d'; // Remplace avec ton client_id
const client_secret = 'b2ad906b549c451198445e6a15cbab9c'; // Remplace avec ton client_secret


// Fonction pour générer une chaîne aléatoire
function generateRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// Route par défaut
app.get('/', (req, res) => {
    res.json("Bienvenue");
});


//Etape 1 Authorization code -------------------------------------------------------------------
// Route pour se connecter à Spotify 
app.get('/spotify/connexion', (req, res) => {
    var state = generateRandomString(16);
    const scope = 'user-read-recently-played';
    redirect_uri = 'http://localhost:3000/spotify/callback';

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
console.log(req.query.state);
    if (state === null) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'State mal généré'
            }));
    } else {
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token', // URL de l'API de Spotify pour récupérer le token
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            data: querystring.stringify({ // Données à envoyer dans le corps de la requête
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            })

        };
// console.log("Authorization Header:", 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')));

        try {
            // Envoi de la requête POST pour obtenir l'access_token
            const response = await axios.post(authOptions.url, authOptions.data, { headers: authOptions.headers });
            // Récupérer l'access_token de la réponse
            const access_token = response.data.access_token;
            console.log("Authorization Header:", req.headers['authorization'] ,access_token);

            if (!access_token) {
                return res.json("Invalid Token");
            } else {
                return res.json("Token valide : " + access_token);
            }
        } catch (error) {
            console.error("Erreur lors de l'authentification Spotify:", error.response?.data || error.message);
            return res.status(500).json({ error: "Erreur lors de l'obtention du token" });
        }
    }
});
