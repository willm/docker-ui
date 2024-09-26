import {
  listContainers,
  createContainer,
  startContainer,
} from "./docker-client.js";
import * as containersView from "./containers-view.js";
import * as query from "node:querystring";

export const postHandler = async ({matches, req, body, respond}) => {
  const opts = query.parse(body);
  const container = await createContainer({
    ...opts,
    cmd: opts.cmd.split(" "),
  });
  const res = await startContainer({id: container.Id});
  const containerList = await listContainers();
  respond(201, {}, containersView.render(containerList));
};
