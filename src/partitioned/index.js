import { retriveParam } from "../helpers.js";

export default function (req, res) {
  const rand = Math.random();
  console.time(rand);
  const param = retriveParam(req);
  calcFibonaciSequence(param, (result) => {
    res.end(String(result));
    console.timeEnd(rand);
  });
}

/**
 * @param {number} count
 * @param {(res: number) => void} cb
 */
function calcFibonaciSequence(count, cb) {
  let oneBack = 1n;
  let twoBack = 0n;
  let counter = 2;
  let tmp = null;
  (function calcNextNumber() {
    counter++;
    tmp = oneBack;
    oneBack += twoBack;
    twoBack = oneBack;
    if (counter >= count) {
      cb(oneBack);
    } else {
      // optimize partioning by using setImmediate for only 1 per 1000 calculations
      if (counter % 1000) {
        setImmediate(calcNextNumber);
      } else {
        calcNextNumber();
      }
    }
  })(1n, 0n);
}
