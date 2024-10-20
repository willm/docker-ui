import {serve} from "@hono/node-server";
import {Hono} from "hono";
import {listHandler} from "./lib/list-handler.js";
import {postHandler} from "./lib/post-handler.js";
import {deleteHandler} from "./lib/delete-handler.js";
import {getHandler} from "./lib/get-handler.js";

const app = new Hono();
app.get("/", listHandler);
app.get("/containers", getHandler);
app.post("/containers", postHandler);
app.delete("/containers/:id", deleteHandler);
serve({fetch: app.fetch, port: 4000});
