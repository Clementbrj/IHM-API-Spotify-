    const { app, SECRET_KEY } = require('../server');
    const querystring = require('querystring');
    const axios = require('axios');
    require('dotenv').config();

    let accessToken = "";
    let refreshToken = "";

    // TOKEN EXPIRATION TIME A PASSER EN DONNER BDD POUR QUE SA DEPENDE DE L USER
    let tokenExpirationTime = 0;

    /* ------------------------------------
            SPOTIFY Premiere Connexion
    ------------------------------------ */

    // Mettre les bons Identifiants Spotify Developper !!!
    const client_id = process.env.client_idENV;
    const client_secret = process.env.client_secretENV;
    const redirect_uri = process.env.redirect_uriENV;

    // Fonction pour générer une chaîne aléatoire (Authorization code)---------------
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
        const scope = process.env.scopeENV;

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
    // -------------- Header token mehdi

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
            tokenExpirationTime = new Date().getTime() + (tokenresponse.data.expires_in * 1000); // A MODIFIER pour stocker en bdd


            // Stocket le token Spotify selon le token api mehdi
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

    // Checker l'heure actuel VS l'heurese d'expiration )---------------
    const checkTokenValidity = async (req, res, next) => {
        const currentTime = new Date().getTime();

        // Vérifiez si le token est expiré (date d'expiration implémenter dans le callback)
        if (currentTime >= tokenExpirationTime) {
            try {
                const response = await refreshAccessToken();
                accessToken = response.data.access_token;
                tokenExpirationTime = currentTime + (response.data.expires_in * 1000); // A MODIFIER POUR METTRE EN BDD
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
    getlike = () => {
        // Récupérer l'AT token spotify depuis l'user token en entrée de la route

        const SpotifyToken = accessToken;
        checkTokenValidity(accessToken);

        return tokenExpirationTime;
    }


    app.get('/spotify/ShowLiked', async (req, res) => {
        console.log("tt" + accessToken);
        // header tokenapi
        //const TokenSpotify = getlike();
        
        try {
            const response = await axios.get('https://api.spotify.com/v1/me/tracks', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                params: {
                    limit: 20,
                }
            });

            const tracklist = response.data;
            return res.status(200).json(tracklist);
        } catch (error) {
            console.error("Erreur lors de la récupération des titres likés :", error);
            if (error.response) {
                // La requête a été faite et le serveur a répondu avec un code de statut en dehors de la plage 2xx
                return res.status(error.response.status).json({ error: error.response.data });
            } else if (error.request) {
                // La requête a été faite mais aucune réponse n'a été reçue
                return res.status(503).json({ error: "Service indisponible" });
            } else {
                // Quelque chose s'est produit lors de la configuration de la requête qui a déclenché une erreur
                return res.status(500).json({ error: "Erreur interne du serveur" });
            }
        }
    });


    // AT spotify a stock dans .json
    // 

    //mettre dans le ENV client id client secret et scope spotify


    /*
    ToDo List : 
    Mettre les variables sensibles dans le .env FAIT

    enregistrer l'accesstoken dans la BDD et non dans une variable globale
    mettre à jour l'accesstoken dans la bdd et non dans la variable globale
    enregistrer et mettre à jour l'expiration du token dans la bdd
    tester tracklist
    tester refreshtoken
    */