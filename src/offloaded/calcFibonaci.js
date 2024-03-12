process.on("message", ({ param }) => {
  const result = calcFibonaciSequence(param);
  process.send({ resultStr: String(result) });
});

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
