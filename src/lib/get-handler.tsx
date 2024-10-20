import type {Handler} from "hono";
import {listContainers} from "./docker-client.js";
import {ContainersList} from "./components/ContainersList.js";

export const getHandler: Handler = async (ctx) => {
  const containerList = await listContainers();
  return ctx.html(<ContainersList containers={containerList} />);
};
