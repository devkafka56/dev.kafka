const simpleBlockHeight = 20 
const simpleBlockWidth = 15 

var blankLevelPlan = `
........................................
........................................
........................................
........................................
........................................
........................................
........................................
........................................
........................................
........................................
........................................
........................................
........................................
........................................
........................................
........................................
........................................
........................................
........................................
........................................`

var simpleLevelPlan = `
#.......................................
#.........o.............................
#.......---..........................___
#.....................o.....v...........
#.@...............------...........o....
#____----------....---------------._....
#...#+++++_____....................#....
#...#_____#...#....................#....
#...............................___#....
#..............-------..................
#.......................................
#.........#---_-........................
#.........#...#+++++++_--.......___.....
#---......#...#_______#.........#.......
#.==......#...........#.....____#.......
#....o....#...........#xx...#...........
#...o.o---#...........#+++++#...........
#..o.o.o..#...........#_____#...........
#.o.o.o.o.#.............................
#_________#.............................`

var simpleLevelPlan = `
#.......................................
#.........o...........................o.
#.......---..........................___
#.....................o.....v...........
#.@...............------...........o....
#____.............................._....
#...#+++++_____....................#....
#...#_____#...#....................#....
#...............................___#....
#..................zzz..................
#.......................................
#.........#---_-........................
#.........#...#+++++++_--.......___.....
#---......#...#_______#.........#.......
#.==......#...........#.....____#.......
#....o....#...........#xx...#...........
#...o.o---#...........#+++++#...........
#..o.o.o..#...........#_____#...........
#.o.o.o.o.#.............................
#_________#.............................`





var testLevelPlan = `
........................................
........................................
........................................
........................................
........................................
...@....................................
........................................
.#.....#..o.............................
.#.....#................................
..__..._____............................
........................................
.....o..................................
........................................
.....--.................................
........................................
........................................
........................................
........................................
........................................
........................................`

var currentLevelPlan = `
#.......................................
#.........o...........................o.
#.......---..........................___
#.....................o.................
#.@.................----................
#____.............................._....
#...#+++++_____................o...#....
#...#_____#...#....................#....
#...............................___#....
#..................zzz..................
#.......................................
#.........#---_-........................
#.........#...#+++++++_--.......___.....
#---......#...#_______#.........#.......
#.==......#...........#.o...____#.......
#....o....#...........#--...#...........
#...o.o---#...........#+++++#...........
#..o.o.o..#...........#_____#...........
#.o.o.o.o.#.............................
#_________#.............................`

var testLevelPlan = `
#.......................................
#......................-..........____..
#..............=.................#......
#.....o..........................#......
#.....o.......--............_____#......
#....---...............__...#...........
#.@.........................#...........
#___....______....__........#.....+.....
.....#++++#....#..............#.........
#....#____#....#...........o..#.........
#..............#....o...._____#.........
#..............#-........#..............
...............#+++++++++#.............=
...............#_________#..............
......#................................o
......#..............................o..
.....................................o..
.........=...........................o..
..............=......................o..
...........++++......................o..`

var firstLevelPlan = `
#.......................................
#......o..............................o.
#....................................___
#.....---.............o..............#..
#.@..................---..........___#..
#____.............................#.....
....#....._____................o..#.....
....#+++++#...#...................#.....
....#_____#...#...............____#.....
..............#...--..........#.........
..............#...........--..#.........
..............#...............#.........
..............#+++++++#.--....#.........
..............#_______#.......#.........
......................#o....__#.........
......................#-....#...........
......................#+++++#...........
......................#_____#...........
........................................
........................................`

var blankkLevelPlan = `
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................`;

// class Mouse {
//     constructor(pos, speed) {
//         this.pos = pos
//         this.speed = speed
//     }

//     get type() { return "mouse" }

//     get boundingBox() {
//         return new BoundingBox(this.pos.x, this.pos.y, this.pos.x, this.pos.y)
//     }

//     static create(pos) {
//         return new Mouse(pos.plus(new Vec(0, -0.5)),
//             new Vec(0, 0))
//     }

//     draw() {
//         //tail 
//         ctx.beginPath()
//         ctx.moveTo(this.pos.x - 10, this.pos.y - 1)
//         ctx.lineTo(this.pos.x - 20, this.pos.y - 1)
//         ctx.strokeStyle = "lightPink"
//         ctx.stroke()

//         //body
//         ctx.beginPath()
//         ctx.arc(this.pos.x, this.pos.y, 10, Math.PI, 0, false)
//         ctx.closePath()
//         ctx.fillStyle = "#898aa3"
//         ctx.fill()
//     }
// }

// class Pickle {
//     constructor(pos) {
//         this.pos = pos
//     }

//     get type() { return "pickle" }

//     static create(pos) {
//         return new Pickle(pos)
//     }

//     draw() {
//         function drawPickleBump(x, y) {
//             ctx.beginPath()
//             ctx.arc(x, y, 1, 0, 2 * Math.PI)
//             ctx.fillStyle = "#83ba3a"; // Pickle green color
//             ctx.fill()
//             ctx.closePath()
//         }
//         ctx.beginPath()
//         ctx.ellipse(this.pos.x, this.pos.y, 10, 5, 0, 0, 2 * Math.PI)
//         ctx.fillStyle = "#8CC63E"
//         ctx.fill()
//         drawPickleBump(this.pos.x + 7, this.pos.y - 2)
//         drawPickleBump(this.pos.x - 8, this.pos.y - 2)
//         drawPickleBump(this.pos.x - 5, this.pos.y + 3)
//     }
// }


// class Space {
//     constructor(pos) {
//         this.pos = pos
//         this.height = blockHeight
//         this.width = blockWidth
//     }

//     get type() { return "space" }

//     static create(pos) {
//         return new Space(pos)
//     }

//     draw() {
//         ctx.beginPath()
//         ctx.rect(this.pos.x, this.pos.y, this.width, this.height)
//         ctx.closePath()
//     }

// }

//Previous viewport function 
// function viewport() {
     // let currentTransformation = ctx.getTransform()
        // let catPosX = (this.cat.pos.x * currentTransformation.a) + currentTransformation.e
        // let catOffcenterX = catPosX - canvas.width / 2
        // let catPosY = (this.cat.pos.y * scale) + currentTransformation.f
        // let catOffcenterY = catPosY - canvas.height / 2
        // //prevent scaling more than once 
        // if (currentTransformation.a != scale) {
        //     ctx.scale(scale, scale)
        // }
        // //change viewport based on cat's x position
        // if (Math.abs(catOffcenterX) > 5) {
        //     if (catOffcenterX > 0) {
        //         ctx.translate(-2, 0)
        //     } else {
        //         ctx.translate(2, 0)
        //     }
        // }
        // //change viewport based on cat's y position
        // if (Math.abs(catOffcenterY) > 5) {
        //     if (catOffcenterY > 0) {
        //         ctx.translate(0, -2)
        //     } else {
        //         ctx.translate(0, 2)

        //     }
        // }
// }