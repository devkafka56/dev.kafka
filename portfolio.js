addEventListener("DOMContentLoaded", (event) => {
document.getElementById("xPortfolioButton2").onclick = function () { navLink("index.html") }
});

//Function that allows button to be clicked to bring user to a new page
function navLink(link) {
    window.location.href = link
  }