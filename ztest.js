addEventListener("DOMContentLoaded", (event) => {
    displayMountains() 
})



function displayMountains(){
const MOUNTAINS = [
    { name: "Kilimanjaro", height: 5895, place: "Tanzania" },
    { name: "Everest", height: 8848, place: "Nepal" },
    { name: "Mount Fuji", height: 3776, place: "Japan" },
    { name: "Vaalserberg", height: 323, place: "Netherlands" },
    { name: "Denali", height: 6168, place: "United States" },
    { name: "Popocatepetl", height: 5465, place: "Mexico" },
    { name: "Mont Blanc", height: 4808, place: "Italy/France" }
  ];

  let headingNode = document.getElementById("mountains").appendChild(document.createElement("tr"))
  for (let key of Object.keys(MOUNTAINS[1])) {
    let headings = headingNode.appendChild(document.createElement("th"))
    headings.setAttribute("id", `${key}`)
    headings.style.textAlign = 'left'
    let textHeadings = headings.appendChild(document.createTextNode(`${key}`))
  }

  for (let i = 0; i < MOUNTAINS.length; i++) {
    let rows = document.getElementById("mountains").appendChild(document.createElement("tr"))
    let currentValues = Object.values(MOUNTAINS[i])
    let currentKeys = Object.keys(MOUNTAINS[i])
    for (let k = 0; k < currentValues.length; k++) {
      let textNode = rows.appendChild(document.createElement("td"))
      let text = textNode.appendChild(document.createTextNode(`${currentValues[k]}`))
      textNode.setAttribute("id", `${currentKeys[k]}`)
    }
  }
  let heightNodes = document.querySelectorAll('#height')
  heightNodes.forEach((e) => e.style.textAlign = 'right')
}