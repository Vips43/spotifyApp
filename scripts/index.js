function home() {
  location.reload()
}

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