import http from "http";
import querystring from "querystring";
import {requestJSON, requestURLEncoded} from "./request.js";
import type {IncomingMessage, RequestOptions} from "http";
// docs https://docs.docker.com/reference/api/engine/version/v1.46/#tag/Container
const socketPath = "/var/run/docker.sock";
const apiVersion = "v1.41";

export type Port = {
  PublicPort?: number;
  PrivatePort: number;
  IP: string;
};

export type ListContainerResponse = {
  Id: string;
  Command: string;
  Created: number;
  Image: string;
  Ports: Port[];
}[];
export const listContainers = async (): Promise<ListContainerResponse> => {
  return JSON.parse(
    await requestURLEncoded({
      socketPath,
      path: url("/containers/json"),
      method: "GET",
    })
  );
};

type DeleteContainerRequest = {id: string};
export const deleteContainer = async (opts: DeleteContainerRequest) => {
  return await requestURLEncoded({
    socketPath,
    path: url(`/containers/${opts.id}?force=true&v=true`),
    method: "DELETE",
  });
};

type CreateContainerRequest = {image: string; cmd: string[]};
export const createContainer = async (opts: CreateContainerRequest) => {
  return JSON.parse(
    await requestJSON(
      {
        socketPath,
        path: url(`/containers/create`),
        method: "POST",
      },
      {
        Image: opts.image,
        Cmd: opts.cmd,
      }
    )
  );
};

type StartContainerRequest = {id: string};
export const startContainer = async (opts: StartContainerRequest) => {
  return await requestURLEncoded({
    socketPath,
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
