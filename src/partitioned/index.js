import { retriveParam } from "../helpers.js";

export default async function (req, res) {
  const param = retriveParam(req);
  const result = calcFibonaciSequence(param);
  res.end(String(result));
}

/**
 * @param {number} count
 * @param {(res: number) => void} cb
 */
async function calcFibonaciSequence(count) {
  return new Promise((resolve) => {
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
        resolve(oneBack);
      } else {
        // optimize partioning by using setImmediate for only 1 per 1000 calculations
        if (counter % 1000 === 0) {
          setImmediate(calcNextNumber);
        } else {
          calcNextNumber();
        }
      }
    })(1n, 0n);
  });
}
