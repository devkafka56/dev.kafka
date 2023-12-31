// Game Set-up 
const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d")
let raf
let leftPaddle
let rightPaddle
let ball1
let gameBoundary
let leftScore = 0
let rightScore = 0
let isGameLoopRunning = false
const SHOW_BOUNDING_BOXES = true
const DOWN = Math.PI / 2
const UP = 3 * Math.PI / 2
const pointsToWin = 5
const halfCanvasWidth = canvas.width / 2
const halfCanvasHeight = canvas.height / 2
// const RADIANS = {
//     'UP': 3 * Math.PI / 2,
//     'DOWN': Math.PI / 2,
//     'RIGHT': 2 * Math.PI, 
//     'LEFT': Math.PI,
//     'UP-RIGHT': Math.PI / 3,
//     'UP-RIGHT-2': 1 * Math.PI / 6,
//     'DOWN-RIGHT': 11 * Math.PI / 6,
//     'DOWN-RIGHT-2': 10 * Math.PI / 6,
//     'UP-LEFT': 2 * Math.PI / 3,
//     'UP-LEFT-2': 5 * Math.PI / 6,
//     'DOWN-LEFT': 7 * Math.PI / 6
//     'DOWN-LEFT-2': 4 * Math.PI / 3,
// }
const RADIANS = [3 * Math.PI / 2, Math.PI / 2, 2 * Math.PI, Math.PI, Math.PI / 3, 11 * Math.PI / 6, 2 * Math.PI / 3, 7 * Math.PI / 6, 1 * Math.PI / 6, 10 * Math.PI / 6, 5 * Math.PI / 6, 4 * Math.PI / 3]


// Buttons & Controls 
addEventListener("DOMContentLoaded", (e) => {

    // Buttons
    document.getElementById("resetButton").onclick = startGame
    document.getElementById("pauseButton").onclick = pauseGame
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

    saveSpeed() {
        this.savedSpeed = this.speed
        this.speed = this.setSpeed(0)
    }

    returnSpeed() {
        this.speed = this.savedSpeed 
        this.setSpeed(this.speed)
    }

    changeDirection(xChange, yChange) {
        if (xChange) {
            this.vx *= -1
        }
        if (yChange) {
            this.vy *= -1
        }
    }

    changeAngle() {
        let radiansIndex = Math.floor(Math.random() * (RADIANS.length - 2)) + 2   
       
        let num = 1 + Math.random() * 2
        //let num = RADIANS[radiansIndex]
        this.directionInRad += num
        this.setVelocity()   
    }
}

class MoveThing {
    constructor(position, velocity) {
        this.position = position
        this.velocity = velocity
    }

    move() {
        this.position.displace(this.velocity)
    }
    
}


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


class GameObject {
    constructor(shape, moveThing) {
        this.shape = shape
        this.moveThing = moveThing
    }

    changeDirection(xChange, yChange) {
        this.moveThing.velocity.changeDirection(xChange, yChange)
    }

    changeAngle() {
        this.moveThing.velocity.changeAngle()
    }

    setSpeed(speed) {
        this.moveThing.speed = speed
    }

    saveSpeed() {
        this.savedSpeed = this.moveThing.velocity.speed
        this.moveThing.velocity.speed = this.setSpeed(0)
    }

    returnSpeed() {
        this.moveThing.velocity.speed = this.saveSpeed()
    }

    draw() {
        let startPos = this.moveThing.position
        this.shape.setStartPos(startPos)
        this.shape.draw()
    }
}

function registerCollision(object1, object2, collisionCallBack) {
    let boundingBox1 = object1 instanceof GameObject ? object1.shape.getBoundingBox() : object1
    let boundingBox2 = object2 instanceof GameObject ? object2.shape.getBoundingBox() : object2

    if (boundingBox1.inBounds(boundingBox2) || boundingBox2.inBounds(boundingBox1)) {
        collisionCallBack(true, object1, object2)
    } else {
        collisionCallBack(false, object1, object2)
    }
}

// This is the class for all lines that appear on the screen, like the arena line, and the underline of the word "SCORE". 

class BoundingBox {
    constructor(maxX, maxY, minX, minY) {
        this.maxX = maxX
        this.maxY = maxY
        this.minX = minX
        this.minY = minY
    }

    drawBoundingBox() {
        if (SHOW_BOUNDING_BOXES) {
            ctx.fillStyle = "rgba(9, 176, 63, 0.5)"
            ctx.fillRect(this.minX, this.minY, this.maxX - this.minX, this.maxY - this.minY)
        }

    }

    inBounds(boundingBox) {

        return (((this.minY < boundingBox.maxY && this.minY > boundingBox.minY) ||
            (this.maxY < boundingBox.maxY && this.maxY > boundingBox.minY)) &&
            ((this.minX < boundingBox.maxX && this.minX > boundingBox.minX) ||
                (this.maxX < boundingBox.maxX && this.maxX > boundingBox.minX)))

    }
}

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

class Paddle extends GameObject {
    constructor(color, x, y, speed, directionInRad) {
        super(new RectThing(color, 5, 40), new MoveThing(new Position(x, y), new Velocity(speed, directionInRad)))
    }

    moveUp() {
        this.moveThing.velocity.directionInRad = UP
        this.moveThing.velocity.setSpeed(5)
        if (this.moveThing.position.y < 0) {
            this.stop()
        }

    }

    moveDown() {
        this.moveThing.velocity.directionInRad = DOWN
        this.moveThing.velocity.setSpeed(5)
        if (this.moveThing.position.y > 260) {
            this.stop()
        }
    }

    stop() {
        this.moveThing.velocity.setSpeed(0)
    }

}

function paddleBot(paddle, ball) {
    if (ball.moveThing.position.y > paddle.moveThing.position.y) {
        paddle.moveDown()
    }

    if (ball.moveThing.position.y < paddle.moveThing.position.y) {
        paddle.moveUp()
    }
}


class Ball extends GameObject {
    constructor(color, radius, x, y, speed, directionInRad) {   
        super(new CircleThing(color, radius), new MoveThing(new Position(x, y), new Velocity(speed, directionInRad)))
    }

}

function startGame() {
    leftScore = 0
    rightScore = 0
    resetGame()
    if (!isGameLoopRunning) { gameLoop() }
}

function resetGame() {
    leftPaddle = new Paddle("white", 1, canvas.height / 2, 0, 0)
    rightPaddle = new Paddle("white", canvas.width - 5, canvas.height / 2 - 20, 0, 0)
    ball1 = new Ball("red", 5, halfCanvasWidth, canvas.height / 2, 3, 2.5)
    gameBoundary = new BoundingBox(canvas.width, canvas.height, 0, 5)
}

function pauseGame() {
    ball1.saveSpeed()
}

function drawArena() {
    ctx.fillStyle = "rgba(8, 2, 40, 0.2)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    function centerDash() {
        ctx.beginPath(),
            ctx.strokeStyle = "white"
        ctx.setLineDash([5, 15])
        ctx.moveTo(halfCanvasWidth, 0)
        ctx.lineTo(halfCanvasWidth, canvas.height)
        ctx.stroke()
        ctx.setLineDash([])
    }
    centerDash()

    function drawScore() {
        ctx.font = "20px Courier New"
        ctx.fillStyle = "white"
        ctx.fillText(leftScore, 260, 30)
        ctx.fillText(rightScore, 330, 30)

    }

    drawScore()
}

// Game Play

function ballBounce(isColliding, ball) {
    if (isColliding) {
        console.log("ballBounce active")
        ball.changeDirection(true, false)
        ball.changeAngle()
    }
}

function score() {
    if ((leftScore >= pointsToWin) || (rightScore >= pointsToWin)) { startGame() }
    resetGame()
}

function leavingBoundary(isColliding, ball) {
    if (!isColliding) {
        if (ball.moveThing.position.x < 0) {
            rightScore += 1
            score()
        }

        if (ball.moveThing.position.x > canvas.width) {
            leftScore += 1
            score()
        }
        
        if (ball.moveThing.position.y > canvas.height || ball.moveThing.position.y > canvas.width) {
            console.log("leavingBoundary (greater than height) Bounce active")
            ball.changeDirection(false, true)
            ball.changeAngle()
            //registerCollision(ball, gameBoundary, ballBounce)

        }

        if (ball.moveThing.position.y < 0) {
            console.log("leavingBoundary (less than height) Bounce active")
            ball.changeDirection(false, true)
            ball.changeAngle()
            //registerCollision(ball, gameBoundary, ballBounce)
        }

    }

   
}


function gameLoop() {
    isGameLoopRunning = true

    drawArena()
    leftPaddle.draw()
    rightPaddle.draw()
    ball1.draw()
    ball1.moveThing.move()
    leftPaddle.moveThing.move()
    rightPaddle.moveThing.move()
    paddleBot(rightPaddle, ball1)
    registerCollision(ball1, leftPaddle, ballBounce)
    registerCollision(ball1, rightPaddle, ballBounce)
    registerCollision(ball1, gameBoundary, leavingBoundary)

    raf = window.requestAnimationFrame(gameLoop)
}

startGame()