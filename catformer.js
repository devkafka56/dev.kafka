const canvas = document.getElementById("catVmouseCanvas")
const ctx = canvas.getContext("2d")
const blockHeight = 20
const blockWidth = 15
const scale = 2
let showBoundingBoxes = false
let backgroundColour = "#23173D" //"#2D173D" // "thistle"
let platformColour = "#69173D" //"rosyBrown"
let waterColour = "#084a5e" //"#092c77" //"#084c61" //"#0a5d76"  //"#05173D" //"skyBlue"
let treatColour = "#FFC857" //"gold"
let catAppendage = "#54382A" //"#402a1f" //"#2b1c14"
let catBody = "blanchedAlmond"
let shadow = "#1ea0ae" //"#25c8da" //"#d0b5e3" //"#177e89" //"#084c61"

let raf

//images
const kafkaPortrait = new Image()
kafkaPortrait.src = "images/game/Kafka-Portrait-2.png"
const heart = new Image()
heart.src = "images/game/big-heart.png"

//Bring Window Into Focus on Load

// window.onload = function() {
//     canvas.focus();
// };

//Testing Functions: 

function getMousePos(event) {
    const boundingBox = canvas.getBoundingClientRect()
    return {
        x: event.clientX - boundingBox.left,
        y: event.clientY - boundingBox.top
    }
}

function showMousePos(event) {
    const mousePos = getMousePos(event)
    const message = `Mouse Coordinates: (${mousePos.x}, ${mousePos.y})`

    ctx.clearRect(0, 0, canvas.width, 20)
    ctx.fillText(message, 10, 15)
}

class BoundingBox {
    constructor(left, top, right, bottom) {
        this.left = left
        this.top = top
        this.right = right
        this.bottom = bottom
        this.colour = "rgba(9, 176, 63, 0.4)"
    }

    draw() {
        if (showBoundingBoxes) {
            ctx.beginPath()
            ctx.fillStyle = this.colour
            ctx.rect(this.left, this.top, this.right - this.left, this.bottom - this.top)
            ctx.fill()
            ctx.closePath()
        }
    }

    toString() {
        return `BoundBox\n==========\nLeft:\t${this.left}\nTop:\t${this.top}\nRight:\t${this.right}\nBottom:\t${this.bottom}\n`
    }

    touches(boundingBox) {
        let a = this
        let b = boundingBox

        // Check collisions for all "a" lines. (T, R, B, L)
        let at = a.top >= b.top && a.top <= b.bottom
        let ar = a.right >= b.left && a.right <= b.right
        let ab = a.bottom >= b.top && a.bottom <= b.bottom
        let al = a.left >= b.left && a.left <= b.right

        // Check collisions for all "b" lines. (T, R, B, L)
        let bt = b.top >= a.top && b.top <= a.bottom
        let br = b.right >= a.left && b.right <= a.right
        let bb = b.bottom >= a.top && b.bottom <= a.bottom
        let bl = b.left >= a.left && b.left <= a.right

        // Relative to "a" where is the collision.
        // i.e. if a "b" right side is touching "a" left side than that's an "a" left collision
        let anyTopOrBottom = (at || ab || bt || bb)
        let anyLeftOrRight = (ar || al || br || bl)

        let left = (al || br) && anyTopOrBottom
        let right = (ar || bl) && anyTopOrBottom
        let top = (at || bb) && anyLeftOrRight
        let bottom = (ab || bt) && anyLeftOrRight

        // it's only a collision if two directions have a collision
        let isCollision = left || right || top || bottom

        return isCollision ? { "left": left && al, "right": right && ar, "top": top && at, "bottom": bottom && ab } : false
    }

}

// var levelZero = `
// ........................................
// ........................................
// ___________.............................
// ........................................
// .........................==.............
// ........................................
// ..@....o.......o....o.............o.....
// ________________________________________
// ................____....................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................`

// var levelOne = `
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ..@....o.........*..............o.......
// ________________________________________
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................`

// var levelTwo = `
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ..@....o.o.o............................
// ________________________________________
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................`

// var levelThree = `
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ..@....o.o.o.o..........................
// ________________________________________
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................`

// var levelFour = `
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ..@....o.o.o.o......o...................
// ________________________________________
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................
// ........................................`

var levelZero = `
#......................................#
#.......o.............o................#
#......---....---....---...............#
#....................................o.#
#.@....................................#
_____++++________++++_________......____
#...#____#......#____#............__#..#
#...............................__#..o.#
#.............................__#......#
#......................................#
#...........o..........................#
#..........---............______________
#--.........#...........................
#.......--..#....---....................
#...........#...........................
#--...o.....#........---....---...o.....
#.v..o.o.---#..........................
#...o.o.o...#............--......--.....
#.o..o.o..o.#+++++++++++++++++++++++++++
#___________#___________________________`


var levelOne = `
#......................................#
#.@...............*....................#
#__________............................#
#...............______..............---#
#......|.............__________......o.#
#..o...................................#
#....................................ww#
#..o..................o................#
#....|.................................#
_________________....---...............#
#..........................------------#
#..o.................................o.#
___________________.....________________
..................................v.....
........................................
.........o..........---.............o...
...........................o............
wwww....---....---........---.....---...
........................................
++++++++++++++++++++++++++++++++++++++++`

var levelTwo = `
........................................
__............--.......--.......--......
#.................o........o.........o..
#o......._--++++-----++++-----++++----..
_.....---#...v........v........v........
---.................................*...
.......................................#
...____________________________________#
.......................................#
.......................................#
......---------------------------------#
_--................o...................#
#o........_............................#
#.........#.......---..................#
_--.......#.--............--..._________
#o........#....................#..v.....
#.........#....................#......o.
_--.......-..-------------------..-----_
#...................................@..#
________________________________________`

var levelThree = `
........................................
.......o...--.....__.....--...o.........
......--..........##..........--........
#--...............##.................--#
#.................##...................#
#.................##...................#
#..__________________________________..#
#......................................#
#......................................#
...................@...................#
..........._________________...........#
......o..__#v.............v#__..o......#
.......___......|.....|......___.......#
..o..___...........*...........___..o..#
..............o.........o..............#
.................|...|.................#
............----------------...........#
......---......................---.....#
#---................................---#
++++++++++++++++++++++++++++++++++++++++`

var levelFour = `

.......................................#
............===....o...................#
.o..........__....___...---....____..@.#
............_#++++#.#++++++++++#..#____#
____.....___#______.____________........
..#_....................................
..#__...................................
...#__........o.................o.....o.
.*..#__................o................
.....#__..............zzz............___
........................................
___________+++++++++++++++++_...........
..........#_________________#...........
........................................
..o...................................ww
...........................|............
..o.....................o....___________
....-..zzz..---..............#..........
.www..................|.........o.o.o.o.
._____++++++++++++______________________`


class Level {
    constructor(plan) {
        let rows = plan.trim().split("\n").map(l => [...l])
        this.height = Math.round(rows.length)
        this.width = rows[0].length
        this.startActors = []
        this.movingActors = []

        this.rows = rows.map((row, y) => {
            return row.map((ch, x) => {
                let type = levelChars[ch]
                if (typeof type == "string") return type
                this.startActors.push(
                    type.create(new Vec(x * blockWidth, y * blockHeight), ch)
                )
                return "empty"
            })
        })
    }

}

class State {
    constructor(level, actors) {
        this.level = level
        this.actors = actors
        this.status = "playing"
    }

    static start(level) {
        return new State(level, level.startActors)
    }

    get boundingBox() {
        return new BoundingBox(0, 0, canvas.width, canvas.height)
    }

    get cat() {
        return this.actors.find(a => a.type == "cat")
    }

    viewport() {
        let catPosX = this.cat.pos.x * scale
        let catPosY = this.cat.pos.y * scale
        let offsetX = canvas.width / 2 - catPosX
        let offsetY = canvas.height / 2 - catPosY


        if (this.cat.pos.x < 0) {
            offsetX = canvas.width / 2
            offsetY = canvas.height / 2
        }
        if (Math.abs(offsetX) > 5 || Math.abs(offsetY) > 5) {
            ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY)
        } else {
            ctx.setTransform(scale, 0, 0, scale, 0, 0);
        }

    }

    draw(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = backgroundColour
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.save()
        this.viewport()

        for (let i = 0; i < this.actors.length; i++) {
            let current = this.actors[i]
            if (current.type == "cat") { continue }
            current.draw(time)
        }
        this.cat.draw(time)

        this.boundingBox.draw()

        ctx.restore()
        ctx.imageSmoothingEnabled = false
        ctx.drawImage(kafkaPortrait, 545, 350, 60, 60)

        ctx.font = "12px Courier New"
        ctx.fillStyle = "red"
        // ctx.fillText(`${state.cat.lives} lives`, 492, 375)

        this.drawLives()


    }

    move(time, state) {
        this.actors.filter(actor => "move" in actor).forEach(actor => actor.move(time, state))
    }

    update() {
        let state = this
        let actors = this.actors
        let cat = this.cat
        let catBox = cat.boundingBox
        let collectedTreats = []
        actors.filter(actor => "collide" in actor).forEach((actor) => {
            let actorBox = actor.boundingBox
            let collisions = catBox.touches(actorBox)
            if (collisions) {
                if (actor.type == "treat") {
                    if (actor.display == true) {
                        console.log(`actor.display: ${actor.display}`)
                        state.cat.shadow = treatColour
                        setTimeout(() => state.cat.shadow = shadow, 300)
                    }
                }
                actor.collide(state, collisions)
            }
        })

        for (let i = 0; i < actors.length; i++) {
            let currentActor = actors[i]
            let currentBox = currentActor.boundingBox
            for (let k = 1; k < actors.length; k++) {
                let nextActor = actors[k]
                let nextBox = nextActor.boundingBox
                let touches = currentBox.touches(nextBox)
                if (currentActor.ch == nextActor.ch) {

                    continue
                }
                if (nextActor.type == "cat") continue
                if (touches && "touch" in currentActor) {
                    if ((currentActor.ch == "z" && (nextActor.ch == "|" || nextActor.ch == "v")) || ((currentActor.ch == "|" || currentActor.ch == "v") && nextActor.ch == "z")) { continue }
                    //if ((currentActor.ch == "w" && (nextActor.ch == "|" || nextActor.ch == "v")) || ((currentActor.ch == "|" || currentActor.ch == "v") && nextActor.ch == "w")) { continue }
                    if ((currentActor.ch == "z" && nextActor.ch == "w") || (currentActor.ch == "w" && nextActor.ch == "z")) { continue }
                    currentActor.touch(state, touches)
                }
            }
        }

        let totalTreats = actors.filter(a => a.type == "treat")

        for (let i = 0; i < totalTreats.length; i++) {
            if (totalTreats[i].display == false) {

                if (totalTreats[i].ch == "*") {
                    cat.lives += 3
                    totalTreats[i].ch = "B"
                }
                collectedTreats.push(totalTreats[i])
            }
        }

        let total = totalTreats.filter(a => a.ch == "o")
        let collected = total.filter(a => a.display == false)

        ctx.fillText(`${collected.length} treats`, 490, 390)

        if (total.length == collected.length) {
            state.status = "won"

            //add flag
        }

    }

    resetCat() {
        let state = this
        let actors = this.actors
        let floorActors = actors.filter(actor => actor.type == "floor")
        let cat = this.cat
        if (cat.wet) {
            floorActors.forEach(actor => {
                if ((actor.pos.y != cat.pos.y) && (actor.pos.y < cat.pos.y)) {
                    if ((actor.pos.x < cat.pos.x) && (actor.pos.x > blockWidth)) {
                        cat.pos.x = actor.pos.x
                        cat.pos.y = actor.pos.y - 10
                        cat.wet = false
                        cat.shadow = shadow
                        cat.lives -= 3
                        state.status = "playing"
                    }
                }
            })
        } else if (cat.damp) {
            cat.damp = false
            cat.shadow = shadow
            cat.lives -= 3
            state.status = "playing"
        }
    }

    drawLives() {
        let cat = this.cat

        if (cat.lives == 9) {
            ctx.drawImage(heart, 535, 365, 10, 10)
            ctx.drawImage(heart, 520, 365, 10, 10)
            ctx.drawImage(heart, 505, 365, 10, 10)
        }

        if (cat.lives == 6) {
            ctx.drawImage(heart, 535, 365, 10, 10)
            ctx.drawImage(heart, 520, 365, 10, 10)
        }

        if (cat.lives == 3) {
            ctx.drawImage(heart, 535, 365, 10, 10)
        }

        if (cat.lives == 12) {
            ctx.drawImage(heart, 535, 365, 10, 10)
            ctx.drawImage(heart, 520, 365, 10, 10)
            ctx.drawImage(heart, 505, 365, 10, 10)
            ctx.drawImage(heart, 490, 365, 10, 10)
        }

        if (cat.lives == 15) {
            ctx.drawImage(heart, 535, 365, 10, 10)
            ctx.drawImage(heart, 520, 365, 10, 10)
            ctx.drawImage(heart, 505, 365, 10, 10)
            ctx.drawImage(heart, 490, 365, 10, 10)
            ctx.drawImage(heart, 475, 365, 10, 10)
        }

        if (cat.lives == 18) {
            ctx.drawImage(heart, 535, 365, 10, 10)
            ctx.drawImage(heart, 520, 365, 10, 10)
            ctx.drawImage(heart, 505, 365, 10, 10)
            ctx.drawImage(heart, 490, 365, 10, 10)
            ctx.drawImage(heart, 475, 365, 10, 10)
            ctx.drawImage(heart, 460, 365, 10, 10)
        }
    }

}

class Vec {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    plus(other) {
        return new Vec(this.x + other.x, this.y + other.y)
    }
    times(factor) {
        return new Vec(this.x * factor, this.y * factor)
    }
}

class Cat {
    constructor(pos) {
        this.pos = pos
        this.speed = new Vec(0, 0)
        this.direction = 1
        this.jumpSpeed = 8
        this.lives = 9
        this.treats = 0
        //movement flags
        this.standing = false
        this.jumping = false
        this.wet = false
        this.damp = false

        //colouring 
        this.legsTailColour = catAppendage
        this.bodyColour = catBody
        this.shadow = shadow
        //animation
        this.walking = false
        this.float = 0.01
        this.wobble = 0.8
        this.maxPos = new Vec(this.pos.x, this.pos.y + this.wobble)

    }

    get type() { return "cat" }

    get boundingBox() {
        return new BoundingBox(this.pos.x - blockWidth + 8, this.pos.y - blockWidth + 11, this.pos.x + blockWidth - 8, this.pos.y + blockWidth - 2)
    }

    static create(pos) {
        return new Cat(pos.plus(new Vec(blockWidth, blockHeight)))
    }

    draw(time) {
        const yToGround = blockWidth - 3
        const xToGround = blockWidth - 9
        const yToBody = blockWidth - 7
        const toBody = blockWidth - 12
        const legSpeed = 200
        const legRate = 100
        const thinShadow = 3
        const thickShadow = 7
        const noShadow = 0

        ctx.save()
        ctx.translate(this.pos.x, this.pos.y)
        if (this.direction == -1) {
            ctx.scale(-1, 1)
        }

        //legs
        ctx.strokeStyle = this.legsTailColour
        ctx.lineWidth = 2.5
        ctx.lineCap = "round"

        //front left
        ctx.beginPath()
        ctx.shadowColor = this.shadow
        ctx.shadowBlur = thinShadow
        if (this.direction == 1) {
            ctx.shadowOffsetX = -2
        } else if (this.direction == -1) {
            ctx.shadowOffsetX = 2
        }
        ctx.stroke()

        if (this.walking === false) {
            ctx.moveTo(xToGround, toBody)
            ctx.lineTo(xToGround, yToGround)
        } else if (this.walking === true) {
            if (time % legSpeed < legRate) {
                ctx.moveTo(xToGround, toBody)
                ctx.lineTo(xToGround - 1, yToGround)
            } else {
                ctx.moveTo(xToGround, toBody)
                ctx.lineTo(xToGround + 1, yToGround)
            }
        }
        ctx.stroke()
        //back left
        ctx.beginPath()
        ctx.shadowColor = this.shadow
        ctx.shadowBlur = thinShadow
        if (this.walking === false) {
            ctx.moveTo(-toBody, yToBody)
            ctx.lineTo(-toBody, yToGround)
        } else if (this.walking === true) {
            if (time % legSpeed < legRate) {
                ctx.moveTo(-toBody, yToBody)
                ctx.lineTo(-toBody - 1, yToGround)
            } else {
                ctx.moveTo(-toBody, yToBody)
                ctx.lineTo(-toBody + 1, yToGround)
            }
        }
        ctx.stroke()
        ctx.closePath()

        //tail 
        ctx.beginPath()
        ctx.shadowColor = this.shadow
        ctx.shadowBlur = thickShadow
        ctx.moveTo(-7, 0)
        if (time % 1000 < 500) {
            //control x and y, and then end x y
            ctx.quadraticCurveTo(-6, -12, -11, -12)
        }
        else {
            ctx.quadraticCurveTo(-9, -12, -3, -12)
        }
        ctx.lineWidth = 5.5
        ctx.stroke()
        ctx.closePath()

        //back ear
        ctx.beginPath()
        ctx.moveTo(4, -2) //(5, -5)
        ctx.lineTo(5, -7) // 7, -13
        ctx.lineTo(6, -2) //9, -7
        ctx.fillStyle = this.legsTailColour
        ctx.fill()
        ctx.closePath()

        //body
        ctx.beginPath()
        ctx.shadowColor = this.shadow
        ctx.shadowBlur = thinShadow
        ctx.ellipse(0, 2, 8, 6, 0, 0, 2 * Math.PI)
        ctx.fillStyle = this.bodyColour
        ctx.fill()
        ctx.closePath()


        //back right
        ctx.beginPath()
        ctx.lineWidth = 2.5
        ctx.shadowColor = this.shadow
        ctx.shadowBlur = thinShadow
        if (this.walking === false) {
            ctx.moveTo(-xToGround, toBody + 3)
            ctx.lineTo(-xToGround, yToGround)
        } else if (this.walking === true) {
            if (time % legSpeed < legRate) {
                ctx.moveTo(-xToGround, toBody + 3)
                ctx.lineTo(-xToGround + 1, yToGround)
            } else {
                ctx.moveTo(-xToGround, toBody + 3)
                ctx.lineTo(-xToGround - 1, yToGround)
            }
        }
        ctx.stroke()
        ctx.closePath()

        //front right 
        ctx.beginPath()
        ctx.shadowColor = this.shadow
        ctx.shadowBlur = thinShadow
        if (this.walking === false) {
            ctx.moveTo(toBody, yToBody)
            ctx.lineTo(toBody, yToGround)
        } else if (this.walking === true) {
            if (time % legSpeed < legRate) {
                ctx.moveTo(toBody, yToBody)
                ctx.lineTo(toBody + 1, yToGround)
            } else {
                ctx.moveTo(toBody, yToBody)
                ctx.lineTo(toBody - 1, yToGround)
            }
        }
        ctx.stroke()
        ctx.closePath()
        //front ear
        ctx.beginPath()
        ctx.shadowColor = this.shadow
        ctx.shadowOffsetX = 0
        ctx.shadowBlur = noShadow
        ctx.moveTo(2, -1)
        ctx.lineTo(3, -7) //y makes top part pointy
        ctx.lineTo(5, -3)
        ctx.fillStyle = this.legsTailColour
        ctx.fill()
        ctx.closePath()

        //eye 
        ctx.beginPath()
        ctx.shadowColor = this.shadow
        ctx.shadowBlur = noShadow
        ctx.arc(5.5, 1, 0.8, 0, Math.PI * 2)
        ctx.fillStyle = "steelBlue"
        ctx.fill()
        ctx.closePath()


        ctx.restore()
        this.boundingBox.draw()
    }

    bounce() {
        this.pos.y += this.float
        if (this.pos.y >= this.maxPos.y + this.wobble) {
            this.float = -Math.abs(this.float)
        } else if (this.pos.y <= this.maxPos.y) {
            this.float = Math.abs(this.float)
        }
    }

    move(time, state) {

        if (this.jumping) {
            this.speed.y = 8
            //prevent double jump
            if (!this.standing) {
                this.speed.y -= 7
            }
        }

        if (!this.jumping) {
            this.speed.y -= 0.5
        }

        if (this.standing) {
            this.speed.y = Math.max(this.speed.y, 0)

        }

        this.pos.x += this.speed.x * this.direction
        this.pos.y -= this.speed.y

        if (this.wet) {
            if (!this.standing) {
                // let newBodyColour = "rgba(18, 83, 109, 0.9)"
                // let newlegsTailColour = "rgba(11, 50, 66, 0.7)"
                // this.legsTailColour = newlegsTailColour
                // this.bodyColour = newBodyColour

                let wetShadow = "#C3173F"
                this.shadow = wetShadow

                if (this.shadow == wetShadow) {
                    let sink = function () {
                        state.status = "lost"
                    }
                    setTimeout(sink, 300)
                }
            }
        }

        if (this.damp) {
            // let newBodyColour = "rgba(18, 83, 109, 0.9)"
            // let newlegsTailColour = "rgba(11, 50, 66, 0.3)"
            // this.legsTailColour = newlegsTailColour
            // this.bodyColour = newBodyColour

            let wetShadow = "#C3173F"
            this.shadow = wetShadow
            if (this.shadow == wetShadow) {
                let sink = function () {
                    state.status = "lost"
                }
                setTimeout(sink, 200)
            }

        }



        if (this.pos.y + 10 > canvas.height) {
            state.status = "lost"
        }

        if (this.pos.x < 0) {
            this.pos.x = this.pos.x + 10
        }



        //this.wet = false
        //this.damp = false
        this.standing = false
        this.jumping = false
    }

    moveLeft() {
        this.walking = true
        this.speed.x = 3
        this.direction = -1
        if (this.standing) {
            this.speed.x = 1
        }
    }

    moveRight() {
        this.walking = true
        this.speed.x = 3
        this.direction = 1
        if (this.standing) {
            this.speed.x = 1
        }
    }

    jump() {
        this.jumping = true
    }

    stop() {
        this.walking = false
        this.speed.x = 0
    }

    levelUp(state) {
        state.status = "won"
        //this.bodyColour = "rgba(255, 228, 77, 0.9 )"
        //this.legsTailColour = "rgba(204, 173, 0, 0.6)"
        this.shadow = "rgba(250, 214, 95, 0.9)"
    }


}

class Water {
    constructor(pos, height, ch) {
        this.pos = pos
        this.height = height
        this.ch = ch
        this.speed = new Vec(0.5, 0.4)
        this.maxPos = new Vec(this.pos.x, this.pos.y)
    }

    get type() { return "water" }

    get boundingBox() {
        return new BoundingBox(this.pos.x, this.pos.y, this.pos.x + blockWidth, this.pos.y + this.height)
    }

    static create(pos, ch) {
        if (ch == "=") {
            return new Water(pos, blockHeight / 2, ch)
        } else if (ch == "|") {
            return new Water(pos, blockHeight / 2, ch)
        } else if (ch == "v") {
            return new Water(pos, blockHeight / 2, ch)
        }
        else if (ch == "+") {
            return new Water(pos, blockHeight, ch)
        }
    }

    draw() {
        ctx.beginPath()
        ctx.rect(this.pos.x, this.pos.y, blockWidth, this.height)
        ctx.fillStyle = waterColour
        ctx.fill()
        ctx.closePath()
        this.boundingBox.draw()
    }

    move() {
        if (this.ch == "=") {
            this.pos.x += this.speed.x
            if (this.pos.x == 0) {
                this.speed.x = -(this.speed.x)
            } else if (this.pos.x >= canvas.width - blockWidth) {
                this.speed.x *= -1
            }
        } else if (this.ch == "v") {
            this.pos.y += this.speed.y
            if (this.pos.y > canvas.height - 15) {
                this.pos.y = this.maxPos.y - 10
            }
        } else if (this.ch == "|") {
            this.pos.y += this.speed.y
            if (this.pos.y < 0) {
                this.speed.y *= -1
            }
            if (this.pos.y > canvas.height) {
                this.speed.y = Math.abs(this.speed.y)
            }
        }
    }

    collide(state, collisions) {
        if (this.ch == "+") {
            if (state.cat.pos.y < this.pos.y) {
                state.cat.damp = true
                if (collisions.right) {

                    state.cat.pos.x -= 10
                }
                if (collisions.left) {

                    state.cat.pos.x += 10
                }
            } else if (state.cat.pos.y > this.pos.y) {
                state.cat.wet = true
            }
        } else if (this.ch == "=") {
            if (collisions.right) {
                state.cat.pos.x -= 10
            }
            if (collisions.left) {
                state.cat.pos.x += 10
            }
            state.cat.damp = true
        } else if (this.ch == "v") {
            if (collisions.right) {
                state.cat.pos.x -= 10
            }
            if (collisions.left) {
                state.cat.pos.x += 10
            }
            state.cat.damp = true
        } else if (this.ch == "|") {
            if (collisions.right) {
                state.cat.pos.x -= 10
            }
            if (collisions.left) {
                state.cat.pos.x += 10
            }
            state.cat.damp = true
        }
    }

    touch(state, touches) {
        //console.log(JSON.stringify(touches))
        if (this.ch == "v") {
            if (touches.bottom && (touches.left && touches.right)) {
                if (this.maxPos.y - 10 < 0) {
                    this.pos.y = this.maxPos.y
                } else {
                    this.pos.y = this.maxPos.y - 10
                }
            }
        }

        if (this.ch == "=") {
            if (touches.right) {
                this.speed.x *= -1
            } else if (touches.left) {
                this.speed.x = Math.abs(this.speed.x)
            }
        }

        if (this.ch == "|") {
            if (touches.top && (touches.left && touches.right)) {
                this.speed.y *= -1
            } else if (touches.bottom && (touches.left && touches.right)) {
                this.speed.y = -this.speed.y
            }
        }
    }
}

class Wall {
    constructor(pos) {
        this.pos = pos
    }

    get type() { return "wall" }

    get boundingBox() {
        return new BoundingBox(this.pos.x, this.pos.y, this.pos.x + blockWidth, this.pos.y + blockHeight)
    }

    static create(pos) {
        return new Wall(pos)
    }

    draw() {
        ctx.beginPath()
        ctx.shadowBlur = 0
        ctx.rect(this.pos.x, this.pos.y, blockWidth, blockHeight)
        ctx.fillStyle = platformColour
        ctx.fill()
        ctx.closePath()
        this.boundingBox.draw()
    }

    collide(state, collisions) {
        // if (collisions.top) {
        //     state.cat.direction = state.cat.direction
        //     state.cat.pos.y = state.cat.pos.y
        // } else if (collisions.bottom) {
        //     state.cat.direction = state.cat.direction
        //     state.cat.pos.y = state.cat.pos.y
        // } else 
        if (collisions.left) {
            state.cat.direction = state.cat.direction * -1
            state.cat.pos.x = this.pos.x + 30
        } else if (collisions.right) {
            state.cat.direction = state.cat.direction * -1
            state.cat.pos.x = this.pos.x - 30
        }
    }
}

class Floor {
    constructor(pos, height, ch) {
        this.pos = pos
        this.height = height
        this.ch = ch
        this.speed = new Vec(0.5, 0.5)
        this.maxPos = new Vec(this.pos.x, this.pos.y)
    }

    get type() { return "floor" }

    get boundingBox() {
        return new BoundingBox(this.pos.x, this.pos.y, this.pos.x + blockWidth, this.pos.y + this.height)
    }

    static create(pos, ch) {
        if (ch == "-") {
            return new Floor(pos, blockHeight / 2, ch)
        } else if (ch == "_") {
            return new Floor(pos, blockHeight, ch)
        } else if (ch == "z") {
            return new Floor(pos, blockHeight / 2, ch)
        } else if (ch == "w") {
            return new Floor(pos, blockHeight / 2, ch)
        } else if (ch == "x") {
            return new Floor(pos, blockHeight / 2, ch)
        }
    }

    draw() {
        ctx.beginPath()
        ctx.shadowBlur = 0
        ctx.rect(this.pos.x, this.pos.y, blockWidth, this.height)
        ctx.fillStyle = platformColour
        ctx.fill()
        ctx.closePath()
        this.boundingBox.draw()
    }

    move() {
        if (this.ch == "z") {
            this.pos.x -= this.speed.x
        } else if (this.ch == "w") {
            this.pos.y += this.speed.y
        } else if (this.ch == "x") {
            this.pos.y += this.speed.y
        }

        if (this.pos.y > canvas.height || this.pos.y <= 0) {
            this.speed.y = Math.abs(this.speed.y)
        }

        if (this.pos.x == 0) {
            this.speed.x = -(this.speed.x)
        } else if (this.pos.x >= canvas.width - blockWidth) {
            this.speed.x *= -1
        }
    }

    collide(state, collisions) {
        //console.log(JSON.stringify(collisions))
        if (this.ch == "w" || this.ch == "x") {
            if (collisions.bottom) {
                if (state.cat.jumping) {
                    state.cat.speed.y = this.speed.y + state.cat.jumpSpeed
                } else { state.cat.speed.y = this.speed.y }
                if (this.speed.y < 0) {
                    state.cat.pos.y = this.pos.y - 14
                } else if (this.speed.y > 0) {
                    state.cat.pos.y = this.pos.y - 12
                }
            }
        }

        if (this.ch == "_" || this.ch == "-" || this.ch == "z") {
            if (collisions.bottom) {
                state.cat.standing = true
                state.cat.pos.y = this.pos.y - 13
            } else if (collisions.top) {
                state.cat.pos.y = state.cat.pos.y
            }
        }

    }

    touch(state, touches) {
        //console.log(JSON.stringify(touches))
        if (this.ch == "z") {
            if (touches.right) {
                this.speed.x *= -1
            } else if (touches.left) {
                this.speed.x *= -1
            }
        }

        if (this.ch == "w") {
            if (touches.top && (touches.left && touches.right)) {
                this.speed.y *= -1
            } else if (touches.bottom && (touches.left && touches.right)) {
                this.speed.y = -this.speed.y
            }
        }

        if (this.ch == "x") {
            if (touches.bottom && (touches.left && touches.right)) {
                this.pos.y = this.maxPos.y - 10
            }
        }
    }
}

class Treat {
    constructor(pos, radius, ch) {
        this.pos = pos
        this.radius = radius
        this.ch = ch
        this.speed = 0.02 + Math.random() * 0.04
        this.wobble = 1
        this.maxPos = new Vec(this.pos.x, this.pos.y + this.wobble)
        this.display = true
    }

    get type() { return "treat" }

    get boundingBox() {
        return new BoundingBox(this.pos.x + this.radius, this.pos.y - this.radius, this.pos.x - this.radius, this.pos.y + this.radius)
    }


    static create(pos, ch) {
        let basePos = pos.plus(new Vec(blockWidth / 2, 0))
        if (ch == "o") {
            return new Treat(basePos, 4, ch)
        } else if (ch == "*") {
            return new Treat(basePos, 6, ch)
        }
    }

    draw() {
        if (this.display) {
            ctx.beginPath()
            ctx.shadowColor = treatColour
            ctx.shadowBlur = 5
            ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI)
            ctx.fillStyle = treatColour
            ctx.fill()
            ctx.closePath()
            this.boundingBox.draw()
        }
    }

    move() {
        this.pos.y += this.speed
        if (this.pos.y >= this.maxPos.y + this.wobble) {
            this.speed = -Math.abs(this.speed)
        } else if (this.pos.y <= this.maxPos.y) {
            this.speed = Math.abs(this.speed)
        }
    }

    collide(state, collisions) {
        //console.log(JSON.stringify(collisions))
        this.display = false
    }

}

var levelChars = {
    ".": "space", "#": Wall, "+": Water, "_": Floor,
    "@": Cat, "o": Treat, "*": Treat,
    "=": Water, "|": Water, "v": Water, "-": Floor, "z": Floor, "w": Floor, "x": Floor
}

let restartOption = document.getElementById('restart-game')
let pauseOption = document.getElementById('pause-game')
let playOption = document.getElementById('play-game')
function restartGame() {
    paused = false
    currentLevel = 0
    levelUpCall = false
    level = new Level(levelZero)
    state = new State(level, level.startActors)
}

function pauseGame() {
    paused = true
}
function playGame() {
    paused = false
}

canvas.addEventListener('keydown', (e) => {
    if (e.key === "p") {
        if (!paused) {
            pauseGame()
        } else if (paused) {
            playGame()
        }
    }
})

function controls(state) {
    canvas.addEventListener('keydown', (e) => {
        if (e.key === "ArrowRight") {
            state.cat.moveRight()
        }
        if (e.key === "ArrowLeft") {
            state.cat.moveLeft()
        }
        if (e.key === "ArrowUp") {
            state.cat.jump()
        }
    })
    canvas.addEventListener('keyup', (e) => {
        if (e.key === "ArrowRight") {
            state.cat.stop()
        }
        if (e.key === "ArrowLeft") {
            state.cat.stop()
        }
    })

}

var levels = {
    "0": levelZero,

    "1": levelOne,

    "2": levelTwo,

    "3": levelThree,

    "4": levelFour,
}

let paused = false
let currentLevel = 0
let levelUpCall = false
let level = new Level(levelZero)
let state = new State(level, level.startActors)

restartOption.addEventListener('click', restartGame)
pauseOption.addEventListener('click', pauseGame)
playOption.addEventListener('click', playGame)

function gameLoop(time) {
    let allLives = state.cat.lives

    if (!paused) {
        if (currentLevel <= 4) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = backgroundColour //"thistle" //"skyBlue" 
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            controls(state)
            state.draw(time)
            state.update()
            state.move(time, state)

            if (state.status == "lost") {
                if (state.cat.lives <= 18 && state.cat.lives > 0) {
                    state.resetCat()
                } else if (state.cat.lives == 0) {
                    level = new Level(levels[0])
                    state = new State(level, level.startActors, "playing")
                    currentLevel = 0
                }
                state.status = "playing"
            }

            if (state.status == "won") {
                state.cat.levelUp(state)

                setTimeout(() => levelUpCall = true, 1000)
                if (levelUpCall) {
                    let transferLives = 0
                    currentLevel = currentLevel + 1

                    if (currentLevel == 5) {
                        ctx.fillStyle = backgroundColour
                        ctx.fillRect(0, 0, canvas.width, canvas.height)
                        ctx.fillStyle = treatColour
                        ctx.fillText(`You have won!`, 240, 200)
                        ctx.fillText(`Click to play again.`, 215, 220)
                        canvas.addEventListener("click", restartGame)

                    } else {
                        transferLives += allLives
                        level = new Level(levels[currentLevel])
                        state = new State(level, level.startActors, "playing")
                        state.cat.lives = transferLives

                    }
                }
            }
            levelUpCall = false
        }
    }

    raf = window.requestAnimationFrame(gameLoop)

}

gameLoop()



