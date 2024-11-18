import {FC} from "hono/jsx";

export const Head: FC = () => (
  <head>
    <script
      src="https://unpkg.com/htmx.org@2.0.2"
      integrity="sha384-Y7hw+L/jvKeWIRRkqWYfPcvVxHzVzn5REgzbawhxAuQGwX1XWe70vji+VSeHOThJ"
      crossorigin="anonymous"
    ></script>
    <script src="https://unpkg.com/htmx.org@1.9.12/dist/ext/response-targets.js"></script>
    <script src="/static/src/htmx-chunked.js" type="text/javascript"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="/static/src/index.js" defer></script>
    <link rel="stylesheet" href="/static/src/style.css"></link>
    <title>Docker</title>
  </head>
);
