import { getArtistsDetails, getArtistsAblum } from './data.js';

const song_list = document.querySelector('.song-list');
let input_Search = document.getElementById('input_Search'),
  input_Btn = document.getElementById('input_Btn');
let top_main = document.getElementById('top_main'),
  top_main_section_h3 = document.querySelector('#top_main section h3'),
  top_main_section_div = document.querySelector('#top_main section div');
let categoryContainerDiv = document.querySelector('.category_container div'),
  category_div = document.getElementById('category_div'),
  category_container = document.querySelector('.category_container h3'),
  title = document.querySelector('#main_body_title h1'),
  show_song_container = document.querySelector('.show-song-container'),
  show_song_container_h3 = document.querySelector('.show-song-container-h3');




let spotifyData = JSON.parse(localStorage.getItem("spotifyData")) || {
  categories: [], newReleases: [], searchResults: []
};


let allSongs = [];

category_container.addEventListener("click", () => {
  category_div.classList.toggle('toggle_category')
  category_container.querySelector(".fa-angle-down").classList.toggle("rotate-180")
})


const clientId = `ae099a85abfd490f942ad96cecc1e3fe`;
const clientSecret = `08929370795044bb9726eccb1421c08c`;

async function getAccessToken() {
  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization":
        "Basic " +
        btoa(clientId + ":" + clientSecret).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });

  const data = await result.json();
  return data.access_token;
}

document.addEventListener("DOMContentLoaded", () => {
  // if (spotifyData.searchResults && spotifyData.searchResults.length > 0) {
  //   searchSongsUI(spotifyData.searchResults);
  //   title.innerHTML = "Last Search Results";
  // }
})

function searchSongsUI(songArr) {

  song_list.innerHTML = ''
  songArr.forEach((song, i) => {
    let div = document.createElement("div")
    div.className =
      "song-container flex-shrink-0 w-50 p-3 bg-neutral-900 rounded-xl hover:bg-neutral-800 transition grid gap-3 overflow-hidden";

    div.innerHTML = `
        <div class="relative w-44 h-44 overflow-hidden rounded-lg group">
          <img class=" h-full object-cover rounded-lg" src="${song.imgURL}" alt="">

          <!-- Play Icon -->
          <div 
            class="absolute play-icon">
            <i class="fa-solid fa-play"></i>
          </div>
        </div>

        <a class="audio" href="${song.songSRC}"></a>

        <div class="caption">
          <h3 class="font-semibold truncate">${song.artistName}</h3>
          <p class="text-gray-400 text-sm truncate">${song.trackName}</p>
        </div>
`;


    song_list.append(div);
  })

}

input_Btn.addEventListener("click", async () => {
  let search = input_Search.value.trim()
  if (!search) return 0;

  // SHOW LOADER & HIDE SONG LIST
  // loader.classList.remove("hidden");
  song_list.classList.add("hidden");
  title.innerHTML = `Searching&nbsp;<span class="typewriter-animation flex"> . . . .</span>`;

  let data = await searchSongs(search);

  // Hide loader when finished
  // loader.classList.add("hidden");
  song_list.classList.remove("hidden");

  title.innerHTML = `Searched results for: &nbsp; <span class="capitalize font font-bold text-white"> ${search} </span>`

  let results = data.map(item => {
    // const track = item.data;
    return {
      songSRC: item.href || '#',
      trackName: item.name || "Unknown Track",
      imgURL: item.album.images[0].url || "fallback.jpg",
      artistName: item.artists[0].name || "Unknown Artist",
    }
  })

  spotifyData.searchResults = results;
  localStorage.setItem("spotifyData", JSON.stringify(spotifyData))

  searchSongsUI(results)
})


// async function getToken() {
//   const res = await fetch("http://localhost:5000/token");
//   const data = await res.json();
//   return data.access_token;
// }


async function searchSongs(query) {
  const token = await getAccessToken(); // get fresh token

  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track`,
    {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  );
  const data = await res.json();

  // data.tracks.items.forEach(track=>{console.log(track.artists[0].id, track.popularity)})

  return data.tracks.items;
}
searchSongs('gokul sharma')
// localStorage.setItem("spotifyData", JSON.stringify(spotifyData));

document.addEventListener("DOMContentLoaded", async () => {
  renderGenres()
})

getNewReleases()
async function getNewReleases() {
  const token = await getAccessToken();

  const res = await fetch(`https://api.spotify.com/v1/browse/new-releases`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const data = await res.json();
  const releaseData = data.albums.items;
  newReleaseArray(releaseData)
  return releaseData;
}
function newReleaseArray(releaseData) {
  spotifyData.newReleases = [];

  releaseData.forEach(r => {
    const artistsName = r.artists.map(a => a.name).join(', ');
    spotifyData.newReleases.push({
      image: r.images[0].url,
      name: r.name,
      artist: artistsName
    });
  });

  // SAVE IN LOCAL STORAGE
  localStorage.setItem("spotifyData", JSON.stringify(spotifyData));
  return spotifyData.newReleases;
}

async function newReleasesUI() {
  let stored = JSON.parse(localStorage.getItem("spotifyData"));
  // If spotifyData missing or newReleases missing or empty → fetch fresh
  if (!stored || !stored.newReleases || stored.newReleases.length === 0) {
    await getNewReleases();
    stored = JSON.parse(localStorage.getItem("spotifyData"));
  }
  const data = stored.newReleases;   // now safe & guaranteed
  show_song_container.innerHTML = '';
  data.forEach(item => {
    const div = document.createElement("div");
    div.className =
      "song-card flex-shrink-0 w-44 sm:w-48 md:w-52 lg:w-56 bg-neutral-900 rounded-xl p-3 hover:bg-neutral-800 transition";

    div.innerHTML = `
      <div class="relative w-full h-48 overflow-hidden rounded-lg group">
        <img class="w-full h-full object-cover" src="${item.image}" alt="">
        <div
          class="absolute play-icon">
          <i class="fa-solid fa-play"></i>
        </div>
      </div>
      <div class="caption mt-3">
        <h3 class="text-base font-semibold truncate">${item.name}</h3>
        <p class="text-gray-400 text-sm truncate">${item.artist}</p>
      </div>
    `;
    show_song_container.append(div);
  });
}

newReleasesUI()


const GENRES = [
  "pop", "hiphop", "dance", "chill", "party",
  "romance", "workout", "indie", "bollywood",
  "punjabi", "rock", "sad", "happy", "focus",
];
async function searchGenrePlaylists(genre) {
  const token = await getAccessToken();

  const res = await fetch(
    `https://api.spotify.com/v1/search?q=genre:%22${genre}%22&type=playlist&limit=20`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  const data = await res.json();
  return data;
}
// searchGenrePlaylists('pop')

function renderGenres() {
  category.innerHTML = "";

  GENRES.forEach((g, i) => {
    const li = document.createElement("li");
    li.className = "p-2 bg-neutral-900 hover:bg-neutral-700/95 rounded cursor-pointer capitalize flex gap-2 items-center justify-center md:justify-start font-inter transition-all";

    li.innerHTML = `
    <span 
    class="inline-flex h-7 w-7 items-center justify-center rounded-full font-inter bg-neutral-700 text-xs font-bold text-white">
    ${i + 1}</span> 
    <span class="hidden md:flex">${g}</span>`

    li.onclick = async () => {
      const liText = li.querySelector(".hidden");
      const data = await searchGenrePlaylists(g);
      if (data.playlists.items) {
        renderPlaylistsUI(data.playlists.items); //pass the data
        show_song_container_h3.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Genre: ${liText.textContent}</h2>`;  // set heading

      } else {
        show_song_container.innerHTML = "No playlists found.";
      }
    };
    category.append(li);
  });
}

function renderPlaylistsUI(playlists) {
  show_song_container.innerHTML = ``;
  song_list.innerHTML = ``;
  title.innerHTML = ``;

  const wrapper = document.createElement("div");
  wrapper.className = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6";

  playlists.forEach(pl => {
    if (pl) {
      console.log(pl);

      const card = document.createElement("div");
      card.className = `
      bg-neutral-900 p-3 rounded-xl hover:bg-neutral-800 transition cursor-pointer
      `;
      card.innerHTML = `
      <div class="relative w-full h-44 rounded-lg overflow-hidden group">
        <img src="${pl.images[1]?.url || pl.images[2]?.url || pl.images[0]?.url}" class="w-full h-full object-cover" />

        <div class="absolute play-icon">
          <i class="fa-solid fa-play"></i>
        </div>
      </div>

      <h3 class="font-semibold mt-3 truncate">${pl.name}</h3>
  <p class="text-gray-400 text-sm truncate">${pl.owner.display_name}</p>
    `;

      card.onclick = () => showPlaylistTracks(pl.id, pl.name);

      wrapper.append(card);
    }
  });

  show_song_container.append(wrapper);
}

async function showPlaylistTracks(playlistId, name) {
  show_song_container_h3.innerHTML = `Searching&nbsp;<span class="typewriter-animation flex"> . . . .</span>`;
  title.innerHTML = '';

  const token = await getAccessToken();
  console.log(playlistId);

  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=40`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  const data = await res.json();
  console.log("TRACKS:", data.items);

  renderTrackUI(data.items);

  show_song_container_h3.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">${name}</h2>`;
}
function renderTrackUI(tracks) {
  show_song_container.innerHTML = ``;
  tracks.forEach(t => {
    const track = t.track;
    if (!track && !track.album.images[0]?.url) return;

    const div = document.createElement("div");
    div.className =
      "song-card flex-shrink-0 w-44 h-fit sm:w-48 md:w-52 lg:w-56 bg-neutral-900 rounded-xl p-3 hover:bg-neutral-800 transition";

    div.innerHTML = `
      <div class="relative w-full h-48 overflow-hidden rounded-lg group">
        <img class="object-cover" src="${track.album.images[1]?.url || track.album.images[2]?.url || track.album.images[0]?.url}" alt="">
        <div class="absolute play-icon">
          <i class="fa-solid fa-play"></i>
        </div>
      </div>
      <div class="caption mt-3">
        <h3 class="text-base font-semibold truncate">${track.name}</h3>
        <p class="text-gray-400 text-sm truncate">${track.artists.map(a => a.name).join(", ")}</p>
      </div>
    `;

    show_song_container.append(div);
  });
}

document.getElementById("artistBtn").addEventListener("click", async function artistsUI() {
  top_main_section_h3.style.display = 'flex';
  const artists = await getArtistsDetails();
  top_main_section_h3.style.display = 'none';

  top_main_section_div.innerHTML = ''
  artists.forEach(artist => {
    const div = document.createElement("div");
    div.className = 'flex-shrink-0 w-44 bg-neutral-900 rounded-xl p-3 hover:bg-neutral-800 transition';
    div.innerHTML =
      `<div class="relative overflow-hidden rounded-lg group">
        <img class="w-40 h-40 object-cover rounded-full" 
        src="${artist.image}" alt="">
        <div class="absolute play-icon">
          <i class="fa-solid fa-play"></i>
        </div>
      </div>
      <div class="caption mt-3">
        <p class="text-gray-400 text-sm truncate">${artist.name}</p>
      </div>`;
    div.onclick = () => getArtistsAblumUI(artist.id)
    top_main_section_div.append(div);
  })
})
// artistsUI()

//radnome gradient 
const cssGradients = [
  "red-gradient",
  "blue-gradient",
  "orange-gradient",
  "slate-gradient"
];
const getRandGradient = cssGradients[Math.floor(Math.random() * cssGradients.length)];

async function getArtistsAblumUI(ids) {
  const { artistsInfo, artistsTracks } = await getArtistsAblum(ids);
  console.log(artistsInfo);
  top_main.innerHTML = '';
  const div = document.createElement("div");
  div.className = `w-full ${getRandGradient} bg-neutral-950 text-white py-8 px-6 lg:px-12`;
  div.innerHTML =
    `<div class="flex items-center gap-6 lg:gap-10">
          <div class="w-40 h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-xl">
            <img src="${artistsInfo.image}" class="w-full h-full object-cover" />
          </div>
          <div class="space-y-3">
            <h2 class="text-4xl lg:text-6xl font-black capitalize">${artistsInfo.name}</h2>
            <p class="text-gray-300 text-lg lg:text-xl">
              ${artistsInfo.followers} monthly listeners
            </p>
          </div>
        </div>
        <div class="mt-8 flex items-center gap-6">
          <button class="w-14 h-14 bg-green-500 flex items-center justify-center rounded-full hover:scale-110 transition-all">
            <i class="fa-solid fa-play text-black text-xl"></i>
          </button>
          <img src="${artistsInfo.image}"
            class="w-12 h-14 rounded-md shadow border-2 border-neutral-700 object-cover hover:opacity-100 opacity-80">
          <i class="fa-solid fa-shuffle text-2xl opacity-70 hover:opacity-100 cursor-pointer"></i>
          <button class="px-4 py-1.5 border border-neutral-600 rounded-full text-sm hover:border-white transition">
            Follow
          </button>
          <i class="fa-solid fa-ellipsis text-2xl opacity-70 hover:opacity-100 cursor-pointer"></i>
        </div>
        <div class="mt-10">
          <h3 class="text-xl font-semibold mb-4">Popular</h3>

          <ul class="space-y-2">
            <li class="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-900 cursor-pointer">
              <span class="text-gray-400">1</span>

              <div class="flex items-center gap-3">
                <img src="images/teri-yaadeinglory-500-500.jpg" class="h-12 w-12 rounded" />
                <div>
                  <p class="font-semibold">Teri Yaadein</p>
                  <p class="text-gray-400 text-sm">Gokul Sharma</p>
                </div>
              </div>

              <span class="ml-auto text-gray-400">3:44</span>
            </li>

          </ul>
        </div>`

        top_main.append(div)
}

// getArtistsAblumUI()