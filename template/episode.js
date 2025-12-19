async function episodeDetailsUI(details, id) {
  let episodeDetails = await getEpisodesDetails(id)
  let data1 = details
  let data = episodeDetails[0];
  clearEl(episode) // remove HTML

  const fragment = document.createDocumentFragment()
  const div = document.createElement("div");
  div.dataset.id = data.id
  div.innerHTML =
    `<div class="bg-contain bg-no-repeat max-h-80 w-full aspect-video bg-top" style="background-image: url('${data.background}');">
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

      <div class="audioDiv flex items-center gap-6">
        <button class="audioBtn w-14 h-14 bg-green-500 flex items-center justify-center rounded-full hover:scale-110 transition">
          <i class="fa-solid fa-play text-black text-xl"></i>
        </button>

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
            <button
              class="w-10 h-10 bg-white flex items-center justify-center hover:scale-[1.1] rounded-full transition ml-auto">
              <i class="fa-solid fa-play text-black text-lg"></i>
            </button>
          </div>
        </div>

      </li>`
    )).join('')}
    </ul>
  </div>`

  fragment.append(div)
  episode.append(fragment)
  audioBtnWork(data.audio_prev)
  console.log('me chala');
}