import {configPath} from "./app-paths.js";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import {ECRRegistry} from "./aws.js";

type Config = {
  registries: ECRRegistry[];
};

export const getConfig = async (): Promise<Config> => {
  const path = configPath();
  let config: Config = {registries: []};
  if (fs.existsSync(path)) {
    const file = await fsPromises.readFile(path, "utf8");
    try {
      config = JSON.parse(file);
    } catch (e) {
      console.error("Failed to parse config", e);
    }
  }
  config.registries ??= [];
  return config;
};

export const addRegistry = async (registry: ECRRegistry) => {
  try {
    const config: Config = await getConfig();
    config.registries.push(registry);
    await fsPromises.writeFile(configPath(), JSON.stringify(config));
  } catch (e) {
    console.error("Failed to write config", e);
  }
};
