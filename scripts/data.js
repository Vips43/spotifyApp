
let spotifyData = JSON.parse(localStorage.getItem("spotifyData")) ||
{
  categories: [], newReleases: [], searchResults: [],
  episodeDetails: [], trandings: [], shows: [], showEpisode: [], data: [], showDetail: [], artistData: []
}

function removelocal() {
  delete spotifyData.shows
  // localStorage.removeItem('spotifyData')
}
removelocal()



/* =========================================================
   SPOTIFY AUTH TOKEN
========================================================= */

let cachedToken = localStorage.getItem("spotify_token") || null;
let tokenExpiry = Number(localStorage.getItem("spotify_token_expiry")) || 0;

const clientId = `ae099a85abfd490f942ad96cecc1e3fe`;
const clientSecret = `08929370795044bb9726eccb1421c08c`;

export async function getAccessToken() {
  const now = Date.now()

  if (cachedToken && now < tokenExpiry) return cachedToken;

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization":
        "Basic " + btoa(`${clientId}:${clientSecret}`),
    },
    body: "grant_type=client_credentials",
  });
  const data = await result.json();

  cachedToken = data.access_token;
  tokenExpiry = now + data.expires_in * 1000;
  localStorage.setItem("spotify_token", cachedToken);
  localStorage.setItem("spotify_token_expiry", tokenExpiry);

  return cachedToken;
}


/* =========================================================
   SAFE FETCH HANDLER (Retries on Rate Limit) *if required*
========================================================= */
async function safeFetch(url, options) {
  let res = await fetch(url, options);
  if (res.status === 429) {
    const wait = res.headers.get("Retry-After") || 2;
    console.warn(`Rate limited. Retrying after ${wait} seconds ...`);
    await new Promise(r => setTimeout(r, wait * 1000))
    return safeFetch(url, options)
  }
  return res;
}


/* =========================================================
   SEARCH SONGS
========================================================= */
export async function searchSongs(query) {
  const token = await getAccessToken();
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track`,
    {
      headers: { "Authorization": `Bearer ${token}` }
    }
  );
  const data = await res.json();
  return data.tracks.items;
}

/* =========================================================
   NEW RELEASES
========================================================= */
export async function getNewReleases() {
  if (spotifyData.newReleases && spotifyData.newReleases.length > 0) {
    console.log('Loaded  getNewReleases from localstorage');
    return spotifyData.newReleases;
  } else {
    const token = await getAccessToken();
    const res = await fetch(`https://api.spotify.com/v1/browse/new-releases?limit=10`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    const albums = data.albums.items;
    console.log('fetched getNewReleases from API');
    spotifyData.newReleases = albums.map(r => ({
      image: r.images?.[0]?.url || "",
      name: r.name,
      artist: r.artists.map(a => a.name).join(", ")
    }));
    // SAVE IN LOCAL STORAGE
    localStorage.setItem("spotifyData", JSON.stringify(spotifyData));
    console.log('saved new releases to localstorage');
    return spotifyData.newReleases;
  }
}

/* =========================================================
   ARTIST DETAILS (MULTI ARTIST FETCH)
========================================================= */

export async function getArtistsDetails() {
  const token = await getAccessToken();
  let artistsID = ''
  let query = 'bollywood'
  if (query) {
    artistsID = spotifyData.artistData.artists.items.map(d => d.id)
    const searchArtistURI = `https://api.spotify.com/v1/search?q=${query}t&type=artist`;
    const option = { method: "GET", headers: { Authorization: `Bearer ${token}` } }
    const artistRes = await fetch(searchArtistURI, option);
    const artistData = await artistRes.json();
    spotifyData.artistData = artistData;
    saveLocalStorage("artistData");
    console.log(artistsID);
    
  } else {
    artistsID =
      ["3xjuY3FqcHemteM5aOv1LA", '3ci7qlWeEB4GT6y12tbTNO', '0Zg44YDPe3fBfHoxTA0qpD', '3ZFpN9rFHLxElJpqyABkMt', '73qNxW8UoTSftWynAEiYxA', "2NoJ7NuNs9nyj8Thoh1kbu", "7FmygnepJt3fhiZQDmoC0P", "7uIbLdzzSEqnX0Pkrb56cR", "4PULA4EFzYTrxYvOVlwpiQ"];
  }
  const ids = artistsID.join(',')
  console.log(ids);
  
  // if (spotifyData.artistsInfo && spotifyData.artistsInfo.length > 0) {
  //   const artistsInfo = spotifyData.artistsInfo;
  //   console.log('loaded artistsInfo from localStorage');
  //   return artistsInfo;
  // }
  const res = await fetch(`https://api.spotify.com/v1/artists?ids=${ids}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json();
  let artistsInfo = data.artists.map(d => ({
    id: d.id,
    name: d.name,
    image: d.images[1]?.url || d.images[0]?.url || d.images[2].url,
  }))
  console.log('me chala');
  spotifyData.artistsInfo = artistsInfo
  saveLocalStorage("artistsInfo")
  return artistsInfo;
}

/* =========================================================
   ARTIST ALBUM + TOP TRACKS
========================================================= */
function formateDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
  return `${minutes}:${seconds}`
}

export async function getArtistsAblum(id) {
  const token = await getAccessToken();
  const res = await fetch(`https://api.spotify.com/v1/artists/${id}/top-tracks`,
    { method: "GET", headers: { "Authorization": `Bearer ${token}` } });
  const tracks = await res.json();

  const res2 = await fetch(
    `https://api.spotify.com/v1/artists/${id}`,
    { method: "GET", headers: { "Authorization": `Bearer ${token}` } });
  const artists = await res2.json();
  let artistsInfo = {
    image: artists.images[0].url,
    name: artists.name,
    followers: artists.followers.total
  }
  let artistsTracks = tracks.tracks.map(track => ({
    name: track.name,
    artist_name: track.artists.map(a => (a.name)),
    image: track.album.images[2]?.url || track.album.images[1]?.url || track.album.images[0]?.url,
    audio_prev: track.external_urls.spotify,
    duration: formateDuration(track.duration_ms)
  }))
  spotifyData.artistsInfo = artistsInfo
  spotifyData.artistsTracks = artistsTracks;
  saveLocalStorage('artistsInfo')
  console.log(artists);
  return { artistsInfo, artistsTracks }
}

function formatDate(d) {
  const date = new Date(d);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = date.getDate()
  const month = monthNames[date.getMonth()]
  return `${day} ${month}`;
}


/* =========================================================
   EPISODES LIST
========================================================= */
export async function getEpisodes(q) {
  if (spotifyData.episodesList && spotifyData.episodesList.length > 0) {
    const episodesList = spotifyData.episodesList;
    console.log('episodesList loaded from localStorage');
    return episodesList;
  }
  const uri = `https://api.spotify.com/v1/search?q=${q}&type=episode&limit=15`
  const token = await getAccessToken();
  const res = await fetch(
    `${uri}`,
    {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    }
  );
  const data = await res.json();
  const episodesList = data.episodes.items.map(ep => ({
    id: ep.id,
    name: ep.name,
    release: formatDate(ep.release_date),
    image: ep.images[1]?.url || ep.images[0]?.url || ep.images[2].url,
    duration: Math.floor(ep.duration_ms / 60000) + "min",
    url: ep.external_urls.spotify,
    desc: ep.description,
    audio_prev: ep.audio_preview_url,
    type: ep.type,
    lang: ep.lang,
    ext_url: ep.external_urls.spotify
  }))
  spotifyData.episodesList = episodesList;
  console.log('me chala');
  saveLocalStorage('episodesList');
  return episodesList;
}


/* =========================================================
   EPISODE DETAILS
========================================================= */

export async function getEpisodesDetails(id) {
  if (spotifyData.episodeDetails && spotifyData.episodeDetails.length > 0) {
    const episodeDetails = spotifyData.episodeDetails;
    console.log('loaded from localStorage');
    return episodeDetails;
  }
  const uri = `https://api.spotify.com/v1/episodes?ids=${id}`
  const token = await getAccessToken();
  const res = await fetch(`${uri}`,
    {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    }
  );
  if (!res.ok) return console.error(res.status);
  const data = await res.json();
  const episodeDetails = data.episodes.map(ep => ({
    id: ep.id,
    name: ep.name,
    desc: ep.html_description,
    audio_prev: ep.audio_preview_url || '',
    background: ep.images[0].url,
    image: ep.images[1]?.url || ep.images[0]?.url || ep.images[2]?.url || '',
    thumb: ep.images[2]?.url || ep.images[1]?.url || '',
    release: formatDate(ep.release_date),
    duration: Math.floor(ep.duration_ms / 60000) + "min",
    type: ep.type,
    lang: ep.language,
    show: {
      show_id: ep.show.id,
      show_desc: ep.show.html_description || ep.show.description,
      show_name: ep.show.name,
      show_publisher: ep.show.publisher,
    }
  }))
  // spotifyData.episodeDetails = episodeDetails;
  // spotifyData.data = data
  // saveLocalStorage('episodeDetails')
  return episodeDetails;
}

// =========================================================
//    TRENDING PLAYLISTS
// ========================================================= 
export async function trandingPlaylist() {
  if (spotifyData.trandings && spotifyData.trandings.length > 0) {
    console.log('trandingPlaylist loaded from localstorage');
    return spotifyData.trandings
  }
  const query = 'tranding songs'
  const token = await getAccessToken();
  const uri = `https://api.spotify.com/v1/search?q=${query}&type=playlist&limit=50`
  const option = { method: "GET", headers: { "Authorization": `Bearer ${token}` } }
  const res = await fetch(uri, option);
  const data = await res.json();
  console.log(data);
  const playlists = data.playlists.items.filter(list => {
    return list?.name && list?.owner && !list.description;
  })
  const trandings = playlists.map(list => ({
    name: list.name,
    user_name: list.owner.display_name,
    user_id: list.owner.id,
    user_href: list.owner.external_urls.spotify,
    image: list.images[0].url,
    desc: list.description,
    external_urls: list.external_urls.spotify,
  }))
  spotifyData.trandings = trandings
  saveLocalStorage('trandings')
  return spotifyData.trandings;
}

// =========================================================
//   SHOWS
// ========================================================= 
export async function getShows(query) {
  if (spotifyData.shows && spotifyData.shows.length > 0) {
    console.log('trandingPlaylist loaded from localstorage');
    const shows = spotifyData.shows
    return shows;
  }
  const token = await getAccessToken()
  const uri = `https://api.spotify.com/v1/search?q=${query}&type=show&limit=10`;
  const option = { method: "GET", headers: { "Authorization": `Bearer ${token}` } }
  const res = await fetch(uri, option);
  const data = await res.json();
  const shows = data.shows.items;
  return getShowArray(shows)
}

const getShowArray = (showsObj) => {
  const shows = showsObj.map(show => ({
    id: show.id,
    name: show.name,
    publisher: show.publisher,
    total_Episodes: show.total_episodes,
    lang: show.language,
    desc: show.html_description,
    image: show.images[0]?.url || show.images[1]?.url || show.images[2]?.url,
    type: show.type
  }))
  spotifyData.shows = shows;
  // saveLocalStorage('data')
  return shows;
}




const songs = { showEpisode: [] }

export async function showsEpisode(id) {
  const token = await getAccessToken();

  const uri1 = `https://api.spotify.com/v1/shows?ids=${id}`
  const res1 = await fetch(
    `${uri1}`,
    {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    }
  );
  const data1 = await res1.json();

  spotifyData.showDetail = {
    id: data1.shows[0].id,
    name: data1.shows[0].name,
    thumb: data1.shows[0].images[1]?.url || data1.shows[0].images[2]?.url,
    background: data1.shows[0].images[0]?.url || data1.shows[0].images[1]?.url || data1.shows[0].images[2]?.url,
    desc: data1.shows[0].html_description,
    type: data1.shows[0].type,
    publisher: data1.shows[0].publisher
  }
  const uri = `https://api.spotify.com/v1/shows/${id}/episodes`
  const res = await fetch(
    `${uri}`,
    {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    }
  );
  const data = await res.json();
  // data.
  const hasData = data.items.filter(d => (d !== null))

  songs.showEpisode = hasData.map(i => ({
    id: i.id,
    name: i.name,
    release: formatDate(i.release_date),
    thumb: i.images[2]?.url || i.images[1]?.url || i.images[0].url,
    lang: i.language,
    audio_prev: i.audio_preview_url,
    desc: i.html_description,
    duration: formateDuration(i.duration_ms),
    type: i.type,
    next: data.next,
    previous: data.previous,
  }))
  const showEpisode = songs.showEpisode
  const showDetail = spotifyData.showDetail
  return { showEpisode, showDetail };
}
// showsEpisode('3BYquoHI7qXmfyjOp0Hgm8')

async function dummy(id) {
  const uri = `https://api.spotify.com/v1/shows/${id}/episodes`

  const token = await getAccessToken();
  const res = await fetch(
    `${uri}`,
    {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    }
  );
  if (!res.ok) {
    console.error("Error:", res.status);
    console.warn(await res.text());
    return null;
  }
  const data = await res.json();

  console.log(data);
  return data;
}

/* =========================================================
   LOCALSTORAGE: SAVE 
========================================================= */
export function saveLocalStorage(key) {
  console.log(`Saving ${key}:`, spotifyData[key]);
  localStorage.setItem("spotifyData", JSON.stringify(spotifyData));
}

