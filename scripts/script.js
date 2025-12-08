import { getArtistsDetails, getArtistsAblum, getEpisodes } from './data.js';

const song_search = document.querySelector('#song-search');
let input_Search = document.getElementById('input_Search'),
  input_Btn = document.getElementById('input_Btn');
let title = document.querySelector('.title')
let top_main = document.getElementById('top_main'),
  top_main_section_h3 = document.querySelector('#top_main section h3'),
  top_main_section_div = document.querySelector('#top_main_section_div');
let categoryContainerDiv = document.querySelector('.category_container div'),
  category_div = document.getElementById('category_div'),
  category_container = document.querySelector('.category_container h3'),
  show_song_container = document.querySelector('.show-song-container'),
  show_song_container_h3 = document.querySelector('.show-song-container-h3');
const episode_section = document.getElementById('episode_section'),
  episode_section_h1 = document.getElementById('episode_section h1'),
  episode_container = document.getElementById('episode_container')




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
  newReleasesUI()
})

function searchSongsUI(songArr) {
  song_search.innerHTML = ''
  songArr.forEach((song, i) => {
    let div = document.createElement("div")
    div.className =
      "song-container w-44 sm:w-48 p-2 bg-neutral-900 rounded-xl hover:bg-neutral-800 transition grid gap-3 overflow-hidden";
    div.innerHTML = `
        <div class="relative w-44 h-44 overflow-hidden rounded-lg group">
          <img class=" h-full object-cover rounded-lg" src="${song.imgURL}" alt="">
          <!-- Play Icon -->
          <div 
            class="absolute play-icon">
            <i class="fa-solid fa-play"></i>
          </div>
        </div>
        <audio class="audio" href="${song.songSRC}"></audio>
        <div class="caption">
          <h3 class="font-semibold truncate">${song.artistName}</h3>
          <p class="text-gray-400 text-sm truncate">${song.trackName}</p>
        </div>`;
    song_search.append(div);
  })
}

input_Btn.addEventListener("click", async () => {
  let search = input_Search.value.trim()
  if (!search) return 0;

  song_search.classList.add("hidden");
  title.innerHTML = `Searching&nbsp;<span class="typewriter-animation flex"> . . . .</span>`;

  let data = await searchSongs(search);
  song_search.classList.remove("hidden");

  title.innerHTML = `Searched results for: &nbsp; <span class="capitalize font font-bold text-white"> ${search} </span>`

  let results = data.map(item => {
    // const track = item.data;
    return {
      songSRC: item.preview_url || "",
      trackName: item.name || "Unknown Track",
      imgURL: item.album.images[0].url || "fallback.jpg",
      artistName: item.artists[0].name || "Unknown Artist",
    }
  })

  spotifyData.searchResults = results;
  localStorage.setItem("spotifyData", JSON.stringify(spotifyData))

  searchSongsUI(results)
})

async function searchSongs(query) {
  const token = await getAccessToken();
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track`,
    {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  );
  const data = await res.json();
  return data.tracks.items;
}

document.addEventListener("DOMContentLoaded", async () => {
  renderGenres()
})
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
      "swiper-slide flex-shrink-0 w-44 sm:w-48 md:w-52 lg:w-56 bg-neutral-900 rounded-xl p-3 hover:bg-neutral-800 transition";

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
  song_search.innerHTML = ``;
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
    div.className = "swiper-slide flex-shrink-0 w-44! flex flex-col justify-between items-center bg-neutral-900 rounded-xl py-3 hover:bg-neutral-800 transition";

    div.innerHTML = `
    <div class="relative overflow-hidden rounded-lg group">
      <img class="w-40 h-40 object-cover rounded-full" src="${artist.image}" alt="">
      <div class="absolute play-icon">
        <i class="fa-solid fa-play"></i>
      </div>
    </div>
    <div class="caption mt-3">
      <p class="text-gray-400 text-sm truncate">${artist.name}</p>
    </div>`;
    div.onclick = () => getArtistsAblumUI(artist.id);
    top_main_section_div.append(div);
  });

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
  // artistsTracks.forEach(t=>console.log(t))
  console.log(artistsTracks[1]);

  top_main.innerHTML = '';
  const div = document.createElement("div");
  div.className = `w-full ${getRandGradient} relative bg-neutral-950 text-white py-8 px-6 lg:px-12`;
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
        <div class="mt-8 sticky top-0 flex items-center gap-6">
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
          ${artistsTracks.map((track, i) =>

      `<li class="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-700 cursor-pointer">
              <span class="text-gray-400">${i + 1}</span>

              <div class="flex items-center gap-3">
                <img src="${track.image}" class="h-12 w-12 rounded" />
                <div>
                  <p class="font-semibold">${track.name}</p>
                </div>
              </div>

              <span class="ml-auto text-gray-400">${track.duration}</span>
            </li>`
    ).join('')}
          </ul>
        </div>`

  top_main.append(div)
}

async function episodeCardUI() {
  const { episodesList } = await getEpisodes('random');

  console.log(episodesList);


  episodesList.forEach(ep => {
    const swiperDiv = document.createElement('div');
    swiperDiv.className = 'swiper-slide';
    swiperDiv.innerHTML =
      `<div class="relative rounded-lg overflow-hidden group w-40 h-40 mx-auto">
      <img class="w-full h-full object-cover" src="${ep.image}" alt="">
      <div class="absolute play-icon">
        <i class="fa-solid fa-play"></i>
      </div>
    </div>
    <div class="caption mt-3 text-left">
      <p class="text-gray-300 font-inter truncate w-40 flex items-center gap-1"><span class="text-2xl text-blue-700">•</span>
          <a href="${ep.url}" target="_blank"><span class="text-[1.15rem] hover:underline">${ep.name}</span></a>
      </p>
      <p class="text-gray-500 text-xs truncate w-40">
        <span>${ep.release}</span> • <span>${ep.duration}</span>
      </p>
    </div>`;
    episode_container.append(swiperDiv);
  })
}
episodeCardUI()