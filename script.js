addEventListener("DOMContentLoaded", (event) => {
  //assigned anonymous function directly to event handler
  document.getElementById("aboutButton").onclick = function () { navLink("about.html") }
  document.getElementById("pawNGButton").onclick = function () { navLink("pawNG.html") }
  //defined named function and assigned to event handler
  document.getElementById("xAboutButton").onclick = showPopup; 
  document.getElementById("closePopupButton").onclick = closePopup;
  //I'll need to add a new one of these for each of the unique messages that I want, I think. Maybe not.  
  const popup = document.getElementById("popup");
  //Question: why does the anonymous function work for the about and pawNG buttons, but not for the show and close Popup ones?
  //I was confusing my close functions below with the functions in the event listener. I think if I wanted the popup to work the same as the other buttons I would need to remove them from the listener and just keep the functions here (similar to the close, max and min buttons).

});

//Function that allows button to be clicked to bring user to a new page
function navLink(link) {
  window.location.href = link
}

// Function to show the pop-up
function showPopup() {
  popup.style.display = "block"
}

// Function to close the pop-up
function closePopup() {
  popup.style.display = "none"
}

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

