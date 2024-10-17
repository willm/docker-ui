import {
  createContainer,
  startContainer,
  createImage,
  HTTPError,
} from "./docker-client.js";
import * as query from "node:querystring";
import type {Handler} from "./router.js";

type CreateContainerRequest = {
  cmd: string[];
  image: string;
};

const parseRequest = (requestBody: string): CreateContainerRequest => {
  const opts = query.parse(requestBody);
  if (opts.cmd === undefined) {
    throw new Error("missing cmd");
  }
  const cmd: string = Array.isArray(opts.cmd) ? opts.cmd[0] : opts.cmd;

  if (opts.image === undefined) {
    throw new Error("missing image");
  }
  const image: string = Array.isArray(opts.image) ? opts.image[0] : opts.image;

  return {cmd: cmd.split(" "), image};
};

export const postHandler: Handler = async ({body, res, respond}) => {
  let request: CreateContainerRequest;
  try {
    request = parseRequest(body);
  } catch (err) {
    return respond(400, {}, `<p>${(err as Error).message}</p>`);
  }
  const {image, cmd} = request;

  try {
    await new Promise<void>(async (resolve, reject) => {
      res.writeHead(200, {"transfer-encoding": "chunked"});
      const createImageRes = await createImage({
        fromImage: image,
        tag: "latest",
      });
      createImageRes.on("data", (data: Buffer) => {
        res.write(`
          <span>${JSON.parse(data.toString("utf8")).status}</span>
        `);
      });
      createImageRes.on("end", () => resolve());
      createImageRes.on("error", reject);
    });
    const container = await createContainer({
      image,
      cmd,
    });
    await startContainer({id: container.Id});
  } catch (err) {
    console.error(err);
    const httpError = err as HTTPError;
    return respond(
      (err as HTTPError).statusCode || 500,
      {},
      `<p><strong>${httpError?.JSONBody()?.message || httpError.message}</strong></p>`
    );
  }

  res.end(`<button type="submit">
          +
          <span class="htmx-indicator">...</span>
        </button>`);
};
