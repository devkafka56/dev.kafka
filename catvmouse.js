const canvas = document.getElementById("catVmouseCanvas")
const ctx = canvas.getContext("2d")
const cHeight = canvas.height
const cWidth = canvas.width
const blockHeight = 20
const blockWidth = 15
const showBoundingBoxes = true
const bottom = "bottom"

let raf


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
        this.colour = "rgba(9, 176, 63, 0.5)"
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
        let catBox = this
        let leftRightAligned = !((catBox.right < boundingBox.left) && (catBox.left < boundingBox.left)) || ((boundingBox.right < catBox.left) && (boundingBox.left < catBox.left))
        let topBottomAligned = !((catBox.right < boundingBox.left) && (catBox.left < boundingBox.left)) || ((boundingBox.right < catBox.left) && (boundingBox.left < catBox.left))

        let bottom = (catBox.bottom >= boundingBox.top && catBox.bottom <= boundingBox.bottom) && !leftRightAligned


        let top = ((catBox.top >= boundingBox.top && catBox.top <= boundingBox.bottom) &&
            ((catBox.left >= boundingBox.left && catBox.left <= boundingBox.right) ||
                (catBox.right >= boundingBox.left && catBox.left <= boundingBox.right)))


        let left = ((catBox.left >= boundingBox.left && catBox.left <= boundingBox.right) &&
            ((catBox.top >= boundingBox.top && catBox.top <= boundingBox.bottom) ||
                (catBox.bottom >= boundingBox.top && catBox.bottom <= boundingBox.bottom)))

        let right = (((catBox.right >= boundingBox.left && catBox.right <= boundingBox.right) &&
            ((catBox.top >= boundingBox.top && catBox.top <= boundingBox.bottom) ||
                (catBox.bottom >= boundingBox.top && catBox.bottom <= boundingBox.bottom))) ||

            ((boundingBox.left <= catBox.right && boundingBox.left >= catBox.left) &&
                ((boundingBox.bottom >= catBox.bottom && boundingBox.bottom <= catBox.top) ||
                    (boundingBox.right >= catBox.left && boundingBox.left <= catBox.right))))


        // if (bottom) {
        //      bottom
        // }

        // if (top) {
        //     return top
        // }

        // if (left) {
        //     return left
        // }

        // if (right) {
        //     return right
        // }

        let collision = right || left || top || bottom
        return collision ? { "bottom": bottom, "top": top, "left": left, "right": right } : null

        //let example = { "bottom": bottom, "top": top, "left": left, "right": right }

    }

}

// canvas.addEventListener('mousemove', showMousePos)

//Game Engine 

var simpleLevelPlan = `
........................................
........................................
........................................
........................................
........................................
...@..o.................................
.#_____.................................
......_..o..............................
......_.................................
......#_____............................
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

    get cat() {
        return this.actors.find(a => a.type == "cat")
    }

    draw(time) {
        ctx.fillStyle = "thistle"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        for (let i = 0; i < this.actors.length; i++) {
            let current = this.actors[i]
            if (current == "cat") { continue }
            current.draw(time)
        }
        this.cat.draw(time)
    }

    move(time) {
        this.actors.filter(actor => "move" in actor).forEach(actor => actor.move(time))
    }

    update() {
        let state = this
        let actors = this.actors
        let cat = this.cat
        let catBox = cat.boundingBox
        actors.filter(actor => "collide" in actor).forEach((actor) => {
            let actorBox = actor.boundingBox
            let collisions = catBox.touches(actorBox)
            if (collisions) {
                actor.collide(state, collisions)
            }
        })

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
        this.isOnTheMat = false
        this.direction = 1

        this.height = 36
        this.width = 31
        this.size = new Vec(31, 36)
        //animation
        this.walking = false
        this.float = 0.01
        this.wobble = 0.8
        this.maxPos = new Vec(this.pos.x, this.pos.y + this.wobble)

    }

    get type() { return "cat" }

    get boundingBox() {
        return new BoundingBox(this.pos.x - 14, this.pos.y - 14, this.pos.x + 17, this.pos.y + 14)
    }

    static create(pos) {
        return new Cat(pos.plus(new Vec(blockWidth - 4, blockHeight - 14.5)))
    }

    draw(time) {
        const yToGround = 13
        const xToGround = 10
        const yToBody = 9
        const toBody = 6
        const legSpeed = 500
        const legRate = 300

        ctx.save()
        ctx.translate(this.pos.x, this.pos.y)
        if (this.direction == -1) {
            ctx.scale(-1, 1)
        }

        //legs
        ctx.strokeStyle = "#2b1c14"
        ctx.lineWidth = 3
        ctx.lineCap = "round"
        //front right 
        ctx.beginPath()
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
        //front left
        ctx.beginPath()
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
        //back right
        ctx.beginPath()
        if (this.walking === false) {
            ctx.moveTo(-xToGround, toBody)
            ctx.lineTo(-xToGround, yToGround)
        } else if (this.walking === true) {
            if (time % legSpeed < legRate) {
                ctx.moveTo(-xToGround, toBody)
                ctx.lineTo(-xToGround + 1, yToGround)
            } else {
                ctx.moveTo(-xToGround, toBody)
                ctx.lineTo(-xToGround - 1, yToGround)
            }
        }
        ctx.stroke()
        ctx.closePath()
        //tail 
        ctx.beginPath()
        ctx.moveTo(-12, 0)
        if (time % 1000 < 500) {
            ctx.quadraticCurveTo(-12, -20, -19, -17)
        }
        else {
            ctx.quadraticCurveTo(-15, -20, -5, -18)
        }
        ctx.lineWidth = 6
        ctx.stroke()
        ctx.closePath()

        //back ear
        ctx.beginPath()
        ctx.moveTo(5, -5)
        ctx.lineTo(7, -13)
        ctx.lineTo(9, -7)
        ctx.fillStyle = "#2b1c14"
        ctx.fill()
        ctx.closePath()

        //body
        ctx.beginPath()
        ctx.ellipse(0, 0, 12, 9, 0, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.fillStyle = "blanchedAlmond"
        ctx.fill()

        //front ear
        ctx.beginPath()
        ctx.moveTo(2, -5)
        ctx.lineTo(4, -13)
        ctx.lineTo(6, -7)
        ctx.fillStyle = "#2b1c14"
        ctx.fill()
        ctx.closePath()

        //eye 
        ctx.beginPath()
        ctx.arc(7, -2, 1, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fillStyle = "steelBlue"
        ctx.fill()

        ctx.restore()
        this.boundingBox.draw()
        this.bounce()
    }

    bounce() {
        this.pos.y += this.float
        if (this.pos.y >= this.maxPos.y + this.wobble) {
            this.float = -Math.abs(this.float)
        } else if (this.pos.y <= this.maxPos.y) {
            this.float = Math.abs(this.float)
        }
    }

    // gravity() {

    // }

    move(time) {

        this.pos.x += this.speed.x * this.direction

        if (!this.isOnTheMat) {
            this.speed.y = 1
            this.pos.y += this.speed.y + 1 * 1


        }
        this.isOnTheMat = false

    }

    moveLeft() {
        this.walking = true
        this.speed.x = 1
        this.direction = -1
    }

    moveRight() {
        this.walking = true
        this.speed.x = 1
        this.direction = 1
    }

    stop() {
        this.walking = false
        this.speed.x = 0

    }
}

class Water {
    constructor(pos, height, ch) {
        this.pos = pos
        this.height = height
        this.ch = ch
        this.speed = 0.5
        this.axis = 70
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
        } else if (ch == "X") {
            return new Water(pos, blockHeight / 2, ch)

        }
    }

    draw() {
        ctx.beginPath()
        ctx.rect(this.pos.x, this.pos.y, blockWidth, this.height)
        ctx.fillStyle = "skyBlue"
        ctx.fill()
        ctx.closePath()
        this.boundingBox.draw()
    }

    move() {
        if (this.ch == "=") {
            this.pos.x += this.speed
            if (this.pos.x >= this.maxPos.x + this.axis || this.pos.x <= this.maxPos.x) {
                this.speed *= -1
            }
        }

    }

    collide(state) {
        let sink = () => state.status = "lost"
        setTimeout(sink, 500)
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
        ctx.rect(this.pos.x, this.pos.y, blockWidth, blockHeight)
        ctx.fillStyle = "rosyBrown"
        ctx.fill()
        ctx.closePath()
        this.boundingBox.draw()
    }

    collide(state, collisions) {

        state.cat.stop()
        console.log(JSON.stringify(collisions))
        state.cat.pos.x = this.pos.x + 20 * 2
    }
}

class Floor {
    constructor(pos, height, ch) {
        this.pos = pos
        this.height = height
        this.ch = ch
        this.speed = 0.5
        this.axis = 70
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
        }
    }

    draw() {
        ctx.beginPath()
        ctx.rect(this.pos.x, this.pos.y, blockWidth, this.height)
        ctx.fillStyle = "rosyBrown"
        ctx.fill()
        ctx.closePath()
        this.boundingBox.draw()
    }

    move() {
        if (this.ch == "z") {
            this.pos.x += this.speed
            if (this.pos.x >= this.maxPos.x + this.axis || this.pos.x <= this.maxPos.x) {
                this.speed *= -1
            }
        }
    }

    collide(state, collisions) {
        state.cat.speed.y = 0
        console.log(JSON.stringify(collisions))
        state.cat.isOnTheMat = true
    }
}

class Treat {
    constructor(pos, radius) {
        this.pos = pos
        this.radius = radius
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
        let basePos = pos.plus(new Vec(0.2, 0.1))
        if (ch == "o") {
            return new Treat(basePos, 4)
        } else if (ch == "*") {
            return new Treat(basePos, 6)
        }
    }

    draw() {
        if (this.display) {
            ctx.beginPath()
            ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI)
            ctx.fillStyle = "gold"
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
        console.log(JSON.stringify(collisions))
        this.display = false
    }
}

var levelChars = {
    ".": "space", "#": Wall, "+": Water, "_": Floor,
    "@": Cat, "o": Treat, "*": Treat,
    "=": Water, "|": Water, "v": Water, "-": Floor, "z": Floor
}

var movingChars = {
    "o": Treat, "*": Treat,
    "=": Water, "|": Water, "v": Water, "-": Floor
}

//Game Opening: You are a cat. You live a simple life. Until one day a mouse moved in. You ignored her antics until one day she crossed the line by stealing your favourite toy, a plush pickle stuffed with cat nip. You are now determined to recover the lost toy at all costs. After all, it was a gift from your grandmother. 

function gameIntro() {
    function displayText(text) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#000'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        ctx.fillText(text, canvas.width / 2, canvas.height / 2)
    }

    displayText("Start")

    document.getElementById('catVmouseCanvas').addEventListener('click', function () {
        displayText('Hello')

    })
}

// function runLevel(level, time) {

//     //let state = State.start(level)

//     canvas.addEventListener('keydown', (e) => {
//         if (e.key === "ArrowRight") {
//             state.cat.moveRight()
//         }
//         if (e.key === "ArrowLeft") {
//             state.cat.moveLeft()
//         }
//     })
//     canvas.addEventListener('keyup', () => {
//         state.cat.stop()
//     })

//     state.move()
//     state.draw(time)
//     state.update()

//     if (state.status == "lost") {
//         //state.lost()
//     }
// }

//const treatActors = state.level.startActors.filter(actor => actor.type === "treat")
//treatActors.forEach(a => a.move())

let level = new Level(simpleLevelPlan)
let state = new State(level, level.startActors)
canvas.addEventListener('keydown', (e) => {
    if (e.key === "ArrowRight") {
        state.cat.moveRight()
    }
    if (e.key === "ArrowLeft") {
        state.cat.moveLeft()
    }
})
canvas.addEventListener('keyup', () => {
    state.cat.stop()
})
function gameLoop(time) {

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    state.draw(time)
    state.update()
    state.move(time)

    if (state.status == "lost") {
        level = new Level(simpleLevelPlan)
        state = new State(level, level.startActors)
    }

    raf = window.requestAnimationFrame(gameLoop)
}

gameLoop()
