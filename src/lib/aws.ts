import {
  DescribeImagesCommand,
  DescribeRegistryCommand,
  DescribeRepositoriesCommand,
  ECRClient,
  GetAuthorizationTokenCommand,
} from "@aws-sdk/client-ecr";
import {fromIni} from "@aws-sdk/credential-providers";

const getClient = (registry: ECRRegistry): ECRClient => {
  return new ECRClient({
    region: registry.region,
    credentials: fromIni({profile: registry.profile}),
  });
};

export const listImages = async (registry: ECRRegistry, repo: string) => {
  const client = getClient(registry);
  return await client.send(
    new DescribeImagesCommand({
      registryId: registry.id,
      repositoryName: repo,
    })
  );
};

export const listRepos = async (registry: ECRRegistry) => {
  const client = getClient(registry);
  const repos = await client.send(new DescribeRepositoriesCommand());
  console.log(repos);
  return repos;
};

export const getEcrLoginPassword = async (
  registry: ECRRegistry
): Promise<ECRRegistryCredentials> => {
  const client = getClient(registry);
  const command = new GetAuthorizationTokenCommand({});
  const response = await client.send(command);

  if (!response.authorizationData || response.authorizationData.length === 0) {
    throw new Error("No authorization data received");
  }

  // Decode the authorization token (base64 encoded)
  const authData = response.authorizationData[0];
  const decodedToken = Buffer.from(
    authData.authorizationToken as string,
    "base64"
  ).toString("utf-8");

  // The decoded token is in the format 'username:password'
  const [username, password] = decodedToken.split(":");

  const reg = await client.send(new DescribeRegistryCommand());
  if (!reg.registryId) {
    throw new Error("registry not found");
  }
  return {
    password,
    username,
    url: authData.proxyEndpoint!,
    id: reg.registryId,
  };
};

type ECRRegistryCredentials = {
  password: string;
  username: string;
  url: string;
  id: string;
};

export type ECRRegistry = {
  id: string;
  region: string;
  profile: string;
  name: string;
};
