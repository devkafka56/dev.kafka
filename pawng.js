// Buttons 

addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("resetButton").onclick = resetGame
    document.getElementById("pauseButton").onclick = pauseGame
    document.getElementById("playButton").onclick = playGame
})


// Game 
const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d")
let raf

function resetGame() {
    ball.x = 300
    ball.y = 150
    ball.speed = 3
    ball.vy = 2
}

function pauseGame() {
    ball.pause()

}

function playGame() {

}


const BALL_SPEED_INTENSIFIES = 1

function getRandomSpeed(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    speed: getRandomSpeed(3, 5),
    //get rid of me
    vy: getRandomSpeed(3, 5),
    getVelocity(){
        return this.direction * this.speed
    },
    direction:1,
    radius: 5,
    color: "red",
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.fillStyle = this.color
        ctx.fill()
    },
    bounce () {
        // Switch direction
        this.direction *= -1
        this.speed = this.speed + BALL_SPEED_INTENSIFIES
    },
    pause () {
        this.savedSpeed = this.speed
        this.speed = 0 
        this.savedVY = this.vy
        this.vy = 0
    }
}

const paddleL = {
    x: 1,
    y: canvas.height / 2,
    width: 5,
    height: 40,
    color: "rgb(255, 255, 255)",
    paddleLVelocity: 0, 
    speed: 4,
    moveUp() {
        this.paddleLVelocity = -this.speed
    },
    moveDown() {
        this.paddleLVelocity = this.speed
    },
    
    stop(){
        this.paddleLVelocity = 0
    },

    move() {
       let topOfScreen = canvas.height - this.height

        // Make sure we don't go over the top
        if (this.y < 0){
            this.y=0
            this.stop()
        }
        // Make sure we don't go past the bottom
        else if (this.y > topOfScreen){
            this.y = topOfScreen
            this.stop()
        }else{
            // Move the paddle by adding velocity to the current position
            this.y += this.paddleLVelocity
        }
    },

    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

const paddleRSpeed = getRandomSpeed(2, 3)

const paddleR = {
    x: canvas.width - 6,
    y: canvas.height / 2,
    width: 5,
    height: 40,
    color: "rgb(255, 255, 255)",
    speed: paddleRSpeed,
    moveTowards(ballY) {
        const randomNum = Math.floor(Math.random() * 6 )

        if (randomNum !== 0) {
            if (this.y + this.height / 2 < ballY) {
                this.y += this.speed
            } else if (this.y + this.height / 2 > ballY) {
                this.y -= this.speed
            }
        }
    },

    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

const scoreBoard = {
    leftScore: 0,
    rightScore: 0,
    color: "rgb(255, 255, 255)",
    incrementleftScore() {
        this.leftScore = this.leftScore + 1
    },
    incrementrightScore() {
        this.rightScore = this.rightScore + 1
    },
    drawScore() {
        ctx.font = "18px Arial"
        ctx.fillStyle = this.color
        ctx.fillText("SCORE", 268, 20)
        ctx.fillText(this.leftScore, 260, 45)
        ctx.fillText(this.rightScore, 330, 45)

        const textWidth = ctx.measureText("SCORE").width
        const startX = 268
        const endX = startX + textWidth
        const y = 15 + 10
        ctx.beginPath()
        ctx.moveTo(startX, y)
        ctx.lineTo(endX, y)
        ctx.strokeStyle = this.color
        ctx.stroke()

    }
}

function centerDash() {
    ctx.beginPath(),
        ctx.strokeStyle = "white"
    ctx.setLineDash([5, 15])
    ctx.moveTo(300, 0)
    ctx.lineTo(300, 600)
    ctx.stroke()

    ctx.setLineDash([])
}

let leftWallHits = 0
let rightWallHits = 0

function draw() {
    ctx.fillStyle = "rgba(8, 2, 40, 0.2)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    centerDash()

    scoreBoard.drawScore()

    paddleL.move()
    paddleL.draw()
    paddleR.draw()

    ball.draw()

    ball.x += ball.getVelocity()
    ball.y += ball.vy

    if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
        ball.vy = -ball.vy
    }


    if (ball.x - ball.radius < 0) {
        leftWallHits++
        scoreBoard.incrementrightScore()
        if (leftWallHits >= 5) {
            alert("Game Over - Right Wall Wins!")
            resetGame()
            leftWallHits = 0
            rightWallHits = 0
            cancelAnimationFrame(raf)
            return
        }
        resetGame()
    }

    if (ball.x + ball.radius > canvas.width) {
        rightWallHits++
        scoreBoard.incrementleftScore()
        if (rightWallHits >= 5) {
            alert("Game Over - Left Wall Wins!")
            resetGame()
            leftWallHits = 0
            rightWallHits = 0
            cancelAnimationFrame(raf)
            return
        }
        resetGame()
    }

    // P1-paddleL
    if (
        ball.x - ball.radius <= paddleL.x + paddleL.width &&
        ball.x - ball.radius >= paddleL.x &&
        ball.y >= paddleL.y &&
        ball.y <= paddleL.y + paddleL.height
    ) {
        ball.bounce()
    }

    // AI-paddleR
    paddleR.moveTowards(ball.y)

    if (
        ball.x + ball.radius > paddleR.x &&
        ball.y > paddleR.y &&
        ball.y < paddleR.y + paddleR.height
    ) {
        ball.bounce()
    }

    raf = window.requestAnimationFrame(draw)
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
        paddleL.moveUp()
    } else if (e.key === "ArrowDown") {
        paddleL.moveDown()
    }
})

document.addEventListener("keyup",(e)=>{
    paddleL.stop()
})

draw()



