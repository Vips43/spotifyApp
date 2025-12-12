import { getArtistsDetails, getArtistsAblum, getEpisodes, getEpisodesDetails, getAccessToken, saveLocalStorage, getNewReleases, trandingPlaylist, getShows } from './data.js';


const song_search = document.getElementById('song-search');
let input_Search = document.getElementById('input_Search'),
  input_Btn = document.getElementById('input_Btn');
let searchDropdownLI = document.querySelectorAll('#searchDropdown ul li')
let title = document.querySelector('.title')
let top_main = document.querySelector('#top_main')
let artist_h3 = document.querySelector('#artist h3'),

  top_main_section_h3 = document.querySelector('#top_main section h3'),
  artist_container = document.getElementById('artist_container');
let categoryContainerDiv = document.querySelector('.category_container div'),
  category_div = document.getElementById('category_div'),
  category_container = document.querySelector('.category_container h3'),
  new_release_container = document.querySelector('.new-release-container'),
  new_release_h3 = document.querySelector('.new-release-h3');
const episode_section = document.getElementById('episode_section'),
  episode_section_h1 = document.getElementById('episode_section h1'),
  episode_container = document.getElementById('episode_container')
let episode = document.getElementById("episode");
const tranding_container = document.getElementById("tranding_container");
const shows_container = document.querySelector(".shows-container");
const shows_h3 = document.getElementById("shows_h3")




// localStorage and local object
let spotifyData = JSON.parse(localStorage.getItem("spotifyData")) || {
  categories: [], newReleases: [], searchResults: [], episodesList: []
};

category_container.addEventListener("click", () => {
  category_div.classList.toggle('toggle_category')
  category_container.querySelector(".fa-angle-down").classList.toggle("rotate-180")
})
// load on document loaded
document.addEventListener("DOMContentLoaded", async () => {
  if (spotifyData.searchResults && spotifyData.searchResults.length > 0) {
    const saved = spotifyData.searchResults
    console.log('search results loaded from localstorage')
    return searchSongsUI(saved)
  }
})
document.addEventListener("DOMContentLoaded", () => {
  // renderGenres()

  newReleasesUI()
})

function searchSongsUI(songArr) {
  song_search.innerHTML = ''
  songArr.forEach((song, i) => {
    let div = document.createElement("div")
    div.className =
      "song-container w-44  p-2 bg-neutral-900 rounded-xl hover:bg-neutral-800 flex flex-col overflow-hidden";
    div.innerHTML = `
        <div class="relative w-full overflow-hidden rounded-lg group">
          <img class="object-contain rounded-lg" src="${song.imgURL}" alt="">
          <!-- Play Icon -->
          <div 
            class="absolute play-icon">
            <i class="fa-solid fa-play"></i>
          </div>
        </div>
        <audio class="audio" data-href='${song.songSRC}' href=""></audio>
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
  let litext = '';
  searchDropdownLI.forEach(li => {
    li.addEventListener("click", (e) => {
      litext = e.target.textContent;
      console.log(litext)
    })
  })
  song_search.classList.add("hidden");
  title.innerHTML = `Searching&nbsp;<span class="typewriter-animation flex"> . . . .</span>`;
  let data = await searchSongs(search);
  song_search.classList.remove("hidden");
  title.innerHTML = `Searched results for: &nbsp; <span class="capitalize font font-bold text-white"> ${search} </span>`
  let results = data.map(item => {
    // const track = item.data;
    return {
      id: item.id,
      songSRC: item.preview_url || "",
      trackName: item.name || "Unknown Track",
      image: item.album.images[0].url || "fallback.jpg",
      artistName: item.artists[0].name || "Unknown Artist",
    }
  })
  spotifyData.searchResults = results;
  localStorage.setItem("spotifyData", JSON.stringify(spotifyData))

  searchSongsUI(results)
})

async function searchSongs(query, type = 'track') {
  const token = await getAccessToken();
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=${type}`,
    {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  );
  const data = await res.json();
  console.log('me chala', type, data);

  return data.tracks.items;
}

async function newReleasesUI() {
  const releases = await getNewReleases();
  console.log(releases);

  new_release_container.innerHTML = '';
  releases.forEach(item => {
    const div = document.createElement("div");
    div.className = "swiper-slide";

    div.innerHTML = `
      <div class="relative rounded-lg overflow-hidden group w-40 h-40 mx-auto">
        <img class="w-full h-full object-cover" src="${item.image}" alt="">
        <div class="absolute play-icon">
          <i class="fa-solid fa-play"></i>
        </div>
      </div>
      <div class="caption self-start text-left! mt-3">
        <h3 class="text-base font-semibold truncate">${item.name}</h3>
        <p class="text-gray-400 text-sm truncate">${item.artist}</p>
      </div>`;
    new_release_container.append(div);
  });
  console.log('me chala');
}


const GENRES = [
  "pop", "hiphop", "dance", "chill", "party", "romance", "workout", "indie", "bollywood", "punjabi", "rock", "sad", "happy", "focus",
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
  console.log('me chala');
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
  wrapper.className = "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2";

  playlists.forEach(pl => {
    if (pl) {
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
  console.log('me chala');
}

async function showPlaylistTracks(playlistId, name) {
  show_song_container_h3.innerHTML = `Searching&nbsp;<span class="typewriter-animation flex"> . . . .</span>`;
  title.innerHTML = '';

  const token = await getAccessToken();

  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=40`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  const data = await res.json();

  renderTrackUI(data.items);
  console.log('me chala');
}

function renderTrackUI(tracks) {
  show_song_container.innerHTML = ``;
  show_song_container_h3.innerHTML = `
  <h2 class="text-2xl font-bold mb-4">${name}</h2>`;
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
    console.log('me chala');
  });
}

document.querySelector(".artistBtn").addEventListener("click", async function artistsUI() {
  artist_h3.style.display = 'block';
  const artists = await getArtistsDetails();
  artist_h3.innerHTML = `Top Artists`

  artist_container.innerHTML = ''
  artists.forEach(artist => {
    const div = document.createElement("div");
    div.className = "swiper-slide";
    div.setAttribute("lazy", 'true')
    div.innerHTML = `
    <div class="relative rounded-lg overflow-hidden group w-40 h-40 mx-auto">
      <img loading='lazy' class="w-full h-full object-cover rounded-full" src="${artist.image}" alt="">
      <div class="absolute play-icon">
        <i class="fa-solid fa-play"></i>
      </div>
    </div>
    <div class="caption mt-3">
      <p class="text-gray-400 text-sm truncate">${artist.name}</p>
    </div>`;
    div.onclick = () => getArtistsAblumUI(artist.id);
    artist_container.append(div);
  });
  console.log('me chala');
})

// async function getArtistsAblumLocalStorage() {

// }

//radnome gradient 
const cssGradients = [
  "red-gradient", "blue-gradient",
  "orange-gradient", "slate-gradient"
];
const solidMap = {
  "red-gradient": "red-solid", "blue-gradient": "blue-solid", "orange-gradient": "orange-solid", "slate-gradient": "slate-solid"
};
const getRandGradient = cssGradients[Math.floor(Math.random() * cssGradients.length)];
const solidColor = solidMap[getRandGradient];

async function getArtistsAblumUI(ids) {
  const { artistsInfo, artistsTracks } = await getArtistsAblum(ids);

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
        <div class="mt-8 sticky ${solidColor} top-0 flex items-center p-3 gap-6">
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
  console.log('me chala');
}

async function episodeCardUI() {
  const episodesList = await getEpisodes('top')
  episodesList.forEach(ep => {
    const swiperDiv = document.createElement('div');
    swiperDiv.dataset.id = ep.id;
    swiperDiv.className = 'swiper-slide';
    swiperDiv.innerHTML =

      `<a href='#episode'>
      <div class="relative rounded-lg overflow-hidden group w-40 h-40 mx-auto">
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
    </div></a>`;
    episode_container.append(swiperDiv);
    episode_container.addEventListener('click', async (e) => {
      const slide = e.target.closest(".swiper-slide");
      if (!slide) return

      const id = slide.dataset.id;
      episodeDetailsUI(episodesList, id)
    })

  })
  console.log('me chala');
}
episodeCardUI()

async function episodeDetailsUI(details, id) {

  let episodeDetails = await getEpisodesDetails(id)
  let data1 = details
  let data = episodeDetails[0];
  // episode.classList.replace("block", 'hidden')
  episode.innerHTML = '';
  const div = document.createElement("div");
  div.innerHTML =
    `<div class="bg-contain bg-no-repeat max-h-80 w-full aspect-video bg-top" style="background-image: url('${data.background}');" data-id='${data.id}'>
    <div class="space-y-3 bg-black/65 h-full flex flex-col justify-center ">
      <h5 class="text-sm">
        <span class="text-blue-500 text-2xl">•</span> New Podcast Episode
      </h5>
      <h3 class="text-2xl font-bold overflow-hidden clamp-3">${data.desc}
      </h3>
      <div class="flex items-center gap-3">
        <img src="${data.thumb}" class="w-12 h-16 object-cover" />
        <p class="flex flex-col"><span>${data.name}</span><span class="text-gray-500">${data.show.show_publisher}</span></p>
      </div>
    </div>
  </div>
  <div class="sticky top-0 z-20">
    <div class="${getRandGradient} p-3 grid gap-3">
      <div class="opacity-70 hover:opacity-100 cursor-pointer">
        <i class="fa-regular fa-circle-play"></i>
        <span>Video</span> • <span>${data.release}</span> • <span>${data.duration}</span>
      </div>

      <div class="flex items-center gap-6">
        <button onclick="audioBtn(this)"
          class="w-14 h-14 bg-green-500 flex items-center justify-center rounded-full hover:scale-110 transition">
          <i class="fa-solid fa-play text-black text-xl"></i>
        </button>
        <audio data-src="${data.audio_prev}" src=""></audio>

        <div class="text-2xl flex gap-3">
          <i class="fa-regular fa-circle-down opacity-70 hover:opacity-100 cursor-pointer"></i>
          <i class="fa-solid fa-plus opacity-70 hover:opacity-100 cursor-pointer"></i>
          <i class="fa-solid fa-shuffle opacity-70 hover:opacity-100 cursor-pointer"></i>
        </div>

        <button
          class="px-4 py-1.5 border border-neutral-600 rounded-full text-sm hover:border-white transition">
          Follow
        </button>

        <span class="text-sm opacity-70 hover:opacity-100 cursor-pointer">•••</span>
      </div>
    </div>
  </div>
  <div class="relative z-10">
    <div class="sticky top-0 bg-neutral-950 pt-5">
      <div class="flex gap-10 items-center border-b border-neutral-700 pb-2">
        <h3 class="relative px-4 py-2 bottom_border">Description</h3>
        <h3 class="relative px-4 py-2">Transcript</h3>
      </div>
    </div>
    <div class="mt-4 pr-2">
      <p class="text-gray-300 leading-relaxed"> ${data.desc} </p>
    </div>
  </div>
  <div class="relative mt-10 bg-neutral-900">
    <h3 class="sticky top-[115px] z-10 bg-neutral-900 text-xl font-semibold py-3 border-b border-neutral-700">More Episode like this</h3>

    <ul class="space-y-2 w-full">
    ${data1.map(d => (
      `<li class="flex items-center gap-4 cursor-pointer border-b border-neutral-700" data-id='{d.id}'>
        <div class="lihover p-4 flex-shrink-0 w-full min-w-0 rounded-lg">
          <div class="flex items-center gap-3">
            <img src="${d.image}" class="h-16 object-contain aspect-video rounded" />
            <div class="overflow-hidden w-full min-w-0">
              <h2 class="font-medium text-lg clamp-2 leading-tight">
                <span class="text-blue-700"> • </span> ${d.desc} </h2>
              <p class="text-neutral-400">
                <i class="fa-regular fa-circle-down"></i> Video • ${d.name}
              </p>
            </div>
          </div>
          <div class="my-2 text-sm space-y-2">
            <p class="clamp-2 text-gray-400 ">${d.desc}</p>
            <p>${d.release} • ${d.duration}</p>
          </div>
          <div class="flex items-center gap-10 mt-5">
            <i class="fa-solid fa-plus opacity-70 hover:opacity-100 cursor-pointer"></i>
            <i class="fa-regular fa-circle-down opacity-70 hover:opacity-100 cursor-pointer"></i>
            <i class="fa-solid fa-arrow-up-from-bracket opacity-70 hover:opacity-100 cursor-pointer"></i>
            <span class="text-sm opacity-70 hover:opacity-100 cursor-pointer">• • •</span>
            <button onclick="audioBtn(this)"
              class="w-10 h-10 bg-white flex items-center justify-center hover:scale-[1.1] rounded-full transition ml-auto">
              <i class="fa-solid fa-play text-black text-lg"></i>
            </button>
            <audio data-src="${data.audio_prev}" src=""></audio>
          </div>
        </div>

      </li>`
    )).join('')}
    </ul>
  </div>`
  episode.append(div)
  console.log('me chala');
}

async function trandingSongsUI() {
  const data = await trandingPlaylist();
  data.forEach(d => {
    const div = document.createElement("div")
    div.classList = "swiper-slide !w-[180px] flex-shrink-0 h-fit";
    div.setAttribute('loading', "lazy");
    div.innerHTML =
      `<div class="hover:bg-neutral-700/35 w-44 p-2 h-full rounded-lg overflow-hidden">
    <div class="relative rounded-lg overflow-hidden group w-40 h-40 mx-auto">
    <img class="w-full h-full object-cover" src="${d.image}" alt="">
    <div class="absolute play-icon">
      <i class="fa-solid fa-play"></i>
    </div>
    </div>
    <div class="caption self-start mt-3">
    <h3 class="text-base font-semibold truncate">${d.name}</h3>
    <p class="text-gray-400 text-sm truncate">${d.user_name}</p>
    </div>
  </div>`;
    tranding_container.append(div)
  })
}
trandingSongsUI()
document.querySelector('.showsBtn').addEventListener("click", async () => {
  shows_h3.style.display = 'block'
  const data = await getShows('top')
  shows_h3.innerHTML = 'Top Shows'
  shows_container.innerHTML = '';
  data.forEach(d => {
    const div = document.createElement("div")
    div.classList = "swiper-slide !w-[180px] flex-shrink-0 h-fit";
    div.setAttribute('loading', "lazy");
    div.innerHTML =
      `<div class="hover:bg-neutral-700/35 w-44 p-2 h-full rounded-lg overflow-hidden">
    <div class="relative rounded-lg overflow-hidden group w-40 h-40 mx-auto">
    <img class="w-full h-full object-cover" src="${d.image}" alt="">
    <div class="absolute play-icon">
      <i class="fa-solid fa-play"></i>
    </div>
    </div>
    <div class="caption self-start mt-3">
    <h3 class="text-base font-semibold truncate">${d.name}</h3>
    <p class="text-gray-400 text-sm truncate">${d.publisher}</p>
    </div>
  </div>`;
    shows_container.append(div)
  })
})