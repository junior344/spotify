
import SpotifyWebApi from 'spotify-web-api-node';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import  CustomRequest  from '../models/CustomRequest';
import catchAsync from '../helpers/isAutho'; 

import scopes from '../model/model.mjs';
console.log(process.env.REDIRECT_URL);
dotenv.config();
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
});
interface AlbumPlayCount {
  album: SpotifyApi.AlbumObjectSimplified;
  count: number;
}
export const loginController = (async (req: Request, res: Response) => {
  const state = 'some-state-of-my-choice'; // You can generate a random state string here
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  res.redirect(authorizeURL);
});

export const accessToken = (async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const state = req.query.state as string;
  (req as CustomRequest).session.state = state;
  const stateUser = (req as CustomRequest).session.state;

  if (state !== stateUser) {
    console.error('State mismatch:', state, stateUser);
    res.redirect('/error.html');
    return;
  }

  console.log('Retrieving access token');
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const access_token = data.body['access_token'];
    const refresh_token = data.body['refresh_token'];
    const expires_in = data.body['expires_in'];

    (req as CustomRequest).session.access_token = access_token;
    (req as CustomRequest).session.refresh_token = refresh_token;

    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);
    res.redirect('/access.html');
  } catch (err) {
    console.error('Error during token retrieval:', err);
    res.redirect('/error.html');
  }
});

export const fetchToken = async (req: Request, res: Response) => {
  // console.log('Fetching token');
  // spotifyApi.setAccessToken((req as CustomRequest).session.access_token as string);
  try {
    // Obtenir les données utilisateur (information de l'utilisateur connecté)
    const me = await spotifyApi.getMe();

    // Obtenir les top tracks
    const topTracksData = await spotifyApi.getMyTopTracks({ limit: 50 });
    const TopTracksFilter = topTracksData.body.items.filter((item: SpotifyApi.TrackObjectFull) => item.type === 'track');
    // Récupérer les pistes
    const tracks = topTracksData.body.items;

    // Regrouper les pistes par album et calculer le nombre de lectures
    const albumPlayCounts: { [key: string]: AlbumPlayCount } = tracks.reduce((acc: { [key: string]: AlbumPlayCount }, track: SpotifyApi.TrackObjectFull) => {
      const albumId = track.album.id; // Utiliser l'ID de l'album pour éviter les doublons

      if (!acc[albumId]) {
        acc[albumId] = {
          album: track.album,
          count: 0,
        };
      }
      acc[albumId].count += 1; // Incrémenter le nombre de lectures pour chaque album

      return acc;
    }, {} as { [key: string]: AlbumPlayCount });

    // Extraire les albums uniques
    const uniqueAlbums = Object.values(albumPlayCounts).map(item => item.album);

    // Filtrer les albums pour ne garder que ceux avec un nombre de pistes >= 10
    const filteredAlbums = uniqueAlbums.filter(album => album && album.total_tracks >= 10);

    // Obtenir les top artists
    const topArtists = await spotifyApi.getMyTopArtists();
    
    // Obtenir les playlists
    const playListResponse = await spotifyApi.getUserPlaylists(me.body.id);

    // Obtenir les playlist
    const playLists = playListResponse.body.items;
    
    
    // console.log("playlist", JSON.stringify(playlistsWithTracks, null, 2));
    // fs.writeFileSync(path.join('public', 'playList.json'), JSON.stringify(playlistsWithTracks, null, 2));
    // Préparer la réponse avec les données souhaitées
    const result = {
      topAlbum: filteredAlbums,
      user: me.body,
      topTracks: TopTracksFilter,
      topArtists: topArtists.body.items,
      playList: playLists
    };

    // Renvoie les données utilisateur au client
    res.json(result);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};

export const topAlbums =  (async  (req: Request, res: Response) => {
  try {
    res.redirect('/TopAlbums.html');
  } catch (error) {
    console.error('Error fetching user data:', error);
    // res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

export const topTracks =  async   (req: Request, res: Response) => {
  try {
    res.redirect('/tracks.html');
  } catch (error) {
    console.error('Error fetching user data:', error);
    //res.status(500).json({ error: 'Failed to fetch user data' });
  }
};

export const playList =  async  (req: Request, res: Response) => {
  try {
    res.redirect('/playList.html');
  } catch (error) {
    console.error('Error fetching user data:', error);
    //res.status(500).json({ error: 'Failed to fetch user data' });
  }
}


export default {
  loginController,
  accessToken,
  fetchToken,
  topAlbums,
  topTracks,
  playList
}