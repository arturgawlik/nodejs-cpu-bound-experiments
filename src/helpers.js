export function retriveParam(req) {
  return Number(req.url.slice(req.url.lastIndexOf("/") + 1));
}
