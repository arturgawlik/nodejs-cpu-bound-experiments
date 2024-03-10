import { retriveParam } from "../helpers.js";

export default function (req, res) {
  const param = retriveParam(req);
  calcFibonaciSequence(param, (result) => {
    res.end(String(result));
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
      setImmediate(calcNextNumber);
    }
  })(1n, 0n);
}
