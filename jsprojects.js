var raf
addEventListener("DOMContentLoaded", (event) => {
    //P1: Stop Watch 
    let tens = 0o0 //stores milliseconds
    let seconds = 0o0 //stores seconds
    let minutes = 0o0 //stores minutes
    let appendTens = document.getElementById("tens") //selects html element, assigns let to it, used to display milliseconds
    let appendSeconds = document.getElementById("seconds") //above, but seconds 
    let appendMinutes = document.getElementById("minutes") //above, but minutes
    let buttonStart = document.getElementById("button-start") // above, but selects html element for start button. 
    let buttonStop = document.getElementById("button-stop") // above, but for stop button
    let buttonReset = document.getElementById("button-reset")//above, but for reset button 
    let Interval

    //Start Button Function 

    buttonStart.onclick = function () {
        clearInterval(Interval) //clears any previous intervals on timer 
        Interval = setInterval(startTimer, 10) //starts timer at 10 milliseconds (setInterval expects second argument in milliseconds)
    }

    buttonStop.onclick = function () {
        clearInterval(Interval) //while the setInterval function is running, this stops/pauses it. 
    }

    buttonReset.onclick = function () {
        clearInterval(Interval) //clears the interval completely 
        tens = "00"
        seconds = "00"
        minutes = "00"
        appendTens.innerHTML = tens //corresponds to the html whcih displays the milliseconds updating it.
        appendSeconds.innerHTML = seconds //above but seconds 
        appendMinutes.innerHTML = minutes //above but minutes 
    }

    function startTimer() {
        tens++ //begins by adding time in 10 milliseconds 

        if (tens <= 9) {
            appendTens.innerHTML = 0 + tens
        }

        if (tens > 9) {
            appendTens.innerHTML = tens
        }

        if (tens > 99) {
            console.log("seconds")
            seconds++
            appendSeconds.innerHTML = "0" + seconds
            tens = 0
            appendTens.innerHTML = "00"
        }

        if (seconds > 9) {
            appendSeconds.innerHTML = seconds
        }

        if (seconds > 59) {
            console.log("minutes")
            minutes++
            appendMinutes.innerHTML = "0" + minutes < 10 ? "0" + minutes : minutes
            seconds = 0
            appendSeconds.innerHTML = "00"
            tens = 0
            appendTens.innerHTML = "00"
        }

        if (minutes > 9) {
            appendMinutes.innerHTML = minutes
        } else {
            appendMinutes.innerHTML = "0" + minutes
        }

    }

    //P2: Clock 

    function displayTime() {
        let date = new Date()
        let h = date.getHours()
        let m = date.getMinutes()
        let s = date.getSeconds()

        h = (h < 10) ? "0" + h : h
        m = (m < 10) ? "0" + m : m
        s = (s < 10) ? "0" + s : s

        let time = h + ":" + m + ":" + s

        document.getElementById("digitalClockDisplay").textContent = time


        setTimeout(displayTime, 1000) //displays the time and updates it every second 
    }

    function displayDate() {
        let currentDate = new Date()
        let d = currentDate.getDate()
        let m = currentDate.getMonth() + 1;
        let y = currentDate.getFullYear()

        d = (d < 10) ? "0" + d : d
        m = (m < 10) ? "0" + m : m

        let date = d + "/" + m + "/" + y

        document.getElementById("currentDateDisplay").textContent = date
    }

    window.onload = function () {
        displayTime()
        displayDate()
    }

    //P3 Fish Tank

    const canvas = document.getElementById("p3-fishtank-canvas")
    const ctx = canvas.getContext("2d")

    class Body {
        constructor(radiusX, radiusY, rotation, startAngle, endAngle) {
            this.radiusX = radiusX
            this.radiusY = radiusY
            this.rotation = rotation
            this.startAngle = startAngle
            this.endAngle = endAngle
            this.eyeBallSize = Math.floor(Math.random() * (7 - 5 + 1) + 5)
            this.pupilSize = Math.floor(Math.random() * (3 - 1 + 1) + 1)
            this.maxPupilOffset = this.eyeBallSize - this.pupilSize
            this.pupilOffsetX = Math.random() * this.maxPupilOffset * 2 - this.maxPupilOffset
            this.pupilOffsetY = Math.random() * this.maxPupilOffset * 2 - this.maxPupilOffset
        }

        drawBody(colour, x, y,) {

            ctx.beginPath()
            ctx.fillStyle = colour
            ctx.ellipse(x, y, this.radiusX, this.radiusY, this.rotation, this.startAngle, this.endAngle)
            ctx.closePath()
            ctx.fill()

            let eyeBallPosX = x - 7
            let eyeBallPosY = y
            let pupilPosX = eyeBallPosX + this.pupilOffsetX
            let pupilPosY = eyeBallPosY + this.pupilOffsetY

            ctx.beginPath()
            ctx.fillStyle = "white"
            ctx.ellipse(eyeBallPosX, eyeBallPosY, this.eyeBallSize, this.eyeBallSize, this.rotation, this.startAngle, this.endAngle)
            ctx.closePath()
            ctx.fill()

            ctx.beginPath()
            ctx.fillStyle = "black"
            ctx.ellipse(pupilPosX, pupilPosY, this.pupilSize, this.pupilSize, this.rotation, this.startAngle, this.endAngle)
            ctx.closePath()
            ctx.fill()


        }
    }

    class Fin {
        constructor(finWidth, finOffsetX, finOffsetY) {
            this.finWidth = finWidth
            this.finOffsetX = finOffsetX
            this.finOffsetY = finOffsetY
        }

        drawFin(colour, fishX, fishY, fishBodyRadiusX) {
            let p1X = fishX + fishBodyRadiusX
            let p1Y = fishY
            let p2X = p1X + this.finOffsetX
            let p2Y = p1Y - (this.finWidth / 2) - this.finOffsetY
            let p3X = p2X
            let p3Y = p2Y + this.finWidth
            ctx.beginPath()
            ctx.fillStyle = colour
            ctx.moveTo(p1X, p1Y)
            ctx.lineTo(p2X, p2Y)
            ctx.lineTo(p3X, p3Y)
            ctx.closePath()
            ctx.fill()
        }

    }

    // function getRandomSpeed(min, max) {
    //     return Math.floor(Math.random() * (max - min + 1)) + min
    // }

    class Fish {
        constructor(colour, speed, direction, startX, startY, finWidth) {
            this.colour = colour
            this.speed = speed
            this.direction = direction
            this.x = startX
            this.y = startY
            this.body = new Body(Math.floor(Math.random() * (30 - 10 + 1)) + 10, Math.floor(Math.random() * (20 - 10 + 1)) + 10, 0, 0, 2 * Math.PI)
            this.fin = new Fin(finWidth, Math.floor(Math.random() * (30 - 10 + 1)) + 10, Math.floor(Math.random() * 11) - 5)
        }

        drawFish() {
            ctx.fillStyle = this.colour
            this.body.drawBody(this.colour, this.x, this.y)
            this.fin.drawFin(this.colour, this.x, this.y, this.body.radiusX - 5)

        }

    }

    let fishList = []


    fishList.push(new Fish("rgb(180, 150, 270)", 1, 0, 50, 50, 20))
    fishList.push(new Fish("hotpink", 1, 0, 70, 70, 10))

    function fishLoop() {



        ctx.clearRect(0, 0, canvas.width, canvas.height) //clear canvas to make fish appear to move rather than dragging effect

        for (let index = 0; index < fishList.length; index++) {
            const fish = fishList[index]
            fish.x = fish.x - 1;
            fish.drawFish();

        }





        raf = window.requestAnimationFrame(fishLoop)





    }

    fishLoop()

    // var fishList = []

    // for (let i = 0; i < 10; i++) {
    //     let fish = new Fish(getRandomColor(), Math.random() * 100, Math.random() * 100, Math.random() * 290, Math.random() * 290, (Math.random() + 5) * 5)
    //     fishList.push(fish)
    // }

    // function fishLoop() {

    //     ctx.clearRect(0, 0, canvas.width, canvas.height) //clear canvas to make fish appear to move rather than dragging effect

    //     let fishDirection = -1

    //     for (let index = 0; index < fishList.length; index++) {
    //         const fish = fishList[index];

    //         fish.x += fishDirection

    //         if (fish.x += fishDirection = canvas.width - 270) {
    //             fish.x -= fishDirection
    //         }


    //         fish.drawFish()

    //     }

    //     raf = window.requestAnimationFrame(fishLoop)
    // }

    // fishLoop()

});

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

