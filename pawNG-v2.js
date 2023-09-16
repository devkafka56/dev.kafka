// Game Set-up 
const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d")
let raf
let leftPaddle
let rightPaddle
let ball

// Buttons & Controls 
addEventListener("DOMContentLoaded", (event) => {

    // Buttons
    document.getElementById("resetButton").onclick = startGame
    // document.getElementById("pauseButton").onclick = pauseGame
    // document.getElementById("playButton").onclick = playGame

    // Controls 
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") {
            leftPaddle.moveUp()
        } else if (e.key === "ArrowDown") {
            leftPaddle.moveDown()
        }
    })

    document.addEventListener("keyup", (e) => {
        leftPaddle.stop()
    })
})

// Physics (The mechanisms working behind the scenes to set up the possibilities for how objects can function and interact with one another, generally the possibilities and rules for the pawNG world)
const UP = Math.PI / 2
const DOWN = 3 * Math.PI / 2

// *Sets Position of Objects, incl function to change that position by adding velocity to the x and y coordinates 
class Position {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    displace(velocity) {
        this.x += velocity.vx
        this.y += velocity.vy
    }
}

// *Stores Velocity of Objects, incl functions to determine velocity, speed and direction. 
class Velocity {
    constructor(speed, directionInRad) {
        this.speed = speed
        this.directionInRad = directionInRad
        this.setVelocity()
    }

    setVelocity() {
        this.vx = Math.cos(this.directionInRad) * this.speed
        this.vy = Math.sin(this.directionInRad) * this.speed
    }

    setSpeed(speed) {
        this.speed = speed
        this.setVelocity()
    }

    setDirection(direction) {
        this.directionInRad = this.direction
        this.setVelocity()
    }

}

// *Objects with this class are able to move using the Position and Velocity classes (giving the four passable parameters), includes the displace method set in Position within the move function to allow the Object to move. 
class MoveThing {
    constructor(position, velocity) {
        this.position = position
        this.velocity = velocity
    }

    move() {
        this.position.displace(this.velocity)
    }
}

// *Sets the colour and start position of Objects that appear on the canvas. Objects within this class can either be static or eventually move with the MoveThing class. 
class Shape {
    constructor(color) {
        this.color = color
    }

    draw() {
        ctx.fillStyle = this.color
    }

    setStartPos(position) {
        this.startPos = position
    }
}

// *Allows for the creation of Objects that will appear in the game loop. Connects MoveThing and Shapeby passing tge position that's stored in MoveThing to the instance of Shape. 
class GameObject {
    constructor(shape, moveThing) {
        this.shape = shape
        this.moveThing = moveThing
    }

    setDirection(direction) {
        this.moveThing.velocity.setDirection(direction)
    }

    setSpeed(speed) {
        this.moveThing.speed
    }

    draw() {
        let startPos = this.moveThing.position
        this.shape.setStartPos(startPos)
        this.shape.draw()
    }
}

// Paint

// This is the class for all lines that appear on the screen, like the arena line, and the underline of the word "SCORE". 
class Line {
    constructor() {

    }


}

// *Used to create Objects that are rectangles or squares, gives color, width and height. 
class RectThing extends Shape {
    constructor(color, width, height) {
        super(color)
        this.width = width
        this.height = height
    }

    draw() {
        super.draw()
        ctx.fillRect(this.startPos.x, this.startPos.y, this.width, this.height)
    }
}

// * Same as RectThing, but makes a circle :3. 
class CircleThing extends Shape {
    constructor(color, radius) {
        super(color)
        this.radius = radius
    }

    draw() {
        ctx.beginPath()
        super.draw()
        ctx.arc(this.startPos.x, this.startPos.y, this.radius, Math.PI * 2, 0)
        ctx.closePath()
        ctx.fill()
    }
}

// Game Objects
 
class Paddle extends GameObject {
    constructor(color, x, y, speed, directionInRad) {
        super(new RectThing(color, 5, 40), new MoveThing(new Position(x, y), new Velocity(speed, directionInRad)))
    }

    moveUp() {
        this.moveThing.velocity = UP
    }

    moveDown() {
        this.moveThing.velocity.directionInRad = DOWN
    }

    stop() {
        this.moveThing.velocity.directionInRad = 0
    }

}

// Class for the ball. 
    // **FOLLOW UP: Since we have a whole class for ball, maybe we should make a CHAOS mode which includes faster paddles and more balls?**

class Ball extends GameObject {
    constructor(color, x, y, speed, directionInRad) {
        super(new CircleThing(color, 5), new MoveThing(new Position(x, y), new Velocity(speed, directionInRad)))
    }
}

// Game Set-Up 

function startGame() {
    leftPaddle = new Paddle("white", 1, canvas.height / 2, 0, 0)
    rightPaddle = new Paddle("white", 595, canvas.height / 2, 0, 0) // variables for canvas width and height in middle of canvas
    ball = new Ball("red", canvas.width / 2, canvas.height / 2, 2, 0)

    gameLoop()
}

function drawArena() {
    ctx.fillStyle = "rgba(8, 2, 40, 0.2)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

// Game Play

function gameLoop() {

    drawArena()

    leftPaddle.draw()
    rightPaddle.draw() 
    ball.draw()
    ball.moveThing.move()

    // registerCollision(leftPaddle,top)

    // registerCollision(leftPaddle,bottom,(){

    // })

    raf = window.requestAnimationFrame(gameLoop)
}

startGame()