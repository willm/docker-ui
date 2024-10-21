import type {Handler} from "hono";
import {listContainers} from "./docker-client.js";
import {ContainerCard} from "./components/ContainerCard.js";

export const getHandler: Handler = async (ctx) => {
  const containerList = await listContainers();
  return ctx.html(
    <>
      {containerList.map((container) => (
        <ContainerCard container={container} />
      ))}
    </>
  );
};
