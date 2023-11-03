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
//option 2 - Fizz, Buzz, & FizzBuzz 

for (let i = 0; i < 100; i++) {
    if ((i % 3 == 0) && (i % 5 == 0)) {
        console.log(`FizzBuzz ${i}`)
    }
    if (i % 3 == 0) {
        console.log(`Fizz: ${i}`)
    } else if (i % 5 == 0) {
        console.log(`Buzz ${i}`)
    } else { console.log(i) }
}

//option 3 - Fizz, Buzz, & FizzBuzz 

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

//option 3

let fill1 = ""

for (let x = 0; x < 8; x++) {
    if (x % 2 == 0) { fill1 += " " }
    for (let y = 0; y < 8; y++) {
        if (y % 2 == 0) { fill1 += "# " }
    }
    fill1 += "\n"
}

console.log(fill1)

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
    }
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

//option 3 - redone about 2 weeks and 3 chapters after the above

function isEven(a) {
    if (a % 2 == 0) { return true }

    if (a % 2 == 1) { return false }

    if (a < 0 && (!a == 0)) {
        a = a * a
        return isEven(a)
    }
}

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
            counter++ // first conditional that tests whether there are lower case b's, increase counter at each instance 
        } else if (string[i] == "B") { // second conditional that tests for upper case B's, increase counter at each instance
            counter++
        }
    }
    return counter //return counter of upper case and lower case bs 
}
console.log(countBs("Blathers Blabbers brazenly"));
//-> 5 

//option 2.2 - done about three weeks and a few chapters later

function countBs(string) {
    let beanCounter = 0
    for (let i = 0; i < string.length; i++) {
        if (string[i] == "B") {
            beanCounter++
        }
    }
    return beanCounter
}

//option 3 - to count user inputted character 

function countChar(string, char) {
    string = String(string)
    char = String(char)
    let counter = 0
    for (let i = 0; i < string.length; i++) {
        if (string[i] == char) {
            counter++
        }
    }
    return counter
}

console.log(countChar("Alaphet has a's", "a"))
//-> 3

//option 3.3 - done about three weeks and a few chapters later 

function countChar(string, char) {
    let charCounter = 0
    for (let i = 0; i < string.length; i++) {
        if (string[i] == char) {
            charCounter++
        }
    }
    return charCounter
}

/*Chapter 4 - EXERCISES*/

//4.1 Sum of Range 

//Option 1 - simple range

let numbers1 = []
for (i = 1; i <= 11; i++) {
    numbers1.push(i)
}

function range(start, end) {
    return numbers1.slice(start - 1, end)
}

//Option 2 - simple range with optional step (does not work for negative numbers)

let numbers2 = []
for (i = 1; i <= 11; i++) {
    numbers2.push(i)
}

function range(start, end, step = 1) {
    let listOfNumbers = []
    for (number = start; number <= end; number += step) {
        listOfNumbers.push(number)
    }
    return listOfNumbers
}

//Option 3 - range with step for both positive and negative 

function range(start, end, step = 1) {
    let listOfNumbers = []
    if (start < end) {
        for (number = start; number <= end; number += step) {
            listOfNumbers.push(number)
        }
    }
    if (start > end) {
        for (number = start; number >= end; number += step) {
            listOfNumbers.push(number)
        }
    }
    return listOfNumbers
}

//Option 4 - Sum of Range 

function range(start, end, step = 1) {
    let listOfNumbers = []
    if (start < end) {
        for (number = start; number <= end; number += step) {
            listOfNumbers.push(number)
        }
    }
    if (start > end) {
        for (number = start; number >= end; number += step) {
            listOfNumbers.push(number)
        }
    }
    return listOfNumbers
}

function sum(array) {

    let total = 0
    for (i = 0; i <= array.length; i++) {
        total += i

    }
    return total
}

//4.1 - sum and range - three weeks and a few chapters later: 

function range(num1, num2) {
    let rangeArray = []

    if (num1 < num2) {
        for (let i = num1; i <= num2; i++) {
            rangeArray.push(i)
        }
    }

    if (num2 < num1) {
        for (let i = num1; i >= num2; i--) {
            rangeArray.push(i)
        }
    }
    return rangeArray
}

function sum(arrayOfNumbers) {
    let sum = 0
    let counter = 0
    for (let i = 0; i < arrayOfNumbers.length; i++) {
        sum += arrayOfNumbers[i]
    }
    return sum
}

//4.2 Reversing an Array 

//Option 1 - takes an array and produces a new array with the elements reversed 

//Option 1.1 - Makes copy of the array

function reverseArray(array) {
    let reverseArray = []
    for (i = 0; i < array.length; i++) {
        reverseArray.push(array[i])
    }
    return reverseArray
}

//Option 1.2 - Makes copy of array and reverses it

function reverseArray(array) {
    let reverseArray = []
    for (i = 0; i < array.length; i++) {
        reverseArray.push(array[i])
    }
    let trueReverseArray = []
    for (i = reverseArray.length - 1; i >= 0; i--) {
        trueReverseArray.push(reverseArray[i])
    }
    return trueReverseArray
}

//Option 1.3 - Reverses the array

function reverseArray(array) {
    let trueReverseArray = []
    for (i = array.length - 1; i >= 0; i--) {
        trueReverseArray.push(array[i])
    }
    return trueReverseArray
}

//Option 1.4 - Reverses using unshift method

function reverseArray(array) {
    let trueReverseArray = []
    for (let i = 0; i < array.length; i++) {
        trueReverseArray.unshift(array[i])
    }
    return trueReverseArray
}

//Option 2 - Takes array and reverses it in place 

function reverseArrayInPlace(arrayValue) {
    for (i = 0; i < Math.floor(arrayValue.length / 2); i++) {
        let placeHolder = arrayValue[i]
        arrayValue[i] = arrayValue[arrayValue.length - 1 - i]
        arrayValue[arrayValue.length - 1 - i] = placeHolder
    }
    return arrayValue
}

//4.2 - completed 2-3 weeks later (pretty much the same as earlier, but finished faster)

function reverseArray(array) {
    let reversedArray = []
    for (let i = 0; i < array.length; i++) {
        reversedArray.unshift(array[i])
    }
    return reversedArray
}

function reverseArrayInPlace(array) {
    let counter = -1
    for (let i = 0; i < Math.floor(array.length / 2); i++) {
        let placeHolder = array[i]
        array[i] = array.length - i
        array[array.length - 1 - i] = placeHolder
    }
}

//First, the loops looks at the first half of the array. The placeHolder stores the value that will be switched while the new value at arrayValue.length - 1 - i replaces it, and then the value stored in placeHolder is in the place that the value at arrayValue.length - 1 - i was. 

//4.3 A List 

//Option 1 - An array to a list 

function arrayToList(array) {
    let list = null
    for (i = array.length - 1; i >= 0; i--) {
        list = { value: array[i], rest: list }
    }
    return list
}

//Option 2 - A list to an array 

function listToArray(list) {
    let array = []
    for (i = list; i; i = i.rest) { //checks each sublist until reaches null
        array.push(i.value)
    }
    return array
}

//Option 3 - New list from list with new element added to front 

function prepend(ele, list) {
    let newList = {}
    for (i = newList; i; i = i.rest) {
        newList = { value: ele, rest: list }
    }
    return newList
}

//Option 4 - Position of element in list that corresponds to number given 

function nth(list, pos) {
    let counter = 0
    for (node = list; node; node = node.rest) {
        if (counter == pos) {
            return node.value
        }
        counter++
    }
}
//Option 4.1 - While version 
function nthWhile(list, post) {
    let counter = 0
    let node = list
    while (node) {
        if (counter == post) {
            return node.value
        }
        node = node.rest
        counter++
    }
}

//Option 4.2 - Recursive version 

function nth(list, pos) {
    if (pos == 0) {
        return list.value
    } else if (pos !== 0) {
        return nth(list.rest, pos - 1)
    }
}

console.log(arrayToList([10, 20, 30, 40, 50, 60]));
console.log(nth(arrayToList([10, 20, 30, 40, 50, 60]), 3));
// → 40

//4.2 - done 2-3 weeks later: 

function arrayToList(array) {
    let list = null
    for (let i = 0; i < array.length; i++) {
        list = { value: array[i], rest: list }
    }
    return list
}

function listToArray(list) {
    let array = []
    for (let node = list; node; node = node.rest) {
        array.push(node.value)
    }
    return array
}

function prepend(value, list) {

    let newList = {}

    for (let node = newList; node; node = node.rest) {
        newList = { value: value, rest: list }
    }
    return newList
}

function nth(list, num) {
    let array = listToArray(list)
    for (let i = 0; i < array.length; i++) {
        if (i == num) {
            return array[i]
        }
    }
}

//4.4 Deep Comparison 

function deepEqual(arg) {
    if (arg = typeOf(object)) {
        return false
    }
}

//Tests 

//Test whether arg is object
function deepEqual(arg) {
    let text = "Is this value of the object type? "
    if (typeof arg === "object") {
        return text + true
    } else {
        false
        return "Object type? " + false
    }
}

let obj = { here: { is: "an" }, object: 2 };
let array = [1, 2, 3]
let test = "hello"
let num = 12413
console.log(deepEqual(num))

//This is just to test whether arg is an object. 

//Tests whether keys contained in objects are equal. 
function deepEqual(arg1, arg2) {
    let arg1Keys = Object.keys(arg1).toString() // or JSON.stringify(Object.keys(arg1))
    let arg2Keys = Object.keys(arg2).toString() // or JSON.stringify(Object.keys(arg2))

    let keys1 = Object.keys(arg1)
    let keys2 = Object.keys(arg2)

    if (keys1 === keys2) {
        return true
    }
    if (keys1 !== keys2) {
        return false
    }
}

let obj11 = { here: { is: "an" }, object: 2 };
let obj22 = { key: "value", key2: { object2: "value2" }, key3: ["array", "ray"] }
let obj33 = { here: { is: "an" }, object: 2 };
console.log(deepEqual(obj1, obj3));

// the keys1 and keys2 returns false because the arrays stored in memory are different. The arg1Keys/2Keys returns true because the content of the strings is the same. One evluates the memory reference and one the content.

//4.4 Deep Comparison 
//Final stage. Tests for all possible false cases before returning true. Uses recursion to repeat tests for each value. 

function deepEqual(arg1, arg2) {

    if (typeof arg1 !== typeof arg2) {
        return false
    }


    if ((typeof arg1 === "object" && arg1 !== null) &&
        (typeof arg2 === "object" && arg2 !== null)) {

        let arg1Keys = Object.keys(arg1)
        let arg2Keys = Object.keys(arg2)

        if (arg1Keys.length !== arg2Keys.length) {
            return false
        }

        for (let i = 0; i < arg1Keys.length; i++) {
            if (arg1Keys[i] !== arg2Keys[i]) {
                return false
            }
            if (!deepEqual(arg1[arg1Keys[i]], arg2[arg2Keys[i]])) {
                return false
            }
        }
    } else if (arg1 !== arg2) {
        return false
    }

    return true
}

//Deep Equal - done two/three weeks later for review: 

function deepEqual(a, b) {
    let aKeys = Object.keys(a)
    let bKeys = Object.keys(b)

    if (typeof a != typeof b) {
        return false
    }

    if (aKeys.length != bKeys.length) {
        return false
    }

    if (aKeys.length == bKeys.length) {
        for (let i = 0; i < aKeys.length; i++) {
            if (aKeys[i] != bKeys[i]) {
                return false
            }
            if (aKeys[i] == bKeys[i]) {

                if (typeof a[aKeys[i]] != typeof b[bKeys[i]]) {
                    return false
                }
                if (typeof a[aKeys[i]] == "object" && typeof b[bKeys[i]] == "object") {
                    a = a[aKeys[i]]
                    b = b[bKeys[i]]
                    return deepEqual(a, b)
                }
                return true
            }

        }
    }
}

//5.5 Exercises 

//5.1 Flatten group of arrays using concat and reduce: 

let arrays = [[1, 2, 3], [4, 5], [6]];

function reduce(array, combine, start) {
    let current = start;
    for (let element of array) {
        current = current.concat(element);
    }
    return current;
}

console.log(reduce(arrays, (a, b) => [a + b], []))
// → [1, 2, 3, 4, 5, 6]

//5.1 Flatten - review session: 

console.log(arrays.reduce((a, b) => {return a.concat(b)}))

//5.2 Higher order loop

function loop(value, test, update, body) {
    for (let i = value; test(i); i = update(i)) {
        body(i)
    }
}

//5.3 Every function -> one that uses loop and one that uses the some method 

//5.3.1 Every using loop

function every(array, test) {
    for (let i = 0; i < array.length; i++) {
        if (!test(array[i])) { return false }
    }
    return true
}

//5.3.2 Every using some 

function every(array, test) {
    let notTest = (n) => { return !test(n) }
    if (array.some(notTest)) { return false } // notTest = n => !test(n)
    return true
}

//5.4 Find dominate text direction 

function dominantDirection(text) {
    let scripts = countBy(text, char => {
        let script = characterScript(char.codePointAt(0));
        return script ? script.name : "none";
    }).filter(({ name }) => name != "none");

    let domText = scripts.reduce((current, element) => {
        return current > element ? current : element
    })

    for (let script of SCRIPTS) {
        if (script.name == domText.name) {
            return script.direction
        }
    }
}

console.log(dominantDirection("Hello!"));
// → ltr
console.log(dominantDirection("Hey, مساء الخير"));

//5.4 - weeks later: 

function dominantDirection(text) {
    let scripts = countBy(text, char => {
    let script = characterScript(char.codePointAt(0))
    return script ? script.direction : "none"
     }).filter(({name}) => name != "none")
     
   let domDirection = scripts.reduce((a, b) => {return a > b ? a : b})
   
   return domDirection.name
   }

// → rtl

/*Chapter 6 - EXERCISES*/

//6.1 A Vector Type (create Vector class)

class Vec {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    get length() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y))
    }

    plus(vec) {
        let newX = this.x + vec.x
        let newY = this.y + vec.y
        return new Vec(newX, newY)
    }

    minus(vec) {
        let newX = this.x - vec.x
        let newY = this.y - vec.y
        return new Vec(newX, newY)
    }
}

//6.2 Group class (similar to Set class) with has, add, delete 

class Group {
    constructor() {
        this.array = []
    }

    static from(values) {
        let newGroup = new Group()
        for (let element of values) {
            newGroup.add(element)
        }
        return newGroup
    }

    has(value) {
        for (let element of this.array) {
            if (value === element) {
                return true
            }
        }
        return false
    }

    add(value) {
        if (!this.has(value)) {
            this.array.push(value)
        }
    }

    delete(value) {
        this.array = this.array.filter((element) => element !== value)
    }
}

//6.3 Make Class Iterable 

//6.3.1 Add Symbol.iterator (Not suggested, but I wanted to try it just to have done it)

class Group {
    constructor() {
        this.array = []
    }

    static from(values) {
        let newGroup = new Group()
        for (let element of values) {
            newGroup.add(element)
        }
        return newGroup
    }

    has(value) {
        for (let element of this.array) {
            if (value === element) {
                return true
            }
        }
        return false
    }

    add(value) {
        if (!this.has(value)) {
            this.array.push(value)
        }
    }

    delete(value) {
        this.array = this.array.filter((element) => element !== value)
    }

    [Symbol.iterator]() {
        return this.array[Symbol.iterator]();
    }

}

//6.3.2 Class Iteration via Iteration Class 

class GroupIterator {
    constructor(arrayFromGroup) {
        this.arrayFromGroup = arrayFromGroup
        this.currentPosition = 0
    }

    next() {
        if (this.currentPosition == this.arrayFromGroup.length) return { done: true }
        let value = this.arrayFromGroup[this.currentPosition]
        this.currentPosition++
        return { value, done: false }
    }
}

//6.2 & 3: Group Class, Class Iteration, weeks later during review: 

class Group {
    constructor() {
    this.group = [] 
    }
    
    static from(array) {
     let newGroup = new Group()
     for (let element of array) {
      newGroup.add(element)
     } 
     return newGroup
    }
    
    has(value) {
     for (let element of this.group) {
      if (element == value) {
       return true
      }
     }
      return false 
    }
    
    add(value) {
     if (!this.has(value)) {
      this.group.push(value)
     }
    }
    
    delete(value) {
      this.group = this.group.filter((e) => e !== value)
    }
    
   [Symbol.iterator]() {
          return this.group[Symbol.iterator]();
      } 
    
  }
  
  class GroupIterator {
   constructor(group) {
     this.group = group 
   }
    
    next() {
      let counter = 0
      if (counter >= this.group.length) return {done: true}
      if (counter < this.group.length) return {hello: this.group[counter], done: false}
      counter++
    }
  }

// --- 

class Group {
    constructor() {
        this.array = []
    }

    static from(values) {
        let newGroup = new Group()
        for (let element of values) {
            newGroup.add(element)
        }
        return newGroup
    }

    has(value) {
        for (let element of this.array) {
            if (value === element) {
                return true
            }
        }
        return false
    }

    add(value) {
        if (!this.has(value)) {
            this.array.push(value)
        }
    }

    delete(value) {
        this.array = this.array.filter((element) => element !== value)
    }

    [Symbol.iterator]() {
        return new GroupIterator(this.array)
    }
}

//6.4 Borrowing A Method - hasOwnProperty is a property, use hasOwnProperty method
console.log(Object.prototype.hasOwnProperty.call(map, "one"))

/* Chapter 7 - PROJECT: A Robot */

//7.1 Measuring A Robot (Compare Robots)

function runRobot(state, robot, memory) {
    let steps = 0
    for (let turn = 0; ; turn++) {
        if (state.parcels.length == 0) {
            break;
        }
        let action = robot(state, memory);
        state = state.move(action.direction);
        memory = action.memory;
        steps++
    }
    return steps
}

function compareRobots(robot1, memory1, robot2, memory2) {
    let tasks = 100
    let robot1StepsPerTasks = []
    let robot2StepsPerTasks = []
    for (let counter = 0; counter <= tasks; counter++) {
        let sameState = VillageState.random()
        let steps1 = runRobot(sameState, robot1, memory1)
        let steps2 = runRobot(sameState, robot2, memory2)
        robot1StepsPerTasks.push(steps1)
        robot2StepsPerTasks.push(steps2)
    }

    let robot1TotalSteps = robot1StepsPerTasks.reduce((a, b) => a + b)
    let robot2TotalSteps = robot2StepsPerTasks.reduce((a, b) => a + b)

    let averageRobot1StepsPerTask = Math.floor(robot1TotalSteps / tasks)
    let averageRobot2StepsPerTask = Math.floor(robot2TotalSteps / tasks)

    if (averageRobot1StepsPerTask < averageRobot2StepsPerTask) {
        console.log(`${robot1.name} completed tasks in fewer steps on average than ${robot2.name}.\nAverage steps per task for ${robot1.name}: ${averageRobot1StepsPerTask}.\nAverage steps per task for ${robot2.name}: ${averageRobot2StepsPerTask}.`)
    }
    if (averageRobot1StepsPerTask > averageRobot2StepsPerTask) {
        console.log(`${robot2.name} completed tasks in fewer steps on average than ${robot1.name}.\nAverage steps per task for ${robot2.name}: ${averageRobot2StepsPerTask}.\nAverage steps per task for ${robot1.name}: ${averageRobot1StepsPerTask}.`)
    }
    if (averageRobot1StepsPerTask == averageRobot2StepsPerTask) {
        console.log(`${robot1.name} and ${robot2.name} completed each task on average in an equal number of steps.`)
    }
}

compareRobots(routeRobot, [], goalOrientedRobot, []);

//7.2 Robot Efficiency 

function bestRobot({ place, parcels }, route) {
    if (route.length == 0) {
        // Describe a route for every parcel
        let routes = parcels.map(parcel => {
            if (parcel.place != place) {
                return {
                    route: findRoute(roadGraph, place, parcel.place),
                    pickUp: true
                };
            } else {
                return {
                    route: findRoute(roadGraph, place, parcel.address),
                    pickUp: false
                };
            }
        })

        function score({ route, pickUp }) {
            return (pickUp ? 0.5 : 0) - route.length;
        }
        route = routes.reduce((a, b) => score(a) > score(b) ? a : b).route;
    }

    return { direction: route[0], memory: route.slice(1) };
}


// Eric's Robot 

function himbotron({ place, parcels }, route) {
    let currentPlace = place
    //console.log(`place:${JSON.stringify(currentPlace)}\tparcels ${JSON.stringify(parcels)}\tmemory ${JSON.stringify(route)}\n`)
    parcels.sort((a, b) => {
        //console.log(a.place)
        return findRoute(roadGraph, currentPlace, a.place).length > findRoute(roadGraph, currentPlace, b.place).length
    })
    if (route.length == 0) {
        let parcel = parcels[0];
        if (parcel.place != currentPlace) {
            route = findRoute(roadGraph, currentPlace, parcel.place);
        } else {
            route = findRoute(roadGraph, currentPlace, parcel.address);
        }
        // I love Kayler <3
        //console.log(`Route: ${route}`)
    }
    return { direction: route[0], memory: route.slice(1) };

}

//7.2 Persistent Group 

class PGroup {
    constructor() {
        this.array = []
    }

    static empty = new PGroup()

    has(value) {
        for (let element of this.array) {
            if (element === value) {
                return true
            }
        }
        return false
    }

    add(value) {
        let test = new PGroup
        test.array.push(value)
        this.array = this.array.concat(test.array)
        return test
    }

    delete(value) {
        this.array = this.array.filter((element) => element !== value)
        return this.array
    }
}