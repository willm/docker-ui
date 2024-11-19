import {Handler} from "hono";
import {getConfig} from "./config.js";
import {listRepos} from "./aws.js";
import {Head} from "./components/Head.js";
import {Header} from "./components/Header.js";
import {Link} from "./components/Link.js";

export const get: Handler = async (ctx) => {
  const config = await getConfig();
  const registryId = ctx.req.param("id");
  const registry = config.registries.find((r) => r.id === registryId);
  if (!registry) {
    return;
  }
  const repos = await listRepos(registry);

  return ctx.html(
    <html>
      <Head />
      <body>
        <Header />
        <main class="px-20 py-10">
          <h1>{registry.name}</h1>
          <ul>
            {(repos?.repositories || []).map((r) => (
              <li>
                <Link
                  href={`/registries/${registryId}/${r.repositoryName}`}
                  alt={r.repositoryName || "repo"}
                >
                  {r.repositoryName}
                </Link>
              </li>
            ))}
          </ul>
        </main>
      </body>
    </html>
  );
};
