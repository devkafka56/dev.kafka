addEventListener("DOMContentLoaded", (event) => {
  //assigned anonymous function directly to event handler
  document.getElementById("aboutButton").onclick = function () { navLink("about.html") }
  document.getElementById("pawNGButton").onclick = function () { navLink("pawNG.html") }
  //defined named function and assigned to event handler
  
  //x About Popup
  document.getElementById("xAboutButton").onclick = showxAboutPopup; 
  document.getElementById("closexAboutPopupButton").onclick = closexAboutPopup;
  const xAboutPopup = document.getElementById("xAboutPopup");
  //Explanation for this const being here: If you try to access an element in your HTML using document.getElementById("popup") before the HTML document is fully parsed and loaded, the JavaScript code won't be able to find that element, and it will return null.
    // Closes the popup when the the screen surrounding the popup is clicked
    xAboutPopup.addEventListener("click", (event) => {
      if (event.target === xAboutPopup) {
        closexAboutPopup();
      }
    });

//x pawNG Popup

  document.getElementById("xpawNGButton").onclick = showxpawNGPopup; 
  document.getElementById("closexpawNGPopupButton").onclick = closexpawNGPopup;
  const xpawNGPopup = document.getElementById("xpawNGPopup");

     // Closes the popup when the the screen surrounding the popup is clicked
     xpawNGPopup.addEventListener("click", (event) => {
      if (event.target === xpawNGPopup) {
        closexpawNGPopup();
      }
    });

// min Welcome Popup
document.getElementById("minWelcomeButton").onclick = showminWelcomePopup; 
document.getElementById("closeminWelcomePopupButton").onclick = closeminWelcomePopup;
const minWelcomePopup = document.getElementById("minWelcomePopup");

   // Closes the popup when the the screen surrounding the popup is clicked
   minWelcomePopup.addEventListener("click", (event) => {
    if (event.target === minWelcomePopup) {
      closeminWelcomePopup();
    }
  });

// max Welcome Popup
document.getElementById("maxWelcomeButton").onclick = showmaxWelcomePopup; 
document.getElementById("closemaxWelcomePopupButton").onclick = closemaxWelcomePopup;
const maxWelcomePopup = document.getElementById("maxWelcomePopup");

   // Closes the popup when the the screen surrounding the popup is clicked
   maxWelcomePopup.addEventListener("click", (event) => {
    if (event.target === maxWelcomePopup) {
      closemaxWelcomePopup();
    }
  });

// x Welcome Popup
  document.getElementById("xWelcomeButton").onclick = showxWelcomePopup; 
  document.getElementById("closexWelcomePopupButton").onclick = closexWelcomePopup;
  const xWelcomePopup = document.getElementById("xWelcomePopup");

     // Closes the popup when the the screen surrounding the popup is clicked
     xWelcomePopup.addEventListener("click", (event) => {
      if (event.target === xWelcomePopup) {
        closexWelcomePopup();
      }
    });

});

//Function that allows button to be clicked to bring user to a new page
function navLink(link) {
  window.location.href = link
}

// ABOUT - Functions to show and close pop-up
function showxAboutPopup() {
  xAboutPopup.style.display = "block"
}

function closexAboutPopup() {
  xAboutPopup.style.display = "none"
}

//pawNG - Functions to show and close pop-up
function showxpawNGPopup() {
  xpawNGPopup.style.display = "block"
}

function closexpawNGPopup() {
  xpawNGPopup.style.display = "none"
}

//minWelcome - Functions to show and close pop-up
function showminWelcomePopup() {
  minWelcomePopup.style.display = "block"
}

function closeminWelcomePopup() {
  minWelcomePopup.style.display = "none"
}

//maxWelcome - Functions to show and close pop-up
function showmaxWelcomePopup() {
  maxWelcomePopup.style.display = "block"
}

function closemaxWelcomePopup() {
  maxWelcomePopup.style.display = "none"
}

//xWELCOME - Functions to show and close pop-up
function showxWelcomePopup() {
  xWelcomePopup.style.display = "block"
}

function closexWelcomePopup() {
  xWelcomePopup.style.display = "none"
}



//maxWelcome - Functions to show and close pop-up


// Functions that bring up the alter windows. Will eventually not need these. 

function closeAbout() {
  alert("I'll try not to take that personally.")
}

function closepawNG() {
  alert("What did you expect?")
}

function closeWelcome() {
  alert("This button does nothing but talk. It is considering a career in politics.")
}

function maxWelcome() {
  alert("You may be disappointed, but you'll never be as disappointed as my father.")
}

function minWelcome() {
  alert("When you light a match, do you expect it to start raining? Then why continue to click these buttons and expect a different result.")
}

