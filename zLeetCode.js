//Find Different Binary String 
var findDifferentBinaryString = function (nums) {
    let result = '0'.repeat(nums.length)
    let resultNotInNums = (r) => nums.every((e) => {
        return r !== e
      })
    let baseTest = resultNotInNums(result)
      if (!baseTest) {  
       for (let i = 0; i < nums.length; i++) {
            result = result.substring(0, i) + '1' + result.substring(i + 1)
           for (let k = 0; k < nums.length; k++) {
             if (k !== i) {
               result = result.substring(0, k) + '0' + result.substring(k + 1)
                let finalTest = resultNotInNums(result)
                  if (finalTest) {return result}
             }
           }
        } 
    }
   return result
  };

//Check password to determine strength and steps to improve strength and meet requirements 

const strongPasswordChecker = (passwd) => {
  let steps = 0;
  let mustAdd = 0;

  if (!passwd.match(/[A-Z]/)) {
      mustAdd++;
  }
  if (!passwd.match(/[a-z]/)) {
      mustAdd++;
  }
  if (!passwd.match(/\d/)) {
      mustAdd++;
  }

  let groups = passwd.match(/(.)\1*/g).filter(x => x.length > 2);

  if (passwd.length <= 20) {
      groups.forEach(group => {
          steps += Math.trunc(group.length / 3);
          mustAdd -= Math.trunc(group.length / 3);
      })
  }

  if (passwd.length <= 20) {
      mustAdd = mustAdd > 0 ? mustAdd : 0;
      if (passwd.length + steps >= 6) {
          steps += mustAdd;
      } else {
          if (mustAdd > 6 - (passwd.length + steps)) {
              steps += mustAdd;
          } else {
              steps += 6 - (passwd.length + steps);
          }
      }
  }

  if (passwd.length > 20) {
      let mustRemove = passwd.length - 20;
      let lengths = [];
      let plus = [];
      let chL = 0;
      for (let i = 1; i <= 3; i++) {
          for (let k = 0; k < groups.length; k++) {
              if (plus[k] === undefined) { plus[k] = 0; }
              chL = groups[k].length - plus[k];
              if (lengths[k] === undefined) { lengths[k] = chL; }
              const rec = () => {
                  if (Math.trunc((chL - i) / 3) < Math.trunc(chL / 3) && passwd.length - steps - i >= 6 && mustRemove >= i && chL > 2 && lengths[k] - i > 0) {
                      steps += i;
                      plus[k] += i;
                      mustRemove -= i;
                      chL -= i;
                      lengths[k] -= i;
                      rec();
                  }
              }
              rec();
          }
      }
      lengths.forEach(length => {
          if (length > 2) {
              steps += Math.trunc(length / 3);
              mustAdd -= Math.trunc(length / 3);
          }
      }
      )

      mustRemove = mustRemove > 0 ? mustRemove : 0;
      mustAdd = mustAdd > 0 ? mustAdd : 0;
      steps += mustAdd + mustRemove;
  }

  return steps;
};

// 

var maxCoins = function(piles) {
    let myCoins = 0
    piles.sort((a, b) => b - a)
    let numberOfPiles = piles.length / 3
    for (let i = 0; i < piles.length - numberOfPiles; i++) {
      myCoins += piles[i+1]
      i++
    }
    return myCoins
  };
