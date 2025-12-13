export function audioBtnWork() {
    const audioDiv = document.querySelector(".audioDiv")
    const audioBtn = document.querySelector(".audioBtn")
    audioBtn.addEventListener("click", ()=>{
        const audioTag =  audioDiv.querySelector('audio');
        audioTag.src = audioTag.dataset.src
        console.log(audioTag);
        if(audioTag.paused){
            audioTag.play()
        } else {
            audioTag.pause()
        }
    })
}
