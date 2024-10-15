import {createServer} from "http";
import {Router} from "./lib/router.js";
import {listHandler} from "./lib/list-handler.js";
import {postHandler} from "./lib/post-handler.js";
import {deleteHandler} from "./lib/delete-handler.js";
import {getHandler} from "./lib/get-handler.js";

createServer((req, res) => {
  const router = Router(req, res);
  router.get(/\/$/, listHandler);

  router.delete(/\/containers\/(?<id>[0-9a-z]+)$/, deleteHandler);

  router.post(/\/containers$/, postHandler);

  router.get(/\/containers$/, getHandler);

  router.route();
}).listen(4000);
