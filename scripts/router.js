
function router() {
  let hash = window.location.hash.substring(1);

  // if(!hash) hash = "home";

  document.querySelectorAll('.route').forEach(sec => {
    sec.classList.add("hidden");
  });
  const page = document.getElementById(hash);
  if (page) page.classList.remove('hidden')
}

window.addEventListener("load", router);
window.addEventListener("hashchange", router);

