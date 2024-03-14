import { fork } from "node:child_process";
import { availableParallelism } from "node:os";
import { resolve } from "node:path";

import { retriveParam } from "../helpers.js";

export default async function (req, res) {
  const param = retriveParam(req);
  const result = await schedule(param);
  res.end(result);
}

function schedule(param) {
  const requestId = Math.random();
  return new Promise((resolve) => {
    const process = processPool[getNextProcessIndex()];

    process.send({ param, requestId });
    pendingRequets[requestId] = resolve;
  });
}

const processPool = [];
const threadsCount = availableParallelism() / 2;
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
