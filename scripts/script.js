const song_list = document.querySelector('.song-list');
let input_Search = document.getElementById('input_Search'),
  input_Btn = document.getElementById('input_Btn'),
  categoryContainerDiv = document.querySelector('.category_container div'),
  category_div = document.getElementById('category_div'),
  // title = document.querySelector('.title h1'),
  category_container = document.querySelector('.category_container h3'),
  title = document.querySelector('#main_body_title h1')
show_song_container = document.querySelector('.show-song-container')


// swiperjs




let allSongs = [];

category_container.addEventListener("click", () => {
  category_div.classList.toggle('toggle_category')
  category_container.querySelector("i").classList.toggle("rotate-180")
})

async function getSongsData(query) {
  const url = `https://spotify23.p.rapidapi.com/search/?q=${query}&type=tracks%2Cusers&offset=0&limit=20&numberOfTopResults=20`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '4ca77398a4msh7763f9eafb81d5ap10d5a5jsn98c9be3a8843',
      'x-rapidapi-host': 'spotify23.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    return result;
  } catch (error) {
    console.error(error);
  }
}

// getSongsData('hanuman')



function searchSongsUI(songArr) {
  song_list.innerHTML = ''

  songArr.forEach((song, i) => {
    let div = document.createElement("div")
    div.className = 'song-container  border p-2 grid gap-2'

    div.innerHTML =
      `
        <div class="song-img w-full relative">
            <img id="img" class="w-full" src="${song.imgURL}" alt="">
            <div class="play-icon h-8 w-8 p-1 grid place-items-center bg-green-600 rounded-full absolute top-0 right-0 translate-y-60 -translate-x-5">
              <i class="fa-solid fa-play"></i>
            </div>
          </div>
          <a class="audio" href="${song.songSRC}"></a>
          <div class="caption ">
            <h3>${song.artistName}</h3>
            <p class="text-gray-400 text-sm">${song.trackName}</p>
          </div>`

    song_list.append(div);
  })

}

input_Btn.addEventListener("click", async () => {
  let search = input_Search.value.trim()
  if (!search) return 0;

  let data = await searchSongs(search);

  title.innerHTML = `Searched results for: <span class="capitalize font font-bold text-white">${search}</span>`

  allSongs = data.map(item => {
    // const track = item.data;
    return {
      songSRC: item.href || '#',

      trackName: item.name || "Unknown Track",
      imgURL: item.album.images[0].url || "fallback.jpg",
      artistName: item.artists[0].name || "Unknown Artist",
      // duration: track.duration?.totalMilliseconds || 0
    }

  })
  searchSongsUI(allSongs)
})


async function getToken() {
  const res = await fetch("http://localhost:5000/token");
  const data = await res.json();
  return data.access_token;
}

async function searchSongs(query) {
  const token = await getToken(); // get fresh token

  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track`,
    {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  );

  const data = await res.json();
  // console.log(data.tracks.items);
  return data.tracks.items;
}
async function categorySongs() {
  const token = await getToken();

  const res = await fetch(
    `https://api.spotify.com/v1/browse/categories`,
    {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  );
  const data = await res.json();
  //  console.log(data.categories);

  return data.categories;
}

const categorySongsUI = async () => {
  const data = await categorySongs();
  category.innerHTML = ''
  data.items.forEach(item => {
    const li = document.createElement("li");
    li.dataset.id = item.id;
    li.className = 'p-2 bg-gray-600 hover:bg-neutral-700 transition-all'
    li.textContent = `${item.name}`
    category.append(li)
  })
  // console.log(data);
}

document.addEventListener("DOMContentLoaded", async () => {
  await categorySongsUI();
  attachCategoryEvents();
})

async function attachCategoryEvents() {
  const li = category.querySelectorAll('li')

  li.forEach(li => {
    li.addEventListener("click", () => {
      const catID = li.dataset.id
      console.log(catID);
      
    })
  })
}

getNewReleases()
async function getNewReleases() {
  const token = await getToken();

  const res = await fetch(`https://api.spotify.com/v1/browse/new-releases`
    , {
      headers: { "Authorization": `Bearer ${token}` }
    })
  const data = await res.json();

  return data.albums.items;
}

async function newReleases() {
  const data = await getNewReleases();
  data.forEach(r => {

    const artistsName = r.artists.map(artist => {
      return artist.name;
    }).join(',')

    const div = document.createElement("div");
    div.className = "song-card flex-shrink-0 w-44 sm:w-48 md:w-52 lg:w-56 bg-neutral-900 rounded-xl p-3 hover:bg-neutral-800 transition";

    div.innerHTML =
      `
      <div class="relative w-full h-48 overflow-hidden rounded-lg group">
        <img class="w-full h-full object-cover" src="${r.images
      [0].url}" alt="">
        <div class="absolute play-icon">
          <i class="fa-solid fa-play"></i>
        </div>
      </div>
      <div class="caption mt-3">
        <h3 class="text-base font-semibold truncate">${r.name}</h3>
        <p class="text-gray-400 text-sm truncate">${artistsName}</p>
      </div>`
    show_song_container.append(div)
  })
}
newReleases()