function searchSongsUI(songArr) {
  clearEl(song_search) //remove HTML

  const fragment = document.createDocumentFragment();

  songArr.forEach((song, i) => {
    let div = document.createElement("div")
    div.className =
      "song-container w-44  p-2 bg-neutral-900 rounded-xl hover:bg-neutral-800 flex flex-col overflow-hidden";
    div.innerHTML = `
        <div class="relative w-full overflow-hidden rounded-lg group">
          <img class="object-contain rounded-lg" src="${song.image}" alt="">
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
    fragment.append(div);
  })
  song_search.append(fragment);
}