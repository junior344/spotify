# Spotify Integration Project

## Description
Ce projet est une application web intégrée avec l'API Spotify. Il permet aux utilisateurs de se connecter avec leur compte Spotify, d'obtenir des informations sur leurs albums, pistes et artistes préférés, ainsi que leurs playlists.

## Fonctionnalités
- Connexion avec Spotify
- Récupération du token d'accès
- Affichage des albums, pistes et artistes préférés
- Affichage des playlists de l'utilisateur

## Prérequis
- Node.js
- npm (Node Package Manager)
- Compte Spotify Developer

## Installation
1. Clonez le dépôt :
    ```bash
    git clone https://github.com/votre-utilisateur/spotify-integration.git
    cd SPOTIFY
    ```

2. Installez les dépendances :
    ```bash
    npm install
    ```

3. Créez un fichier `.env` à la racine du projet et ajoutez vos identifiants Spotify :
    ```env
    CLIENT_ID=your_spotify_client_id
    CLIENT_SECRET=your_spotify_client_secret
    REDIRECT_URI=your_redirect_uri
    SESSION_SECRET=your_session_secret
    ```

## Utilisation
1. Démarrez le serveur :
    ```bash
    npm start
    ```

2. Ouvrez votre navigateur et accédez à `http://localhost:3000`.

## Structure du Projet
- `index.mts` : Point d'entrée principal de l'application.
- `routes/routes.mts` : Définit les routes de l'application.
- `controller/login.controller.mts` : Contient la logique de connexion et de récupération des données Spotify.
- `models/CustomRequest.ts` : Définit une interface personnalisée pour les requêtes Express.

## Routes
- `GET /login` : Démarre le processus de connexion avec Spotify.
- `GET /callback` : Callback pour la redirection après l'authentification Spotify.
- `GET /access` : Récupère le token d'accès et les données utilisateur.
- `GET /TopAlbums` : Affiche les albums préférés de l'utilisateur.
- `GET /TopTracks` : Affiche les pistes préférées de l'utilisateur.
- `GET /playList` : Affiche les playlists de l'utilisateur.

## Dépendances
- `express` : Framework web pour Node.js.
- `spotify-web-api-node` : Client pour l'API Spotify.
- `express-session` : Middleware pour la gestion des sessions.
- `express-fileupload` : Middleware pour le téléchargement de fichiers.
- `dotenv` : Charge les variables d'environnement à partir d'un fichier `.env`.

## Contribution
Les contributions sont les bienvenues ! Veuillez soumettre une pull request ou ouvrir une issue pour discuter des changements que vous souhaitez apporter.

## Licence
Ce projet est sous licence MIT. Voir le fichier [LICENSE](Copyright 2024 josias

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
) pour plus de détails.

## Auteurs
- [Votre Nom](https://www.linkedin.com/in/josias-mbogle/)
