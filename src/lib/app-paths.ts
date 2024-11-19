const appName = "dockerui";
export const configPath = (): string => {
  return (
    process.env.APPDATA ||
    (process.platform === "darwin"
      ? `${process.env.HOME}/Library/Application Support/${appName}`
      : `${process.env.HOME}/.local/share/${appName}`)
  );
};
