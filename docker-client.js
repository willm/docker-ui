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

const url = (path) => `/${apiVersion}${path}`;

const request = async (opts) => {
  const options = {
    socketPath: socketPath,
    path: opts.path,
    method: opts.method,
  };

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

    req.end();
  });
};
