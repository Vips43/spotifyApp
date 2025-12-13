// let currentPage = null;

// function router() {
//   const hash = window.location.hash.substring(1) || "home";
//   const nextPage = document.getElementById(hash);

//   // hide previous page
//   if (currentPage) {
//     currentPage.classList.add("hidden");
//     document.querySelectorAll('.route').forEach(sec => {
//       sec.classList.remove("hidden");
//     })
//     document.querySelectorAll('.hidden-route').forEach(sec => {
//       sec.classList.add("hidden");
//     })
//   }

//   // show new page
//   if (nextPage) {
//     nextPage.classList.remove("hidden");
//     currentPage = nextPage;
//     document.querySelectorAll('.route').forEach(sec => {
//       sec.classList.add("hidden");
//     })
//   }
// }
// document.addEventListener("DOMContentLoaded",()=>{
//   window.addEventListener("load", router)
//   window.addEventListener("hashchange", router)
// })
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

// window.addEventListener("load", router);
window.addEventListener("hashchange", router);
