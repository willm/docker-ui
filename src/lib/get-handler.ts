import type {Handler} from "hono";
import {listContainers} from "./docker-client.js";
import * as containersView from "./containers-view.js";
import {raw} from "hono/html";

export const getHandler: Handler = async (ctx) => {
  const containerList = await listContainers();
  return ctx.html(`${raw(containersView.render(containerList))}`);
};
