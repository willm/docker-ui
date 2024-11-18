import {serve} from "@hono/node-server";
import {Hono} from "hono";
import {listHandler} from "./lib/list-handler.js";
import {postHandler} from "./lib/post-handler.js";
import {deleteHandler} from "./lib/delete-handler.js";
import {getHandler} from "./lib/get-handler.js";
import {imageSearchHandler} from "./lib/image-search-handler.js";
import {serveStatic} from "@hono/node-server/serve-static";
import * as registries from "./lib/registries.js";

const app = new Hono();
app.get("/", listHandler);
app.get("/containers", getHandler);
app.post("/containers", postHandler);
app.delete("/containers/:id", deleteHandler);

app.get("/registries", registries.get);
app.post("/registries/ecr", registries.postECR);

app.get("/images/search", imageSearchHandler);

app.get("/static/*", serveStatic({root: "./"}));
serve({fetch: app.fetch, port: 4000});
