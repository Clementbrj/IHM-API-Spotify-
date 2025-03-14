const axios = require('axios');


// Obtenir la lecture actuelle de Spotify
const getCurrentPlayback = async (accessToken) => {
    const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data;
};

// Obtenir les appareils actifs sur Spotify
const getActiveDevices = async (accessToken) => {
    const response = await axios.get('https://api.spotify.com/v1/me/player/devices', {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data.devices;
};

// Synchroniser la lecture Spotify sur un appareil précis
async function syncPlayback(accessToken, trackUri, positionMs, deviceId) {
    const response = await axios.put(`https://api.spotify.com/v1/me/player/play`, {
        uris: [trackUri],
        position_ms: positionMs
    }, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        params: {
            device_id: deviceId
        }
    });
    return response.data;
}

module.exports = { getCurrentPlayback, getActiveDevices, syncPlayback };
