const canvas = document.getElementById("catVmouseCanvas")
const ctx = canvas.getContext("2d")
const cHeight = canvas.height
const cWidth = canvas.width
const blockHeight = 20
const blockWidth = 15
const showBoundingBoxes = false
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

// canvas.addEventListener('mousemove', showMousePos)

//Game Engine 

var simpleLevelPlan = `
........................................
........o.............................o.
.....................................___
.........--...........o..............#..
#.@.................----..........___#..
#____.............................#.....
#...#+++++_____................o..#.....
#...#+++++#...#...................#.....
#...#_____#...#...............____#.....
#..................zzz........#.........
#.............................#.........
#........._---_-..............#.........
#.........#...#+++++++#--.....#.........
#---......#...#_______#.......#.........
#.==......#...........#.o...__#.........
#....o....#...........#--...#...........
#...o.o---#...........#+++++#...........
#..o.o.o..#...........#_____#...........
#.o.o.o.o.#.............................
#_________#.............................`

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
            current.draw(time, this)
        }
        this.cat.draw(time, this)
    }

    move(time) {
        this.actors.filter(actor => "move" in actor).forEach(actor => actor.move(time, this))
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
                actor.collide(state, collisions)
            }
        })

        let totalTreats = actors.filter(a => a.type == "treat")
        totalTreats.forEach((a) => { if (a.display == "false") { collectedTreats.push(a) } })
        if (totalTreats.length == collectedTreats.length) state.status = "won"

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
        this.height = 36
        this.width = 31
        this.size = new Vec(31, 36)

        //movement flags
        this.isOnTheMat = false
        this.wet = false
        this.jumping = false

        //colouring 
        this.legsTailColour = "#2b1c14"
        this.bodyColour = "blanchedAlmond"
        //animation
        this.walking = false
        this.float = 0.01
        this.wobble = 0.8
        this.maxPos = new Vec(this.pos.x, this.pos.y + this.wobble)

    }

    get type() { return "cat" }

    get boundingBox() {
        return new BoundingBox(this.pos.x - 14, this.pos.y - 14, this.pos.x + 14, this.pos.y + 14)
    }

    static create(pos) {
        return new Cat(pos.plus(new Vec(blockWidth - 4, blockHeight - 14.5)))
    }

    draw(time, state) {
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
        ctx.strokeStyle = this.legsTailColour
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
        ctx.fillStyle = this.legsTailColour
        ctx.fill()
        ctx.closePath()

        //body
        ctx.beginPath()
        ctx.ellipse(0, 0, 12, 9, 0, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.fillStyle = this.bodyColour
        ctx.fill()

        //front ear
        ctx.beginPath()
        ctx.moveTo(2, -5)
        ctx.lineTo(4, -13)
        ctx.lineTo(6, -7)
        ctx.fillStyle = this.legsTailColour
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
        //this.bounce()
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
            if (!this.isOnTheMat) {
                this.speed.y -= 7
            }
        }

        if (!this.jumping) {
            this.speed.y -= 0.5
        }

        if (this.isOnTheMat) {
            this.speed.y = Math.max(this.speed.y, 0)
        }

        this.pos.x += this.speed.x * this.direction
        this.pos.y -= this.speed.y

        if (this.wet) {
            if (!this.isOnTheMat) {
                let newlegsTailColour = "rgba(11, 50, 66, 0.6)"
                let newBodyColour = "rgba(18, 83, 109, 0.3)"
                this.legsTailColour = newlegsTailColour
                this.bodyColour = newBodyColour
                let sink = () => state.status = "lost"
                if (this.legsTailColour == newlegsTailColour) {
                    setTimeout(sink, 1000)
                }
            }
        }

        this.wet = false
        this.isOnTheMat = false
        this.jumping = false
    }

    moveLeft() {
        this.walking = true
        this.speed.x = 3
        this.direction = -1
        if (this.isOnTheMat) {
            this.speed.x = 1
        }
    }

    moveRight() {
        this.walking = true
        this.speed.x = 3
        this.direction = 1
        if (this.isOnTheMat) {
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

    collide(state, collisions) {

        if (this.ch == "+") {
            //let sink = () => state.status = "lost"
            //setTimeout(sink, 500)
            state.cat.wet = true
        }

        // else {
        //     state.status = "lost"
        // }
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
        if (collisions.top) {
            state.cat.direction = state.cat.direction
            state.cat.pos.y = state.cat.pos.y
        } else if (collisions.bottom) {
            state.cat.direction = state.cat.direction
            state.cat.pos.y = state.cat.pos.y
        } else if (collisions.left) {
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
        if (collisions.bottom) {
            state.cat.isOnTheMat = true
            state.cat.pos.y = this.pos.y - 13
        } else if (collisions.top) {
            state.cat.pos.y = state.cat.pos.y + 5
        }
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
        //console.log(JSON.stringify(collisions))
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


let level = new Level(simpleLevelPlan)
let state = new State(level, level.startActors)
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
function gameLoop(time) {

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    state.draw(time)
    state.update()
    state.move(time)

    if (state.status == "lost") {
        level = new Level(simpleLevelPlan)
        state = new State(level, level.startActors)
    }

    if (state.status === "won") {
        state.cat.won()
    }

    raf = window.requestAnimationFrame(gameLoop)
}

gameLoop()
