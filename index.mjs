import express from 'express';
import AppRoutes from './routes/routes.mjs';
import SpotifyWebApi from 'spotify-web-api-node';
import fileUpload from 'express-fileupload';
import session from 'express-session';
;
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
// import Redis from 'connect-redis';
dotenv.config();
const port = process.env.PORT || 3000;
const app = express();
app.use(express.urlencoded({ extended: true })); //
app.use(express.json());
app.use(fileUpload());
app.use(express.static('public'));
app.set('trust proxy', 1); // trust first proxy
// const RedisStore = Redis(session);
app.use(session({
    store: new session.MemoryStore(),
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'development' } // secure: true pour HTTPS
}));
// Obtenir le chemin du fichier courant
const __filename = fileURLToPath(import.meta.url);
// Obtenir le répertoire courant
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));
// Middleware pour servir les fichiers statiques
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
});
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});
// Middleware pour s'assurer que l'utilisateur est authentifié
app.get('/', (req, res) => {
    res.redirect('/index');
});
app.use('/', AppRoutes);
app.use((req, res) => {
    res.status(404).send('404 Not Found');
});
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
