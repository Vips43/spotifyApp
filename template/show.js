async function showsEpisodeUI(id) {
  const { showEpisode, showDetail } = await fetchShowsEpisode(id)

  const fragment = document.createDocumentFragment()
  const div = document.createElement("div");
  div.innerHTML =
    `<div class="bg-contain bg-no-repeat max-h-80 w-full aspect-video bg-top"
    style="background-image: url('${showDetail.background}');" data-id='${showDetail.id}'>
    <div class="space-y-3 bg-black/65 h-full flex flex-col justify-center">
      <h5 class="text-sm">
        <span class="text-blue-500 text-2xl">•</span> ${showDetail.type}
      </h5>
      <h3 class="text-2xl font-bold overflow-hidden clamp-3">${showDetail.desc}
      </h3>
      <div class="flex items-center gap-3">
        <img src="${showDetail.thumb}" class="w-28 h-32 rounded-lg object-cover" />
        <p class="flex flex-col"><span>${showDetail.name}</span><span
            class="text-gray-500">${showDetail.publisher}</span>
        </p>
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
    <div class="descDiv clamp-5 mt-4 pr-2" >
      <p class="descDivP text-gray-300 leading-relaxed"> ${showDetail.desc}  </p>
    </div>
  </div>
  <div class="relative mt-10 bg-neutral-900">
    <h3 class="sticky top-0 z-10 bg-neutral-900 text-xl font-semibold py-3 border-b border-neutral-700">
      More Episode like this</h3>

    <ul class="space-y-2 w-full">
    ${showEpisode.length == 0 ? `<h3 class='text-gray-500'>No episode available</h3>` :
      showEpisode.map(d => (
        `<li class="flex items-center gap-4 cursor-pointer border-b border-neutral-700" data-id='${d.id}'>
        <div class="lihover p-4 flex-shrink-0 w-full min-w-0 rounded-lg">
          <div class="flex items-center gap-3">
            <img src="${d.thumb}"
              class="h-16 object-contain aspect-video rounded" />
            <div class="overflow-hidden w-full min-w-0">
              <div class="font-medium text-lg leading-tight flex items-center gap-2">
                <p><span class="text-blue-700"> • </span></p>
                <div class="clamp-2 flex">${d.desc}</div>
              </div>
              <p class="text-neutral-400">
                <i class="fa-regular fa-circle-down"></i> Video • ${d.name}</p>
            </div>
          </div>
          <div class="my-2 text-sm space-y-2">
          <div class='clamp-2'>
            <p class=" text-gray-400 ">${d.desc}</p>
          </div>
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
  </div>`;

  fragment.append(div)
  shows.append(fragment)
  toggleDesc()
}
// showsEpisodeUI()