addEventListener("DOMContentLoaded", (event) => {
  //assigned anonymous function directly to event handler
  document.getElementById("aboutButton").onclick = function () { navLink("about.html") }
  document.getElementById("pawNGButton").onclick = function () { navLink("pawNG.html") }
  document.getElementById("portfolioButton").onclick = function () { navLink("portfolio.html") }
  //Popup Stuff

  registerPopup("open-popup",function (event){
    showPopup(event,true)
  })
  registerPopup("close-popup",function(event){
    showPopup(event,false)
  })
});

// list of images  ] [
//   T-star.png
//   ...
// ]
 
// funcrio make star{
//   list
//   image = document.createElement('img') <img><>
//   image.src = random.choice(list_of_images)
//   image.style.top = random y 
//   image.style.left = random y
//  body =  document.getElementsByName('body')
//  body.appendElement(image)
// }

//Function that allows button to be clicked to bring user to a new page
function navLink(link) {
  window.location.href = link
}


function registerPopup(className, onClickFunction){
    // Get all of the elements that have the "close-popup" class on them.
    let buttontElements = document.getElementsByClassName(className)

    // Loop through all of the buttons and add click event listeners
    for (let i = 0; i < buttontElements.length; i++) {
      let buttonElement = buttontElements[i]
      buttonElement.addEventListener("click", onClickFunction.bind())
    }
}

function showPopup(event,show){

  // Set display to "block" to show and "none" to hide the popup
  let display = "none"
  if (show){
    display ="block"
  }

  let buttonElement = event.target
  let popupId = buttonElement.dataset.popupId
  let popupElement = document.getElementById(popupId)
  if (popupElement){
    popupElement.style.display = display
  }
}





