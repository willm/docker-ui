import {listContainers, deleteContainer} from "./docker-client.js";
import {ContainersList} from "./components/ContainersList.js";
import type {Handler} from "hono";

export const deleteHandler: Handler = async (ctx) => {
  await deleteContainer({id: ctx.req.param("id")});
  const containerList = await listContainers();
  return ctx.html(<ContainersList containers={containerList} />);
};
