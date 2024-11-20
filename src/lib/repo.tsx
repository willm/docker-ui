import {Handler} from "hono";
import {getConfig} from "./config.js";
import {listImages} from "./aws.js";
import {Head} from "./components/Head.js";
import {Header} from "./components/Header.js";

export const get: Handler = async (ctx) => {
  const config = await getConfig();
  const registryId = ctx.req.param("id");
  const repo = ctx.req.param("repo");
  const registry = config.registries.find((r) => r.id === registryId);
  if (!registry) {
    return;
  }
  const images = await listImages(registry, repo);
  console.log(images);

  return ctx.html(
    <html>
      <Head />
      <body>
        <Header />
        <main class="px-20 py-10">
          <h1>{repo}</h1>
          <ul>
            {(images.imageDetails || []).map((i) => (
              <li>
                {i.imageDigest?.replace("sha256:", "").slice(0, 8)}{" "}
                {i.imageTags?.join(",")} {i.imagePushedAt?.toLocaleString()}{" "}
                {((i.imageSizeInBytes || 0) / 1000000000).toFixed(2)}GB
              </li>
            ))}
          </ul>
        </main>
      </body>
    </html>
  );
};
