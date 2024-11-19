import type {Handler} from "hono";
import {Header} from "./components/Header.js";
import {Head} from "./components/Head.js";
import {TextInput} from "./components/Input.js";
import {Label} from "./components/Label.js";
import {Button} from "./components/Button.js";
import {ECRRegistry, getEcrLoginPassword} from "./aws.js";
import {auth} from "./docker-client.js";
import {addRegistry, getConfig} from "./config.js";
import {Link} from "./components/Link.js";
import {randomUUID} from "node:crypto";

export const postECR: Handler = async (ctx) => {
  const request: ECRRegistry = await ctx.req.parseBody();
  request.id = randomUUID();
  const creds = await getEcrLoginPassword(request);
  const token = await auth({...creds, serveraddress: creds.url});
  console.log(token);
  await addRegistry(request);
  return ctx.redirect("/registries", 302);
};

export const get: Handler = async (ctx) => {
  const config = await getConfig();
  return ctx.html(
    <html>
      <Head />
      <body>
        <Header />
        <main class="px-20 py-10">
          <h1>Registries</h1>
          {config.registries.map((r) => (
            <h2>
              <Link alt={r.name} href={`/registries/${r.id}`}>
                {r.name}
              </Link>
            </h2>
          ))}
          <div class="flex items-center space-x-10">
            <img
              src="/static/images/ecr.png"
              alt="ecr"
              height="100"
              width="100"
            />
            <h2>ECR</h2>
          </div>
          <form method="post" action="/registries/ecr">
            <Label for="name">Name</Label>
            <TextInput
              autofocus={true}
              name="name"
              id="name"
              required={true}
              placeholder="private registry"
            />

            <Label for="account_id">Account Id</Label>
            <TextInput
              name="account_id"
              id="account_id"
              required={true}
              placeholder="012345678901"
            />

            <Label for="account_id">Region</Label>
            <TextInput
              name="region"
              id="region"
              required={true}
              placeholder="eu-central-1"
            />

            <Label for="profile">Profile</Label>
            <TextInput
              name="profile"
              id="profile"
              required={false}
              placeholder="default"
            />
            <Button type="submit">+</Button>
          </form>
        </main>
      </body>
    </html>
  );
};
