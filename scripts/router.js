
function router() {
  let hash = window.location.hash.substring(1);

  // if(!hash) hash = "home";

  const page = document.getElementById(hash);
  if (page) {
    document.querySelectorAll('.route').forEach(sec => {
      if (!sec.classList.contains("hidden")) {
        // sec.classList.add("hidden");
      }
    });

    // page.classList.remove('hidden')
  }
}

window.addEventListener("load", router);
window.addEventListener("hashchange", router);

