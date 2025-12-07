
export function alertMsg(msg, cls = "bg-yellow-800 text-white") {
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

export async function check_network() {
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




const clientId = `ae099a85abfd490f942ad96cecc1e3fe`;
const clientSecret = `08929370795044bb9726eccb1421c08c`;

async function getAccessToken() {
  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization":
        "Basic " +
        btoa(clientId + ":" + clientSecret).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });
  const data = await result.json();
  return data.access_token;
}

export async function searchSongs(query) {
  const token = await getAccessToken();
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track`,
    {
      headers: { "Authorization": `Bearer ${token}` }
    }
  );
  const data = await res.json();
  // console.log(data);
  return data.tracks.items;
}
export async function getArtistsDetails() {
  const artistsID =
  ["1MsqF8XQfv6iP7oBL6QZo7", "3mTK29Ki0vd5n7KQtJU0hL", '2r2JFXWh77bx3r1qxN9A8C', '3ci7qlWeEB4GT6y12tbTNO', '0Zg44YDPe3fBfHoxTA0qpD', '3ZFpN9rFHLxElJpqyABkMt', '73qNxW8UoTSftWynAEiYxA'];
  const token = await getAccessToken();
  const ids = artistsID.join(',')

  const res = await fetch(`https://api.spotify.com/v1/artists?ids=${ids}`, {
    main: "GET",
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json();
  let artistsInfo = data.artists.map(d => ({
    name: d.name,
    image: d.images[1]?.url || d.images[0]?.url || d.images[2].url,
  })
  )
  console.log(data);
  return artistsInfo;
}