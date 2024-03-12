import { fork } from "node:child_process";
import { availableParallelism } from "node:os";
import { resolve } from "node:path";

import { retriveParam } from "../helpers.js";

export default function (req, res) {
  const rand = Math.random();
  console.time(rand);

  const param = retriveParam(req);
  schedule(param, (resultStr) => {
    res.end(resultStr);
    console.timeEnd(rand);
  });
}

function schedule(param, cb) {
  let index = null;
  let firstNonWorkingProcess = null;
  const foundProcess = processPool.find(([, isWorking], i) => {
    index = i;
    return !isWorking;
  });
  if (foundProcess) {
    [firstNonWorkingProcess] = foundProcess;
  }

  if (firstNonWorkingProcess) {
    scheduleForProcess(firstNonWorkingProcess, index);
  } else {
    for (let i = 0; i < processPool.length; i++) {
      process.once("message", startProcessListner);

      function startProcessListner() {
        for (const procToRemoveListner of processPool) {
          procToRemoveListner.removeListener("message", startProcessListner);
        }
        const [process] = processPool[i];
        scheduleForProcess(process, i);
      }
    }
  }

  function scheduleForProcess(process, indexInPool) {
    process.send({ param });
    process.once("message", ({ resultStr }) => {
      processPool[indexInPool] = [process, false];
      cb(resultStr);
    });
    processPool[indexInPool] = [process, true];
  }
}

const processPool = [];
const threadsCount = availableParallelism();
for (let i = 0; i < threadsCount; i++) {
  processPool.push([
    fork(resolve(import.meta.dirname, "calcFibonaci.js")),
    false,
  ]);
}
