import type {ServerResponse, IncomingMessage} from "http";
import {Stream} from "stream";

const respondWithHTML = (
  res: ServerResponse,
  statusCode: number,
  headers: Record<string, string>,
  body: string | Stream
) => {
  res.writeHead(statusCode, {"Content-Type": "text/html", ...headers});
  res.end(body);
};

type RouterContext = {
  req: IncomingMessage;
  res: ServerResponse;
  matches: RegExpMatchArray | null;
  body: string;
  respond: (
    statusCode: number,
    headers: Record<string, string>,
    body: string | Stream
  ) => void;
};

export type Handler = (context: RouterContext) => Promise<void>;

export const Router = (req: IncomingMessage, res: ServerResponse) => {
  const routes: ["GET" | "POST" | "DELETE", RegExp, Handler][] = [];
  const respond = respondWithHTML.bind(null, res);
  return {
    get: (urlPattern: RegExp, fn: Handler) => {
      routes.push(["GET", urlPattern, fn]);
    },
    delete: async (urlPattern: RegExp, fn: Handler) => {
      routes.push(["DELETE", urlPattern, fn]);
    },
    post: async (urlPattern: RegExp, fn: Handler) => {
      routes.push(["POST", urlPattern, fn]);
    },
    route: async () => {
      const requestBody: string = await new Promise((resolve, reject) => {
        let data = "";

        req.on("data", (chunk) => {
          data += chunk;
        });
        req.on("end", () => {
          resolve(data);
        });
      });
      for (const route of routes) {
        const [method, pattern, fn] = route;
        const matches = req?.url?.match(pattern) || null;
        const context = {req, res, respond, matches, body: requestBody};
        if (req.method === method && matches) {
          return await fn(context);
        }
      }
      respond(404, {}, `<html></html>`);
    },
  };
};
