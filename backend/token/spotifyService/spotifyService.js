const axios = require('axios');


const SPOTIFY_TOKEN = "ton_token_spotify";

// Obtenir la lecture actuelle de Spotify
const getCurrentPlayback = async () => {
    const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { Authorization: `Bearer ${SPOTIFY_TOKEN}` }
    });
    return response.data;
};

// Obtenir les appareils actifs sur Spotify
const getActiveDevices = async () => {
    const response = await axios.get('https://api.spotify.com/v1/me/player/devices', {
        headers: { Authorization: `Bearer ${SPOTIFY_TOKEN}` }
    });
    return response.data.devices;
};

// Synchroniser la lecture Spotify sur un appareil précis
const syncPlayback = async (uri, positionMs, deviceId) => {
    await axios.put('https://api.spotify.com/v1/me/player/play', {
        uris: [trackUri],
        position_ms: positionMs
    }, {
        params: { device_id: deviceId },
        headers: { Authorization: `Bearer ${SPOTIFY_TOKEN}` }
    });
};

module.exports = { getCurrentPlayback, getActiveDevices, syncPlayback };
