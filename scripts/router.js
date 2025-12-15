function home() {
  location.reload()
}
function router() {
  const hash = window.location.hash.substring(1) || "top_main";
  const page = document.getElementById(hash);

  // hide all pages
  document.querySelectorAll('.route').forEach(sec => {
    sec.classList.add("hidden"); 
  });

  // show active page
  if (page) {
    page.classList.remove("hidden");
    page.scrollIntoView({ behavior: "smooth", block: "start" });
    
  }
}

window.addEventListener("load", router);
window.addEventListener("hashchange", router);
