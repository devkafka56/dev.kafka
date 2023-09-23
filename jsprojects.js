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

    //Notes 
    //Parameters represent values passed as arguments***
    //Ternary condition: [condition] ? [value_if_true] : [value_if_false]
    //innerText: pulls from element and includes styles v. textContent: only pulls text without considering styles 

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
        
            window.onload = function() {
            displayTime()
            }

});

