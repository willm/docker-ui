import {listContainers, deleteContainer} from "./docker-client.js";
import * as containersView from "./containers-view.js";
import type {Handler} from "./router.js";

export const deleteHandler: Handler = async ({matches, respond}) => {
  await deleteContainer({id: matches!.groups!.id});
  const containerList = await listContainers();
  respond(200, {}, containersView.render(containerList));
};
