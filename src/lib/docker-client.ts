import http from "http";
import type {RequestOptions} from "http";
// docs https://docs.docker.com/reference/api/engine/version/v1.46/#tag/Container
const socketPath = "/var/run/docker.sock";
const apiVersion = "v1.41";

export type ListContainerResponse = {
  Id: string;
  Command: string;
  Created: number;
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

const url = (path: string): string => `/${apiVersion}${path}`;

type APIRequest<T> = {
  path: string;
  method: "GET" | "POST" | "DELETE";
  body?: T;
};

const request = async <T>(opts: APIRequest<T>): Promise<string> => {
  const options: RequestOptions = {
    socketPath: socketPath,
    path: opts.path,
    method: opts.method,
  };
  let bodyStr = JSON.stringify(opts.body);

  if (opts.body) {
    options.headers = {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(bodyStr),
    };
  }

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
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
