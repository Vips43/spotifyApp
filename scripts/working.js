const globalAudio = new Audio();

export function audioBtnWork(audioSrc) {
    const btn = document.querySelector(".audioBtn");
    console.log(btn);
    
    const icon = btn.querySelector("i");
    btn.onclick = () => {
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
    }
}
globalAudio.onloadedmetadata=()=>{
    console.log(globalAudio.duration);
}

