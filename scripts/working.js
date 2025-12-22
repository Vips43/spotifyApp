const globalAudio = new Audio();

export function audioBtnWork() {
  const btn = document.querySelectorAll(".audioBtn");
  
  
  btn.forEach(b => {
    const icon = b.querySelector("i");
    b.onclick = (e) => {
      const audioSrc = b.dataset.src
      console.log(audioSrc)
      if (!audioSrc) return
      if (globalAudio.src !== audioSrc) {
        globalAudio.src = audioSrc
      }
      if (globalAudio.paused) {
        icon.classList.replace("fa-pause", "fa-play");
        globalAudio.play()
        icon.classList.replace("fa-play", "fa-pause");
      } else {
        globalAudio.pause()
        icon.classList.replace("fa-pause", "fa-play");
      }
      if (globalAudio.ended) {
        icon.classList.replace("fa-pause", "fa-play");
      }
    }
  })
}