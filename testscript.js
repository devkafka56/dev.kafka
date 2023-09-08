const a = "something";
let b = 1;
b = b + 1;
var c = 4

// take two numbers and return their sum
function addTwoNumbers(n1, n2) {
  return n1 + n2;
}

const addThreeNumbers = function(a, b, c) {
  return a + b + c;
}

const subtractTwoNumbers = (a, b) => {
  return a + b + c;
}

addTwoNumbers(1 , 2); // 3
console.log(addTwoNumbers(1 , 2)) // prints 3 to the terminal
const hopethisisfour = addTwoNumbers(2 , 2); // assigns the value '4' to a constant

// exploring conditionals
function myfun(n) {
  if (n > 10 || n < -5) {
    console.log("yay")
  } else {
    console.log("boo")
  }
}

myfun(11) // yay
myfun(5) // boo
myfun(10) // boo

// a function called isCat
// returns "yay" if the value passed in is the string "cat"
// else, return "boo"

function isCat (x) {
  if (x === "cat") {
    console.log("yay")
  } else if (x === "dog") {
    console.log("yayish :/");
  } else {
    console.log("boo :(") 
  }
}

isCat("cat") // "yay"
isCat("dog") // "yayish"
isCat("chicken") // "boo"