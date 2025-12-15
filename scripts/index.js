import { getShows } from "./data.js";
import { getValue } from "./global.js";

const New_releases = new Swiper('.New_releases', {
  slidesPerView: 'auto',
  spaceBetween: 10,
  centeredSlides: false,
  loop: false,
  direction: 'horizontal',
  navigation: {
    nextEl: '.releases-next',
    prevEl: '.releases-prev',
  },
});
const artistSwiper = new Swiper('.artistSwiper', {
  slidesPerView: 'auto',
  spaceBetween: 10,
  loop: false,
  navigation: {
    nextEl: '.artist-next',
    prevEl: '.artist-prev',
  },
});
const tranding = new Swiper('.tranding', {
  slidesPerView: 'auto',
  spaceBetween: 12,
  loop: false,
  centeredSlides: false,
  navigation: {
    nextEl: '.tranding-next',
    prevEl: '.tranding-prev',
  },
});
const episode_swiper = new Swiper('.episode_swiper', {
  slidesPerView: 'auto',
  spaceBetween: 10,
  centeredSlides: false,
  loop: false,
  navigation: {
    nextEl: '.episode-next',
    prevEl: '.episode-prev',
  },
});
const shows_swiper = new Swiper('.shows', {
  slidesPerView: 'auto',
  spaceBetween: 10,
  centeredSlides: false,
  loop: false,
  navigation: {
    nextEl: '.shows-next',
    prevEl: '.shows-prev',
  },
});





function alertMsg(msg, cls = "bg-yellow-800 text-white") {
  // CREATE CONTAINER
  const wrapper = document.createElement("div");
  wrapper.className =
    "fixed top-4 right-4 z-[9999] transition-all duration-300 opacity-0 translate-y-4";

  // CREATE ALERT BOX
  const alertBox = document.createElement("div");
  alertBox.className = `px-4 py-2 rounded-lg shadow-lg flex items-center justify-between gap-4 ${cls}`;
  alertBox.innerHTML = `
      <span class="capitalize">${msg}</span>
      <button class="text-black font-bold hover:opacity-70">✕</button>
  `;

  wrapper.append(alertBox);
  document.body.append(wrapper);

  // 🔥 Show animation (fade-in + slide-in)
  requestAnimationFrame(() => {
    wrapper.classList.remove("opacity-0", "translate-y-4");
    wrapper.classList.add("opacity-100", "translate-y-0");
  });

  // ❌ Close button
  alertBox.querySelector("button").addEventListener("click", () => {
    closeAlert(wrapper);
  });

  // ⏲ Auto-remove after 3 seconds
  setTimeout(() => closeAlert(wrapper), 3000);
}

function closeAlert(wrapper) {
  wrapper.classList.add("opacity-0", "translate-y-4");
  wrapper.classList.remove("opacity-100", "translate-y-0");

  setTimeout(() => wrapper.remove(), 300); // wait for animation
}


window.addEventListener("online", check_network);
window.addEventListener("offline", check_network);

async function check_network() {
  try {
    const res = await fetch("https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css");

    if (res.ok) {
      alertMsg("Network Connected", "bg-green-600 text-white");
      // location.reload()
      return true;
    } else console.log("newtrk lost");

  } catch {
    alertMsg("Network Lost", "bg-red-600 text-white");
    return false;
  }
}


const folderBtn = document.getElementById("folderBtn");
const dropdown = document.getElementById("searchDropdown");
const input_Btn = document.getElementById("input_Btn");
const input_Search = document.getElementById("input_Search");
const searchState = {
  query: "",
  type: ""
};



let isTrue = true;
folderBtn.addEventListener("click", () => {
  if (input_Search.value !== '') {
    if (!isTrue) {
      dropdown.classList.add("hidden");
      isTrue = true;
    } else {
      dropdown.classList.remove("hidden");
      isTrue = false;
    }
    dropdown.querySelectorAll("li").forEach(li => {
      li.addEventListener("click", (e) => {
        const inputValue = input_Search.value.trim();
        const dropdownValue = e.target.textContent.toLowerCase();
        dropdown.classList.add("hidden")
        isTrue = true
        getValue(inputValue, dropdownValue);
        switch (dropdownValue) {
          case 'show':
            console.log("its show time-->", inputValue);
            break;
          default:
            console.log('i am default');
        }
      })
    })
  }
  else {
    return alert("please type in input then choose type")
  }
});
document.addEventListener("click", (e) => {
  if (!dropdown.contains(e.target) && !folderBtn.contains(e.target)) {
    dropdown.classList.add("hidden");
  }
});
