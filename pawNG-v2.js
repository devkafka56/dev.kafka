// Game Set-up 
const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d")
let raf
let leftPaddle
let rightPaddle
let ball
let gameBoundary
const SHOW_BOUNDING_BOXES = true

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

    changeDirection(direction) {
        this.directionInRad += direction
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

    changeDirection(direction) {
        this.moveThing.velocity.changeDirection(direction)
    }

    setSpeed(speed) {
        this.moveThing.speed = speed
    }

    draw() {
        let startPos = this.moveThing.position
        this.shape.setStartPos(startPos)
        this.shape.draw()
    }
}

function registerCollision(gameObject1, gameObject2, collisionCallBack) {
    //check if gameObject1 and gameObject2 are touching 
    //call the 
    //how do we check that go1 and go2 are touching? that has to happen before the collisionCallBack :3 

    let boundingBox1 = gameObject1.shape.getBoundingBox()
    let boundingBox2 = gameObject2.shape.getBoundingBox()
    boundingBox1.drawBoundingBox()
    boundingBox2.drawBoundingBox()
    if (boundingBox1.inBounds(boundingBox2) || boundingBox2.inBounds(boundingBox1)) {
        collisionCallBack(true)
    }
    collisionCallBack(false)
}

// Paint

// This is the class for all lines that appear on the screen, like the arena line, and the underline of the word "SCORE". 
class Line {
    constructor() {

    }


}

class BoundingBox {
    constructor(maxX, maxY, minX, minY) {
        this.maxX = maxX
        this.maxY = maxY
        this.minX = minX
        this.minY = minY
    }

    drawBoundingBox() {
        if (SHOW_BOUNDING_BOXES){
            ctx.fillStyle = "rgba(9, 176, 63, 0.5)"
            ctx.fillRect(this.minX, this.minY, this.maxX - this.minX, this.maxY - this.minY)
        }


    }

    inBounds(boundingBox) {


        // if any two perpendicular lines (out of 4) are in between the bounding box lines then there is a collision.

        // Having an x collision is when the min y or max y lines are in between the max and min of the bounding box.

        // Check min line ( if the lines is less than the max and greater than the min)
        return (((this.minY < boundingBox.maxY && this.minY > boundingBox.minY) ||
         (this.maxY < boundingBox.maxY && this.maxY > boundingBox.minY)) &&
         ((this.minX < boundingBox.maxX && this.minX > boundingBox.minX) ||
          (this.maxX < boundingBox.maxX && this.maxX > boundingBox.minX)))

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

    getBoundingBox() {
        let startPos = this.startPos
        let maxX = startPos.x + this.width
        let maxY = startPos.y + this.height
        let minX = startPos.x
        let minY = startPos.y

        return new BoundingBox(maxX, maxY, minX, minY)

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

    getBoundingBox() {
        let startPos = this.startPos
        let maxX = startPos.x + this.radius
        let maxY = startPos.y + this.radius
        let minX = startPos.x - this.radius
        let minY = startPos.y - this.radius

        return new BoundingBox(maxX, maxY, minX, minY)

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
    constructor(color, radius, x, y, speed, directionInRad) {
        super(new CircleThing(color, radius), new MoveThing(new Position(x, y), new Velocity(speed, directionInRad)))
    }
}

// Game Set-Up 

function startGame() {
    leftPaddle = new Paddle("white", 1, canvas.height / 2, 0, 0)
    rightPaddle = new Paddle("white", canvas.width - 5, canvas.height / 2 - 20, 0, 0) // variables for canvas width and height in middle of canvas
    ball = new Ball("red", 5, canvas.width / 2, canvas.height / 2, 2, 3.1)
    gameBoundary = new BoundingBox(canvas.width,canvas.height,0,0)


    gameLoop()
}

function drawArena() {
    ctx.fillStyle = "rgba(8, 2, 40, 0.2)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

// Game Play

function ballBounce(isColliding) {
    if(isColliding){
        ball.changeDirection(Math.PI*Math.random())

    }
    console.log('ball bounce')
}

function gameLoop() {

    drawArena()

    leftPaddle.draw()
    rightPaddle.draw()
    ball.draw()
    ball.moveThing.move()
    registerCollision(ball, leftPaddle,ballBounce)
    registerCollision(ball, rightPaddle,ballBounce)
    registerCollision(ball,gameBoundary,(isColliding)=>{
        if (!isColliding){
            alert("ball left boundary")
        }
    })

    raf = window.requestAnimationFrame(gameLoop)
}

startGame()