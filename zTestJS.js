//Eloquen JavaScript 

/*Chapter 2 - EXERCISES:*/

//2.1 Looping a Triangle:

//option 1
let tri = "" //let tri = "#" does not work because the console.log command is inside the loop and so the modification to tri is executed before it is printed, so the first line "#" with only one "#" is not printed.
for (let counter = 0; counter <= 6; counter += 1) {
    tri = tri + "#";
    console.log(tri);
}

//option 2
console.log("#");

let triTwo = "#"
for (let counter = 0; counter <= 5; counter += 1) {
    triTwo = triTwo + "#";
    console.log(triTwo);
}

//2.2 FizzBuzz 

//option 1 (Fizz and Buzz)
for (let number = 0; number <= 100; number += 1) {
    if (number % 3 == 0) {
        console.log("Fizz")
    } else if
        (number % 5 == 0) {
        console.log("Buzz")
    } else { console.log(number) }
    //console.log(number);
}

//option 2 - Fizz, Buzz, FizzBuzz (does not work)
for (let number = 0; number <= 100; number += 1) {
    if (number % 3 == 0) {
        console.log("Fizz")
    } else if
        (number % 5 == 0 && number % 3 !== 0) {
        console.log("Buzz")
    } else if
        (number % 5 == 0 || number % 3 == 0) {
        console.log("FizzBuzz")
    } else { console.log(number) }
    //console.log(number);
}

//option 3 - Fizz, Buzz, & FizzBuzz (working)

for (let number = 1; number <= 100; number += 1) {
    if (number % 5 == 0 && number % 3 == 0) {
        console.log("FizzBuzz") //needs to go first so that it does not get overwritten by the other clauses 
    } else if
        (number % 5 == 0 && number % 3 !== 0) {
        console.log("Buzz")
    } else if
        (number % 3 == 0) {
        console.log("Fizz")
    } else { console.log(number) }
}

//2.3 Chessboard 

//option 1 - Prints 8x8 Chessboard 

let lineOne = "# # # #\n"
let lineTwo = "# # # #\n"

for (counter = 0; counter <= 3; counter += 1) {
    console.log(lineOne, lineTwo);
}

//option 2 - Modify Dimensions 


let fill = ""
let line = 8
let column = 8

for (let x = 0; x < line; x += 1) {
    if (x % 2 == 0) {
        fill += " ";
    }
    for (let y = 0; y < column / 2; y += 1) {
        fill += "# ";
    }
    fill += "\n"
}

console.log(fill);

//Chapter 3 - Functions 

//Recursion for powers: 

function power(base, exponent) {
    if (exponent == 0) {
        return 1;
    } else {
        return base * power(base, exponent - 1);
    }
}

console.log(power(2, 3));
// → 8

//Loop for powers: 

function power(base, exponent) {
    let result = 1;
    for (let i = 0; i < exponent; i++) {
        result *= base;
    }
    return result;
}

console.log(power(2, 3)); // Outputs 8

//zeroPad function: 

function zeroPad(number, width) {
    let string = String(number);
    while (string.length < width) {
        string = "0" + string;
    }
    return string;
}

/*Chapter 3 - EXERCISES*/

//3.1 Minimum 

function getMin(a, b) {
    console.log(Math.min(a, b))
}

getMin(0, 10)
getMin(0, -10)

//3.2 Recursion 

//option 1 - only handles numbers 0 and 1

function isEven(number) {
    if (number == 0) {
        return true
    } else if (number == 1) {
        return false
    } else { number -= 2 }
}

console.log(isEven(15))

//option 2 - includes numbers other than 0 and 1

function isEven(number) {
    if (number == 0) {
        return true
    } else if (number == 1) {
        return false
    } else if (number > 2) {
        number = number - 2
        return isEven(number)
    } else {
        return true
    }

}

console.log(isEven(0))
console.log(isEven(1))
console.log(isEven(19))

//3.3 Bean Counting 

//test to experiment with string.length and string[N]

function countBs(string) {
    string = String(string)
    return string + "\n" + // returns string, and creates a new ling
        string.length + //returns the length of the string 
        string[2] //returns the  character in the [Nth] position 
}

console.log(countBs("Blathers Blabbers brazenly"));
//-> Blathers Blabbers brazenly 
//   26a

//option 2 - only counts B and b

function countBs(string) {
    string = String(string)
    let counter = 0 // counter to keep track of number of B and b
    for (let i = 0; i < string.length; i++) { //loop to run until the end of the string 
        if (string[i] == "b") {
            counter ++ // first conditional that tests whether there are lower case b's, increase counter at each instance 
        } else if (string[i] == "B") { // second conditional that tests for upper case B's, increase counter at each instance
          counter ++
        }
    }
    return counter //return counter of upper case and lower case bs 
}
console.log(countBs("Blathers Blabbers brazenly"));
//-> 5 

//option 3 - to count user inputted character 

function countChar(string, char) {
    string = String(string)
    char = String(char)
    let counter = 0
    for (let i = 0; i < string.length; i++) {
        if (string[i] == char) {
            counter ++
        } 
    }
    return counter
}

console.log(countChar("Alaphet has a's", "a"))
//-> 3