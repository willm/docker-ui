import {listContainers, deleteContainer} from "./docker-client.js";
import * as containersView from "./containers-view.js";

export const deleteHandler = async ({matches, respond}) => {
  const deleteRes = await deleteContainer({id: matches.groups.id});
  const containerList = await listContainers();
  respond(200, {}, containersView.render(containerList));
};
