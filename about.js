addEventListener("DOMContentLoaded", (event) => {
  //assigned anonymous function directly to event handler
  let aboutButton = document.getElementById("aboutButton");
  if (aboutButton) {
    aboutButton.onclick = function () { navLink("about.html") }
  }

  let pawNGButton = document.getElementById("pawNGButton");
  if (pawNGButton) {
    pawNGButton.onclick = function () { navLink("pawNG.html") }
  }

  let portfolioButton = document.getElementById("portfolioButton");
  if (portfolioButton) {
    portfolioButton.onclick = function () { navLink("portfolio.html") }
  }

  //Popup Stuff

  registerPopup("open-popup", function (event) {
    showPopup(event, true)
  })
  registerPopup("close-popup", function (event) {
    showPopup(event, false)
  })

  createStars();

//Movable Container Test 

const movableCard = document.querySelector('.movable-card');
let cardIsDragging = false;
let initialX;
let initialY;

movableCard.addEventListener('mousedown', (e) => {
  cardIsDragging = true;
  initialX = e.clientX - movableCard.getBoundingClientRect().left;
  initialY = e.clientY - movableCard.getBoundingClientRect().top;
});

document.addEventListener('mousemove', (e) => {
  if (!cardIsDragging) return;
  const newX = e.clientX - initialX;
  const newY = e.clientY - initialY;
  movableCard.style.left = newX + 'px';
  movableCard.style.top = newY + 'px';
});

document.addEventListener('mouseup', () => {
  cardIsDragging = false;
});

//SCROLLBAR!
  // Bindings for elements in HTML 
  const scrollContainer = document.querySelector(".scroll-container-about")
  const scrollContent = document.querySelector(".scroll-content-about")
  const scrollbarThumb = document.querySelector(".custom-scrollbar-thumb-about")
  const scrollUpButton = document.querySelector(".scroll-up-button-about")
  const scrollDownButton = document.querySelector(".scroll-down-button-about")

  // Bindings for scroll step (how much is scrolled with each interaction), and 
  const scrollStep = 20
  const buttonHeight = scrollUpButton.offsetHeight

  // Click listeners for up/down buttons 
  scrollUpButton.addEventListener("click", () => {
    scrollContainer.scrollTop -= scrollStep; // Adjust the scroll step as needed
  });

  scrollDownButton.addEventListener("click", () => {
    scrollContainer.scrollTop += scrollStep; // Adjust the scroll step as needed
  });

  // Scrollbar Thumb Movement
  scrollContainer.addEventListener("scroll", () => {
    //This is the code that causes the strange behaviour between pages. Figure out a formala using the consts to replace the 200 value so that it works whenever used on scrollable content
    const scrollPercentage = (scrollContainer.scrollTop / (scrollContent.clientHeight - scrollContainer.clientHeight)) * 200;
    scrollbarThumb.style.top = `${scrollPercentage}%`
    // scrollbarBackground.style.height = `${scrollPercentage}%`; // Adjust the background height
  });

  // Scrollbar thumb dragging 
  let isDragging = false;
  let startY, startThumbPosition;

  scrollbarThumb.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isDragging = true;
    startY = e.clientY;
    startThumbPosition = parseFloat(scrollbarThumb.style.top) || 0;
  });

  window.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const deltaY = e.clientY - startY;
      const newThumbPosition = startThumbPosition + (deltaY / scrollContainer.clientHeight) * 100;

      // Calculate the maximum and minimum positions for the thumb
      const minThumbPosition = 0; // The minimum position is always 0 (top of the scrollbar)
      const maxThumbPosition = 95 - (buttonHeight / scrollContainer.clientHeight) * 95;

      const clampedPosition = Math.min(Math.max(newThumbPosition, minThumbPosition), maxThumbPosition);
      scrollbarThumb.style.top = `${clampedPosition}%`;

      const newScrollPosition = (clampedPosition / 100) * (scrollContent.clientHeight - scrollContainer.clientHeight);
      scrollContainer.scrollTop = newScrollPosition;
    }
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // for scrolling with trackpad/mouse 
  scrollContainer.addEventListener("wheel", (e) => {
    e.preventDefault(); // Prevent the default scrolling behavior
    const deltaY = e.deltaY;
    const currentScroll = scrollContainer.scrollTop;
    const newScrollPosition = currentScroll + deltaY;

    // Ensure the new scroll position stays within bounds
    const maxScroll = scrollContent.clientHeight - scrollContainer.clientHeight;
    const clampedScroll = Math.min(Math.max(newScrollPosition, 0), maxScroll);

    // Update the scroll position
    scrollContainer.scrollTop = clampedScroll;
  });

});

//Function that allows button to be clicked to bring user to a new page
function navLink(link) {
  window.location.href = link
}

//Background Stars - placement, and placement on refresh

function createStars() {

  function createStar(imgSrc, count, width, height) {
    for (let i = 0; i < count; i++) {
      const star = document.createElement("img")
      star.src = imgSrc

      const left = Math.random() * 100 // Random left position
      const top = (Math.random() * Math.random()) * 100 // Random top position
      star.style.left = `${left}%`
      star.style.top = `${top}%`
      star.style.position = "absolute"
      star.style.zIndex = -1
      star.style.width = width
      star.style.height = height

      document.body.appendChild(star)
    }
  }

  createStar("images/BackgroundStars/Dot-Star.png", 120, "5px", "5px");
  createStar("images/BackgroundStars/AsyX-Star.png", 10, "15px", "15px");
  createStar("images/BackgroundStars/sX-Star.png", 10, "10px", "10px");
  createStar("images/BackgroundStars/T-Star.png", 10, "10px", "10px");
  createStar("images/BackgroundStars/X-Star.png", 7, "15px", "15px");
  createStar("images/BackgroundStars/XT-Star.png", 7, "20px", "20px");
}



// Popup Functions 
function registerPopup(className, onClickFunction) {
  // Get all of the elements that have the "close-popup" class on them.
  let buttontElements = document.getElementsByClassName(className)

  // Loop through all of the buttons and add click event listeners
  for (let i = 0; i < buttontElements.length; i++) {
    let buttonElement = buttontElements[i]
    buttonElement.addEventListener("click", onClickFunction.bind())
  }
}

function showPopup(event, show) {

  // Set display to "block" to show and "none" to hide the popup
  let display = "none"
  if (show) {
    display = "block"
  }

  let buttonElement = event.target
  let popupId = buttonElement.dataset.popupId
  let popupElement = document.getElementById(popupId)
  if (popupElement) {
    popupElement.style.display = display
  }
}


