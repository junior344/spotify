interface Artist {
  external_urls: { spotify: string };
  followers: { total: number };
  genres: string[];
  images: { url: string }[];
  name: string;
}

// Fonction pour récupérer les données de l'utilisateur
function getMyData() {
  showLoader();
  fetch('/access') // Appelle la route exposée par le backend
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      hideLoader();
      return response.json(); // Parse les données en JSON
    })
    .then((data) => {
      const {topAlbum,topTracks, topArtists, user, playList } = data;
      const head = document.querySelector('.head');
      if (head){
        head.innerHTML = `
        <h1>Welcome,<span> ${user.display_name || 'User'} </span> </h1>
         <div class="menu-burger">☰</div>
        <div class="links">
          <nav>
              <li><a href="#" class="active">TopArtists</a></li>
              <li><a href="TopAlbums">TopAlbums</a></li>
              <li><a href="#">TopTracks</a></li>
              <li><a href="#">Playlists</a></li>
          </nav>
          <a href= ${user.external_urls.spotify}><img src="${user.images[0]?.url || ''}" alt="Profile Image" width="150"></a>
        </div>
        `;
      }

      
      
      displayArtists(topArtists); // Affiche les artistes
      albumsData = topAlbum; // Stocke les données des albums
      displayAlbums(currentPage,user); // Affiche les albums
      handlePagination(); // Gère la pagination
      tracksData = topTracks; // Stocke les données des albums
      displayTracks(currentPage, user); // Affiche les pistes
      handlePaginationTracks(); // Gère la pagination
      showPlaylist(playList); // Affiche les playlists
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
    });
}

// Appel de la fonction pour récupérer les données



function displayArtists(artists: Artist[]): void {
  const gridContainer = document.querySelector(".artist-grid");

  artists.forEach((artist: Artist) => {
    // Création de la carte pour chaque artiste
    const card = document.createElement("div");
    card.classList.add("card");

    // Image de l'artiste
    const imageUrl = artist.images && artist.images.length > 0 ? artist.images[0].url : 'default-image-url.jpg'; // Utiliser une image par défaut si vide
    const artistGenres = artist.genres && artist.genres.length > 0 ? artist.genres : ['Genre inconnu']; // Genre par défaut si vide
    const img = document.createElement("img");
    img.src = artist.images[0].url;
    img.height = 200;
    img.alt = artist.name;

    // Corps de la carte
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    // Nom de l'artiste
    const name = document.createElement("h3");
    name.textContent = artist.name;

    // Liste des genres
    const genresList = document.createElement("ul");
    genresList.classList.add("genres");
    artist.genres.forEach((genre: string) => {
      const genreItem = document.createElement("li");
      genreItem.textContent = genre === "" ? "Genre inconnu" : genre;
      genresList.appendChild(genreItem);
    });

    // Nombre de followers
    const followers = document.createElement("div");
    followers.classList.add("followers");
    followers.textContent = `Followers: ${artist.followers.total.toLocaleString()}`;

    // Lien vers le profil Spotify
    const profileLink = document.createElement("a");
    profileLink.href = artist.external_urls.spotify ;
    profileLink.target = "_blank";
    profileLink.textContent = "Voir le profil";

    // Ajout des éléments au corps de la carte
    cardBody.appendChild(name);
    cardBody.appendChild(genresList);
    cardBody.appendChild(followers);
    cardBody.appendChild(profileLink);

    // Ajout de l'image et du corps de la carte à la carte
    card.appendChild(img);
    card.appendChild(cardBody);

    // Ajout de la carte à la grille
    gridContainer?.appendChild(card);
  });
}

let currentPage = 1;
const albumsPerPage = 5;
const tracksPerPage = 5;
interface Album {
  artists: string[];
  name: string;
  external_urls: { spotify: string };
  images: { url: string }[];
  release_date: string;
  total_tracks: number;
}
interface User {
  display_name: string;
  images: { url: string }[];
  external_urls: { spotify: string };
}

interface Track {
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  duration_ms: number;
  external_urls: { spotify: string };
}
let albumsData: Album[] = [];
let tracksData: Track[] = [];

function displayAlbums(page: number,user?: User): void {
  const startIndex = (page - 1) * albumsPerPage;
  const endIndex = startIndex + albumsPerPage;
  const albumsToDisplay = albumsData.slice(startIndex, endIndex);

  const albumContainer = document.querySelector('.album-container');
  // if (albumContainer) {
  //   albumContainer.innerHTML = ''; // Réinitialiser le contenu
  // }
  const head = document.querySelector('.head');
  if (head){
    head.innerHTML = `
    <h1>Welcome,<span> ${user?.display_name || 'User'} </span> </h1>
     <div class="menu-burger">☰</div>
    <div class="links">
      <nav>
          <li><a href="/login" class="active">TopArtists</a></li>
          <li><a href="TopAlbums">TopAlbums</a></li>
          <li><a href="/Toptracks">TopTracks</a></li>
          <li><a href="/playList">Playlists</a></li>
      </nav>
      
    </div>
    `;
  }

  
  albumsToDisplay.forEach((album, index) => {
    const albumElement = document.createElement('div');
    albumElement.classList.add('album');
    
    albumElement.innerHTML = `
       <h3>${startIndex + index + 1}. ${album.name}</h3>
      
      <a href="${album.external_urls.spotify}" target="_blank">
        <img src="${album.images[1].url}" alt="${album.name}" />
      </a>
      <p>Release Date: ${album.release_date}</p>
      <p>Total Tracks: ${album.total_tracks}</p>
    `;
    
    albumContainer?.appendChild(albumElement);
  });
}

function handlePagination() {
  const prevButton = document.querySelector('.prev-page');
  const nextButton = document.querySelector('.next-page');
  
  if (prevButton) {
    (prevButton as HTMLButtonElement).disabled = currentPage === 1;
  }
  if (nextButton) {
    (nextButton as HTMLButtonElement).disabled = currentPage * albumsPerPage >= albumsData.length;
  }

  prevButton?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      displayAlbums(currentPage);
    }
  });

  nextButton?.addEventListener('click', () => {
    if (currentPage * albumsPerPage < albumsData.length) {
      currentPage++;
      console.log("currentPage album", currentPage);
      displayAlbums(currentPage);
    }
  });
}

function displayTracks(page: number, user?: User): void {
  const startIndexTrack = (page - 1) * tracksPerPage;
  console.log("startIndexTrack -1", page);
  const endIndex = startIndexTrack + tracksPerPage;
  const tracksToDisplay = tracksData.slice(startIndexTrack, endIndex);
  const head = document.querySelector('.head');
  if (head){
    head.innerHTML = `
    <h1>Welcome,<span> ${user?.display_name || 'User'} </span> </h1>
     <div class="menu-burger">☰</div>
    <div class="links">
      <nav>
          <li><a href="/login" class="active">TopArtists</a></li>
          <li><a href="TopAlbums">TopAlbums</a></li>
          <li><a href="/Toptracks">TopTracks</a></li>
          <li><a href="/playList">Playlists</a></li>
      </nav>
      <img src="${user?.images[0]?.url || ''}" alt="Profile Image" width="150">
    </div>
    `;
  }
  const trackContainer = document.querySelector('.track-container');
  // if (trackContainer) {
  //   trackContainer.innerHTML = ''; // Réinitialiser le contenu
  // }

  tracksToDisplay.forEach((track, index) => {
    const trackElement = document.createElement('div');
    trackElement.classList.add('track');
    console.log("startIndexTrack -2", startIndexTrack); 
    trackElement.innerHTML = `
      <h3> ${startIndexTrack + index + 1}. ${track.name}</h3>
      <p>Artist: ${track.artists.map(artist => artist.name).join(', ')}</p>
      <a href="${track.external_urls.spotify}" target="_blank">
        <img src="${track.album.images[1].url}" alt="${track.name}" />
      </a>
      <p>Album: ${track.album.name}</p>
    `;
    trackContainer?.appendChild(trackElement);
  });
}

function handlePaginationTracks() {
  const prevButton = document.querySelector('.prev-page');
  const nextButtonTrack = document.querySelector('.next-page-track');
  
  if (prevButton) {
    (prevButton as HTMLButtonElement).disabled = currentPage === 1;
  }
  if (nextButtonTrack ) {
    (nextButtonTrack  as HTMLButtonElement).disabled = currentPage * tracksPerPage >= tracksData.length;
  }

  prevButton?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      displayTracks(currentPage);
    }
  });

  nextButtonTrack ?.addEventListener('click', () => {
    if (currentPage * tracksPerPage < tracksData.length) {
      console.log("currentPage track", currentPage);
      currentPage++;
      console.log("currentPage track --2", currentPage);
      displayTracks(currentPage);
    }
  });
}

// show playlist
interface PlaylistItem {
  uri: string;
  name: string;
  // Add other properties if necessary
}

function showPlaylist(playList: PlaylistItem[]) {
  const playlistContainer = document.querySelector('.playlist-container') as HTMLElement;
  const embedIframe = document.getElementById('embed-iframe') as HTMLElement;

  if (!embedIframe || !playlistContainer) {
    console.error('Required DOM elements are missing.', { embedIframe, playlistContainer });
    return;
  }

  // Générer les boutons pour chaque playlist
  playList.forEach((playlist) => {
    if(playlist !== null && playlist !== undefined){
      const button = document.createElement('button');
      button.textContent = playlist.name;
      button.classList.add('playlist-button');
      button.dataset.spotifyId = playlist.uri;
      playlistContainer.appendChild(button);
    }
  });

  // Définir les options par défaut pour le lecteur IFrame
  const options = {
    width: '100%',
    height: '500',
    uri: playList[0].uri, // Charger la première playlist par défaut
  };

  // Créer le lecteur une fois l'API Spotify IFrame prête
  window.onSpotifyIframeApiReady = (IFrameAPI:any) => {
    console.log('Spotify IFrame API ready');
    const callback = (EmbedController: any) => {
      document.querySelectorAll('.playlist-button').forEach((button) => {
        console.log("button", button);
        button.addEventListener('click', () => {
          const spotifyUri = (button as HTMLButtonElement).dataset.spotifyId;
          if (spotifyUri) {
            EmbedController.loadUri(spotifyUri);
          }
        });
      });
    };

    IFrameAPI.createController(embedIframe, options, callback);
  };
}
declare global {
  interface Window {
    onSpotifyIframeApiReady?: (IFrameAPI: any) => void;
  }
}

function showLoader() {
  document.getElementById("loader")?.classList.remove("hidden");
}

function hideLoader() {
  document.getElementById("loader")?.classList.add("hidden");
}



getMyData();