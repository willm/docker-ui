import {listContainers} from "./docker-client.js";
import type {Handler} from "./router.js";
import * as containersView from "./containers-view.js";

export const getHandler: Handler = async ({respond}) => {
  const containerList = await listContainers();
  respond(200, {}, containersView.render(containerList));
};
