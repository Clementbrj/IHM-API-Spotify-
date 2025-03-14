
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

module.exports = { authenticateSpotify };
