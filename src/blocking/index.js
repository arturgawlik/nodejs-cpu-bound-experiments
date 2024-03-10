import { retriveParam } from "../helpers.js";

export default function (req, res) {
  const param = retriveParam(req);
  const result = calcFibonaciSequence(param);

  res.end(String(result));
}

/**
 * @param {number} count
 * @returns {number}
 */
function calcFibonaciSequence(count) {
  let oneBack = 1n;
  let twoBack = 0n;
  let counter = 2;
  let tmp = null;
  while (counter < count) {
    counter++;
    tmp = oneBack;
    oneBack += twoBack;
    twoBack = oneBack;
  }

  return oneBack;
}
