const globalAudio = new Audio();

export function audioBtnWork(audioSrc) {
    const btn = document.querySelector(".audioBtn");
    const icon = btn.querySelector("i");
    btn.onclick = () => {
        if (globalAudio.src !== audioSrc){
            globalAudio.src = audioSrc
        }
        if(globalAudio.paused){
            globalAudio.play()
            icon.classList.replace("fa-play","fa-pause");
        }else{
            globalAudio.pause()
            icon.classList.replace("fa-pause","fa-play");            
        }
    }
}
