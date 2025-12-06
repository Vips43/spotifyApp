const song_list = document.querySelector('.song-list');
let input_Search = document.getElementById('input_Search'),
  input_Btn = document.getElementById('input_Btn'),
  categoryContainerDiv = document.querySelector('.category_container div'),
  category_div = document.getElementById('category_div'),
  // title = document.querySelector('.title h1'),
  category_container = document.querySelector('.category_container h3'),
  title = document.querySelector('#main_body_title h1')
show_song_container = document.querySelector('.show-song-container');
const loader = document.getElementById("loader");



// swiperjs

// let spotifyData = JSON.parse(localStorage.getItem("spotifyData")) || [];
spotifyData = JSON.parse(localStorage.getItem("spotifyData")) || {
  categories: [],
  newReleases: [],
  searchResults: []
};


// reload
function home() {
  location.reload()
}

let allSongs = [];

category_container.addEventListener("click", () => {
  category_div.classList.toggle('toggle_category')
  category_container.querySelector("i").classList.toggle("rotate-180")
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
  if (spotifyData.searchResults && spotifyData.searchResults.length > 0) {
    searchSongsUI(spotifyData.searchResults);
    title.innerHTML = "Last Search Results";
  }
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
  // console.log(data);
  
  return data.tracks.items;
} searchSongs('maharana pratap')


async function categorySongs() {
  const token = await getAccessToken();

  const res = await fetch(
    `https://api.spotify.com/v1/browse/categories?locale=sv_US`,
    {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  );
  const data = await res.json();
  console.log(data.categories.items[0]);
  
  return data.categories;
}

const categorySongsUI = async () => {
  const data = await categorySongs();
  category.innerHTML = ''

  spotifyData.categories = [];

  data.items.forEach(item => {

    spotifyData.categories.push({
      id: item.id,
      name: item.name
    });
    const li = document.createElement("li");
    li.dataset.id = item.id;
    li.className = 'p-2 bg-gray-600 hover:bg-neutral-700 transition-all'
    li.textContent = `${item.name}`
    category.append(li)
  })
  localStorage.setItem("spotifyData", JSON.stringify(spotifyData));
}

document.addEventListener("DOMContentLoaded", async () => {
  await categorySongsUI();
  attachCategoryEvents();
})
async function attachCategoryEvents() {
  const li = category.querySelectorAll('li')

  li.forEach(li => {
    li.addEventListener("click", () => {
      const catID = li.innerHTML
      console.log(catID);
      searchS(catID.toLowerCase())
    })
  })
}

getNewReleases()
async function getNewReleases() {
  const token = await getAccessToken();

  const res = await fetch(`https://api.spotify.com/v1/browse/new-releases`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const data = await res.json();
  const releaseData = data.albums.items;
  // console.log(releaseData);
  

  // ALWAYS RESET ARRAY
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


async function searchS(q) {
  const token = await getAccessToken(); // get fresh token

  const res = await fetch(
    `https://api.spotify.com/v1/browse/categories/${q}/playlists?limit=20`,
    {
      method:"GET",
      headers: { "Authorization": `Bearer ${token}` }
    }
  );

  const data = await res.json();
  console.log(data);
  
  // return data;
} 



