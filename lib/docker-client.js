import http from "http";
// docs https://docs.docker.com/reference/api/engine/version/v1.46/#tag/Container
const socketPath = "/var/run/docker.sock";
const apiVersion = "v1.41";

export const listContainers = async () => {
  return JSON.parse(
    await request({path: url("/containers/json"), method: "GET"})
  );
};

export const deleteContainer = async (opts) => {
  return await request({
    path: url(`/containers/${opts.id}?force=true&v=true`),
    method: "DELETE",
  });
};

export const createContainer = async (opts) => {
  return JSON.parse(
    await request({
      path: url(`/containers/create`),
      method: "POST",
      body: {Image: opts.image, Cmd: opts.cmd},
    })
  );
};

export const startContainer = async (opts) => {
  return await request({
    path: url(`/containers/${opts.id}/start`),
    method: "POST",
  });
};

const url = (path) => `/${apiVersion}${path}`;

const request = async (opts) => {
  const options = {
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
