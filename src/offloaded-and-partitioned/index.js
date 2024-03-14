import { fork } from "node:child_process";
import { availableParallelism } from "node:os";
import { resolve } from "node:path";

import { retriveParam } from "../helpers.js";

export default async function (req, res) {
  const rand = Math.random();
  console.time(rand);
  const param = retriveParam(req);
  const result = await schedule(param, rand);
  res.end(result);
  console.timeEnd(rand);
}

function schedule(param, requestId) {
  return new Promise((resolve) => {
    const process = processPool[getNextProcessIndex()];

    process.send({ param, requestId });
    pendingRequets[requestId] = resolve;
  });
}

const processPool = [];
const threadsCount = availableParallelism();
for (let i = 0; i < threadsCount; i++) {
  const process = fork(resolve(import.meta.dirname, "calcFibonaci.js"));
  process.on("message", ({ resultStr, requestId }) => {
    pendingRequets[requestId](resultStr);
    delete pendingRequets[requestId];
  });
  processPool.push(process);
}

let lastIndex = 0;
function getNextProcessIndex() {
  if (lastIndex < processPool.length) {
    return lastIndex++;
  } else {
    lastIndex = 0;
    return lastIndex;
  }
}

let pendingRequets = {};
