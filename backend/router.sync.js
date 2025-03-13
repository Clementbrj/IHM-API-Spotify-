const express = require('express');
const router = express.Router();

const { authenticateSpotify } = require('./middleware/authSpotify');
const { getCurrentPlayback, getActiveDevices, syncPlayback } = require('./token/spotifyService/spotifyService');

router.post('/sync', authenticateSpotify, async (req, res) => {
    try {
        console.log('🔄 Synchronisation en cours...');

        const playback = await getCurrentPlayback();
        if (!playback || !playback.item) {
            return res.status(400).json({ error: 'Aucune musique en cours de lecture' });
        }

        const trackUri = playback.item.uri;
        const positionMs = playback.progress_ms;

        const devices = await getActiveDevices();
        if (devices.length === 0) {
            return res.status(400).json({ error: 'Aucun appareil actif trouvé' });
        }

        await Promise.all(devices.map(device => {
            console.log(`📱 Sync sur : ${device.name}`);
            return syncPlayback(trackUri, positionMs, device.id);
        }));

        res.status(200).json({ message: 'Synchronisation réussie' });
    } catch (error) {
        console.error('❌ Erreur lors de la synchronisation :', error.message);
        res.status(500).json({ error: 'Erreur lors de la synchronisation' });
    }
});

module.exports = router;
