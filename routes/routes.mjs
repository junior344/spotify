import AppController from '../controller/login.controller.mjs';
import express from 'express';
const app = express();
// Middleware pour servir les fichiers statiques
app.get('/login', AppController.loginController);
// Route pour démarrer la connexion
// Callback Spotify
app.get('/callback', AppController.accessToken);
// Route pour obtenir le token d'accès
app.get('/access', AppController.fetchToken);
// Route pour obtenir les données du topAlbum
app.get('/TopAlbums', AppController.topAlbums);
// Route pour obtenir les données du topTracks
app.get('/TopTracks', AppController.topTracks);
// Route pour obtenir les données du playList
app.get('/playList', AppController.playList);
export default app;
