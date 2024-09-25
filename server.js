import {createServer} from "http";
import {
  listContainers,
  deleteContainer,
  createContainer,
  startContainer,
} from "./lib/docker-client.js";
import * as containersView from "./lib/containers-view.js";
import {Router} from "./lib/router.js";
import * as query from "node:querystring";
import {listHandler} from "./lib/list-handler.js";

createServer(async (req, res) => {
  const router = Router(req, res);
  router.get(new RegExp("/$"), listHandler);

  router.delete(
    /\/containers\/(?<id>[0-9a-z]+)$/,
    async ({matches, respond}) => {
      const deleteRes = await deleteContainer({id: matches.groups.id});
      const containerList = await listContainers();
      respond(200, {}, containersView.render(containerList));
    }
  );

  router.post(/\/containers$/, async ({matches, req, body, respond}) => {
    const opts = query.parse(body);
    const container = await createContainer({
      ...opts,
      cmd: opts.cmd.split(" "),
    });
    const res = await startContainer({id: container.Id});
    const containerList = await listContainers();
    respond(201, {}, containersView.render(containerList));
  });

  router.route();
}).listen(4000);
