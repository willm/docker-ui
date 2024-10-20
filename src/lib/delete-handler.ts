import {listContainers, deleteContainer} from "./docker-client.js";
import * as containersView from "./containers-view.js";
import type {Handler} from "hono";
import {html, raw} from "hono/html";

export const deleteHandler: Handler = async (ctx) => {
  await deleteContainer({id: ctx.req.param("id")});
  const containerList = await listContainers();
  return ctx.html(html`${raw(containersView.render(containerList))}`);
};
