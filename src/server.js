import { createServer } from "node:http";

import blocking from "./blocking/index.js";
import partitioned from "./partitioned/index.js";
import offloaded from "./offloaded/index.js";
import offloadedAndPartitioned from "./offloaded-and-partitioned/index.js";

const PORT = 8000;

const server = createServer(async (req, res) => {
  if (req.url.includes("/blocking/")) {
    return blocking(req, res);
  } else if (req.url.includes("/partitioned/")) {
    return await partitioned(req, res);
  } else if (req.url.includes("/offloaded/")) {
    return await offloaded(req, res);
  } else if (req.url.includes("/offloaded-and-partitioned/")) {
    return await offloadedAndPartitioned(req, res);
  }

  res.statusCode = 404;
  res.end();
});

server.listen(PORT, () => {
  console.log(`Server listing  http://localhost:${PORT} ...`);
});
