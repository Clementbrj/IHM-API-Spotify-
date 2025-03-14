// ✅ Correction précise


const authenticateSpotify = async (req, res, next) => {
    try {
        // Si le token est absent ou a expiré → Rafraîchir le token
        if (!spotify.accessToken) {
            console.log('🔄 Rafraîchissement du token Spotify...');
            await refreshAccessToken();
        }

        // Ajout du token dans le header de la requête
        req.headers['Authorization'] = `Bearer ${spotify.accessToken}`;
        next(); // Passe à la suite (exécute la requête suivante)
    } catch (error) {
        console.error('❌ Erreur d\'authentification Spotify:', error.message);
        res.status(401).json({ error: 'Erreur d\'authentification Spotify' });
    }
};

module.exports = { authenticateSpotify };
