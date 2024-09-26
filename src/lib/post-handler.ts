import {
  listContainers,
  createContainer,
  startContainer,
} from "./docker-client.js";
import * as containersView from "./containers-view.js";
import * as query from "node:querystring";
import type {Handler} from "./router.js";

export const postHandler: Handler = async ({body, respond}) => {
  const opts = query.parse(body);
  if (opts.cmd === undefined) {
    return respond(400, {}, "<p>missing command</p>");
  }
  const cmd: string = Array.isArray(opts.cmd) ? opts.cmd[0] : opts.cmd;
  if (opts.image === undefined) {
    return respond(400, {}, "<p>missing image</p>");
  }
  const image: string = Array.isArray(opts.image) ? opts.image[0] : opts.image;
  const container = await createContainer({
    image,
    cmd: cmd.split(" "),
  });
  const res = await startContainer({id: container.Id});
  const containerList = await listContainers();
  respond(201, {}, containersView.render(containerList));
};
