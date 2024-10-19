import http from "http";
import querystring, {ParsedUrlQuery} from "querystring";
import type {IncomingMessage, RequestOptions} from "http";

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

export const requestJSON = async (opts: RequestOptions, body: unknown) =>
  request(opts, "application/json", JSON.stringify(body));

export const requestURLEncoded = (
  opts: RequestOptions,
  body?: ParsedUrlQuery
) =>
  request(
    opts,
    "application/x-www-form-urlencoded",
    querystring.stringify(body)
  );

export const request = async (
  opts: RequestOptions,
  contentType: string,
  body: string
): Promise<string> => {
  const options: RequestOptions = {
    socketPath: opts.socketPath,
    path: opts.path,
    method: opts.method,
  };

  if (body) {
    options.headers = {
      "Content-Type": contentType,
      "Content-Length": Buffer.byteLength(body),
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

    if (body) {
      req.write(body);
    }
    req.end();
  });
};
