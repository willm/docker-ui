import {ECRClient, GetAuthorizationTokenCommand} from "@aws-sdk/client-ecr";
import {fromIni} from "@aws-sdk/credential-providers";

export const getEcrLoginPassword = async (
  registry: ECRRegistry
): Promise<ECRRegistryCredentials> => {
  const client = new ECRClient({
    region: registry.region,
    credentials: fromIni({profile: registry.profile}),
  });

  // Fetch the authorization token
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

  return {password, username, url: authData.proxyEndpoint!};
};

type ECRRegistryCredentials = {
  password: string;
  username: string;
  url: string;
};

export type ECRRegistry = {
  region: string;
  profile: string;
};
