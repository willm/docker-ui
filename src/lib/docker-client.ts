import http from "http";
import querystring from "querystring";
import type {IncomingMessage, RequestOptions} from "http";
// docs https://docs.docker.com/reference/api/engine/version/v1.46/#tag/Container
const socketPath = "/var/run/docker.sock";
const apiVersion = "v1.41";

export type ListContainerResponse = {
  Id: string;
  Command: string;
  Created: number;
  Image: string;
}[];
export const listContainers = async (): Promise<ListContainerResponse> => {
  return JSON.parse(
    await request({path: url("/containers/json"), method: "GET"})
  );
};

type DeleteContainerRequest = {id: string};
export const deleteContainer = async (opts: DeleteContainerRequest) => {
  return await request({
    path: url(`/containers/${opts.id}?force=true&v=true`),
    method: "DELETE",
  });
};

type CreateContainerRequest = {image: string; cmd: string[]};
export const createContainer = async (opts: CreateContainerRequest) => {
  return JSON.parse(
    await request({
      path: url(`/containers/create`),
      method: "POST",
      contentType: "application/json",
      body: {Image: opts.image, Cmd: opts.cmd},
    })
  );
};

type StartContainerRequest = {id: string};
export const startContainer = async (opts: StartContainerRequest) => {
  return await request({
    path: url(`/containers/${opts.id}/start`),
    method: "POST",
  });
};

type CreateImageRequest = {fromImage: string; tag: string};
export const createImage = (
  createImageReq: CreateImageRequest
): Promise<IncomingMessage> =>
  new Promise((resolve, reject) => {
    const body = querystring.encode(createImageReq);
    const req = http.request(
      {
        socketPath: socketPath,
        path: url(`/images/create`),
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        return resolve(res);
      }
    );
    req.write(body);
    req.end();
  });

const url = (path: string): string => `/${apiVersion}${path}`;

type APIRequest<T extends querystring.ParsedUrlQueryInput> = {
  path: string;
  method: "GET" | "POST" | "DELETE";
  body?: T;
  contentType?: string;
};

export class HTTPError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly res: IncomingMessage,
    public readonly body: string
  ) {
    super(`Request failed with status ${statusCode}`);
    this.name = "HTTPError";
  }

  public JSONBody(): Record<string, unknown> {
    return JSON.parse(this.body);
  }
}

const request = async <T extends querystring.ParsedUrlQueryInput>(
  opts: APIRequest<T>
): Promise<string> => {
  const options: RequestOptions = {
    socketPath: socketPath,
    path: opts.path,
    method: opts.method,
  };

  let bodyStr: string = opts.contentType?.endsWith("json")
    ? JSON.stringify(opts.body)
    : querystring.stringify(opts.body);

  if (bodyStr) {
    options.headers = {
      "Content-Type": opts.contentType,
      "Content-Length": Buffer.byteLength(bodyStr),
    };
  }

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res: IncomingMessage) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res?.statusCode && res.statusCode > 399) {
          return reject(new HTTPError(res.statusCode, res, data));
        }
        resolve(data);
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (opts.body) {
      req.write(bodyStr);
    }
    req.end();
  });
};
