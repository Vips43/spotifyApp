async function getArtistsAblumUI(ids) {
  const { artistsInfo, artistsTracks } = await getArtistsAblum(ids);
  clearEl(artist) // remove HTML

  const fragment = document.createDocumentFragment()
  const div = document.createElement("div");
  div.className = `w-full ${getRandGradient} bg-[url("${artistsInfo.image}")] relative bg-neutral-950 text-white py-8 px-6 lg:px-12`;
  div.innerHTML =
    `<div class='relative'>
        <div class="flex items-center gap-6 lg:gap-10" >
          <div class="w-40 h-40 lg:w-48 lg:h-48 rounded-lg overflow-hidden shadow-xl">
            <img src="${artistsInfo.image}" class="w-full h-full object-cover" />
          </div>
          <div class="space-y-3">
            <h2 class="text-4xl lg:text-6xl font-black capitalize">${artistsInfo.name}</h2>
            <p class="text-gray-300 text-lg lg:text-xl">
              ${artistsInfo.followers} monthly listeners
            </p>
          </div>
        </div>
        <div class="mt-8 sticky top-0 ${solidColor} flex rounded-md items-center p-3 gap-6">
          <button class="audioBtn w-12 h-12 bg-green-500 flex items-center justify-center rounded-full hover:scale-110 transition-all">
            <i class="fa-solid fa-play text-black text-xl"></i>
          </button>
          <img src="${artistsInfo.image}"
            class="w-10 h-12 rounded-md shadow border-2 border-neutral-700 object-cover hover:opacity-100 opacity-80">
          <i class="fa-solid fa-shuffle text-xl opacity-70 hover:opacity-100 cursor-pointer"></i>
          <button class="px-2.5 py-1 border border-neutral-600 rounded-full text-sm hover:border-white transition">
            Follow
          </button>
          <i class="fa-solid fa-ellipsis text-xl opacity-70 hover:opacity-100 cursor-pointer"></i>
        </div>
        </div>
        <div class="mt-10">
          <h3 class="text-xl font-semibold mb-4">Popular</h3>

          <ul class="space-y-2">
          ${artistsTracks.map((track, i) =>

      `<li class="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-600/20 cursor-pointer">
              <span class="text-gray-400">${i + 1}</span>

              <div class="flex items-center gap-3">
                <img src="${track.image}" class="h-12 w-12 rounded" />
                <div>
                  <p class="font-semibold">${track.name}</p>
                  <p class='text-gray-600 text-xs truncate flex items-center'>${track.artist_name.map(artist => `<span>${artist}</span>`).join(', ')}</p>
                </div>
              </div>

              <span class="ml-auto text-sm text-gray-400">${track.duration}</span>
            </li>`
    ).join('')}
          </ul>
        </div>`;
  fragment.append(div)
  artist.append(fragment)
  audioBtnWork(artistsInfo.audio_prev)
}