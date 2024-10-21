import {Button} from "./components/Button.js";
import {createContainer, startContainer, createImage} from "./docker-client.js";
import {HTTPError} from "./request.js";
import type {Handler} from "hono";
import {html} from "hono/html";
import {stream} from "hono/streaming";

type CreateContainerRequest = {
  cmd: string[];
  image: string;
  tcpPorts: Map<number, number>;
};

const parseRequest = (opts: {
  cmd: string;
  image: string;
  containerPort: string;
  hostPort: string;
}): CreateContainerRequest => {
  if (opts.cmd === undefined) {
    throw new Error("missing cmd");
  }
  const cmd: string = Array.isArray(opts.cmd) ? opts.cmd[0] : opts.cmd;

  if (opts.image === undefined) {
    throw new Error("missing image");
  }
  const image: string = Array.isArray(opts.image) ? opts.image[0] : opts.image;

  const tcpPorts: [number, number][] = [];
  if (opts.hostPort && opts.containerPort) {
    tcpPorts.push([Number(opts.hostPort), Number(opts.containerPort)]);
  }

  return {cmd: cmd.split(" "), image, tcpPorts: new Map(tcpPorts)};
};

export const postHandler: Handler = async (ctx) => {
  let request: CreateContainerRequest;
  try {
    request = parseRequest(await ctx.req.parseBody());
  } catch (err) {
    ctx.status(400);
    return ctx.html(html`<p>${(err as Error).message}</p>`);
  }
  const {image, cmd, tcpPorts} = request;

  return stream(
    ctx,
    async (stream) => {
      const createImageRes = await createImage({
        fromImage: image,
        tag: "latest",
      });
      await new Promise<void>((resolve, reject) => {
        createImageRes.on("data", async (data: Buffer) => {
          await stream.write(`
          <span>${JSON.parse(data.toString("utf8")).status}</span>
        `);
        });
        createImageRes.on("end", () => resolve());
        createImageRes.on("error", reject);
      });
      const container = await createContainer({
        image,
        cmd,
        tcpPorts,
      });
      await startContainer({id: container.Id});
      const btn = (
        <Button type="submit">
          +<span class="htmx-indicator">...</span>
        </Button>
      );
      await stream.write(btn.toString());
    },
    async (err, stream) => {
      console.error(err);
      const httpError = err as HTTPError;
      stream.write(
        `<p><strong>${httpError?.JSONBody()?.message || httpError.message}</strong></p>`
      );
    }
  );
};
